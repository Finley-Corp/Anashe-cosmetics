/**
 * Step 1 – upload images to ImageKit, save URLs to scripts/seed-urls.json
 * Step 2 – read seed-urls.json, write scripts/seed.sql  (paste into Neon SQL editor)
 *
 * Run:
 *   npm run db:generate-sql
 * Then open https://console.neon.tech, pick your project → SQL Editor, paste seed.sql and run it.
 */
import dns from "node:dns";
import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import { uploadRemoteToImageKit } from "../src/lib/imagekit-server";
import { SEED_PRODUCTS } from "./seed-data";

dns.setDefaultResultOrder("ipv4first");
config({ path: ".env.local" });
config({ path: ".env" });

const URLS_FILE = path.resolve(__dirname, "seed-urls.json");
const SQL_FILE = path.resolve(__dirname, "seed.sql");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function esc(v: string | null): string {
  if (v === null) return "NULL";
  return `'${v.replace(/'/g, "''")}'`;
}

async function main() {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    console.error("Missing IMAGEKIT_PRIVATE_KEY in .env.local");
    process.exit(1);
  }

  // ── Step 1: upload images ────────────────────────────────────────────────
  let saved: Record<string, string[]> = {};
  if (fs.existsSync(URLS_FILE)) {
    saved = JSON.parse(fs.readFileSync(URLS_FILE, "utf8")) as Record<string, string[]>;
    console.log(`Loaded existing URLs from ${URLS_FILE}`);
  }

  for (const p of SEED_PRODUCTS) {
    if (saved[p.slug] && saved[p.slug].length >= p.sourceImageUrls.length) {
      console.log(`Skip ${p.slug} (already uploaded)`);
      continue;
    }
    const uploaded: string[] = [];
    let i = 0;
    for (const src of p.sourceImageUrls) {
      const ext = src.includes("png") ? "png" : "jpg";
      const fileName = `${p.slug}-${i}.${ext}`;
      process.stdout.write(`Uploading ${fileName}… `);
      const url = await uploadRemoteToImageKit(src, fileName, "anashe/products");
      uploaded.push(url);
      console.log(`ok → ${url}`);
      i++;
      await sleep(350);
    }
    saved[p.slug] = uploaded;
    fs.writeFileSync(URLS_FILE, JSON.stringify(saved, null, 2));
  }

  // ── Step 2: generate SQL ─────────────────────────────────────────────────
  const lines: string[] = [
    "-- Run this in the Neon SQL Editor: https://console.neon.tech",
    "-- (schema must already exist — run src/db/schema.sql first if not done yet)",
    "",
  ];

  for (const p of SEED_PRODUCTS) {
    const urls = saved[p.slug] ?? [];
    const imageUrl = urls[0] ?? "";
    const galleryJson = JSON.stringify(urls).replace(/'/g, "''");
    const keywordsJson = JSON.stringify(p.keywords).replace(/'/g, "''");
    const swatchesJson = JSON.stringify(p.swatches).replace(/'/g, "''");

    lines.push(`INSERT INTO products (
  slug, name, description, price, image_url, gallery_json,
  keywords_json, swatches_json, material, tag, shade_count,
  detail_href, default_variant, sort_order, pdp_key
) VALUES (
  ${esc(p.slug)},
  ${esc(p.name)},
  ${esc(p.description)},
  ${p.price},
  ${esc(imageUrl)},
  '${galleryJson}',
  '${keywordsJson}',
  '${swatchesJson}',
  ${esc(p.material)},
  ${esc(p.tag)},
  ${p.shadeCount ?? "NULL"},
  ${esc(p.detailHref)},
  ${esc(p.defaultVariant)},
  ${p.sortOrder},
  ${esc(p.pdpKey)}
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  gallery_json = EXCLUDED.gallery_json,
  keywords_json = EXCLUDED.keywords_json,
  swatches_json = EXCLUDED.swatches_json,
  material = EXCLUDED.material,
  tag = EXCLUDED.tag,
  shade_count = EXCLUDED.shade_count,
  detail_href = EXCLUDED.detail_href,
  default_variant = EXCLUDED.default_variant,
  sort_order = EXCLUDED.sort_order,
  pdp_key = EXCLUDED.pdp_key,
  updated_at = NOW();
`);
  }

  fs.writeFileSync(SQL_FILE, lines.join("\n"));
  console.log(`\nSQL written to ${SQL_FILE}`);
  console.log("Next steps:");
  console.log("  1. Make sure the schema exists — run src/db/schema.sql in Neon SQL Editor first");
  console.log("  2. Open https://console.neon.tech → your project → SQL Editor");
  console.log("  3. Paste the contents of scripts/seed.sql and click Run");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
