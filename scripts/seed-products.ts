/**
 * Uploads each product image to ImageKit (bucket) and inserts rows into Neon with ImageKit URLs only.
 *
 * Uses `pg` (TCP) instead of `@neondatabase/serverless` (HTTP fetch) so local seed works on WSL2 /
 * networks where the serverless driver's fetch path times out.
 *
 * Usage (from repo root):
 *   npm run db:seed
 *
 * Requires .env.local with DATABASE_URL, IMAGEKIT_PRIVATE_KEY.
 */
import dns from "node:dns";
import { config } from "dotenv";
import { Pool } from "pg";
import { uploadRemoteToImageKit } from "../src/lib/imagekit-server";
import { SEED_PRODUCTS } from "./seed-data";

/** Prefer IPv4 on WSL2 / broken IPv6 routes (avoids ENETUNREACH on Neon AAAA records). */
dns.setDefaultResultOrder("ipv4first");

config({ path: ".env.local" });
config({ path: ".env" });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Drop channel_binding — can break some libpq clients; Neon works with sslmode=require alone. */
function connectionStringForPg(raw: string): string {
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    return u.toString();
  } catch {
    return raw;
  }
}

async function withRetries<T>(label: string, fn: () => Promise<T>, attempts = 4): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      const wait = 800 * 2 ** i;
      console.warn(`${label} failed (attempt ${i + 1}/${attempts}), retrying in ${wait}ms…`);
      await sleep(wait);
    }
  }
  throw last;
}

async function main() {
  // Prefer DATABASE_URL_DIRECT (no -pooler in hostname) for TCP connections via `pg`.
  // Fall back to DATABASE_URL (the pooler URL also works over TCP, but direct is more reliable).
  const url = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL;
  if (!url) {
    console.error("Missing DATABASE_URL or DATABASE_URL_DIRECT");
    process.exit(1);
  }
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    console.error("Missing IMAGEKIT_PRIVATE_KEY");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: connectionStringForPg(url),
    max: 2,
    connectionTimeoutMillis: 30_000,
  });

  try {
    for (const p of SEED_PRODUCTS) {
      const uploaded: string[] = [];
      let i = 0;
      for (const src of p.sourceImageUrls) {
        const ext = src.includes("png") ? "png" : "jpg";
        const fileName = `${p.slug}-${i}.${ext}`;
        process.stdout.write(`Uploading ${fileName}… `);
        const ikUrl = await uploadRemoteToImageKit(src, fileName, "anashe/products");
        uploaded.push(ikUrl);
        console.log("ok");
        i += 1;
        await sleep(350);
      }

      const imageUrl = uploaded[0];
      const galleryJson = JSON.stringify(uploaded);
      const keywordsJson = JSON.stringify(p.keywords);
      const swatchesJson = JSON.stringify(p.swatches);

      await withRetries(`DB insert ${p.slug}`, () =>
        pool.query(
          `INSERT INTO products (
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
        updated_at = NOW()`,
          [
            p.slug,
            p.name,
            p.description,
            p.price,
            imageUrl,
            galleryJson,
            keywordsJson,
            swatchesJson,
            p.material,
            p.tag,
            p.shadeCount,
            p.detailHref,
            p.defaultVariant,
            p.sortOrder,
            p.pdpKey,
          ]
        )
      );
      console.log(`Saved product: ${p.slug}`);
    }

    console.log("Seed complete.");
  } finally {
    await pool.end().catch(() => {});
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
