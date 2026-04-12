/**
 * Seeds Neon directly via its HTTP SQL endpoint (no TCP / no pg driver needed).
 * Reads ImageKit URLs from scripts/seed-urls.json (produced by npm run db:generate-sql).
 *
 *   npm run db:seed-http
 */
import dns from "node:dns";
import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import { SEED_PRODUCTS } from "./seed-data";

dns.setDefaultResultOrder("ipv4first");
config({ path: ".env.local" });
config({ path: ".env" });

const URLS_FILE = path.resolve(__dirname, "seed-urls.json");

async function neonQuery(
  host: string,
  connStr: string,
  query: string,
  params: unknown[] = []
): Promise<void> {
  const res = await fetch(`https://${host}/sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Neon-Connection-String": connStr,
    },
    body: JSON.stringify({ query, params }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Neon HTTP ${res.status}: ${body}`);
  }
}

async function main() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    console.error("Missing DATABASE_URL in .env.local");
    process.exit(1);
  }

  // Extract just the host from the connection string
  const parsed = new URL(rawUrl);
  const host = parsed.hostname; // e.g. ep-nameless-mountain-...-pooler.c-6.us-east-1.aws.neon.tech

  if (!fs.existsSync(URLS_FILE)) {
    console.error(`${URLS_FILE} not found — run "npm run db:generate-sql" first`);
    process.exit(1);
  }
  const imageUrls = JSON.parse(fs.readFileSync(URLS_FILE, "utf8")) as Record<string, string[]>;

  const SQL = `INSERT INTO products (
  slug, name, description, price, image_url, gallery_json,
  keywords_json, swatches_json, material, tag, shade_count,
  detail_href, default_variant, sort_order, pdp_key
) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
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
  updated_at = NOW()`;

  for (const p of SEED_PRODUCTS) {
    const urls = imageUrls[p.slug] ?? [];
    const imageUrl = urls[0] ?? "";
    process.stdout.write(`Inserting ${p.slug}… `);
    await neonQuery(host, rawUrl, SQL, [
      p.slug,
      p.name,
      p.description,
      p.price,
      imageUrl,
      JSON.stringify(urls),
      JSON.stringify(p.keywords),
      JSON.stringify(p.swatches),
      p.material,
      p.tag,
      p.shadeCount,
      p.detailHref,
      p.defaultVariant,
      p.sortOrder,
      p.pdpKey,
    ]);
    console.log("ok");
  }

  console.log(`\nAll ${SEED_PRODUCTS.length} products saved to Neon.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
