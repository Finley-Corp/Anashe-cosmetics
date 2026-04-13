import { Pool } from "pg";
import { PRODUCTS, type Product } from "@/lib/products";

const DATABASE_URL = process.env.DATABASE_URL ?? process.env.DATABASE_URL_DIRECT;

const globalForDb = globalThis as unknown as { pool?: Pool; neonCatalogReady?: Promise<void> };

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: DATABASE_URL,
    max: 5,
    ssl: DATABASE_URL ? { rejectUnauthorized: false } : undefined,
  });

if (!globalForDb.pool) {
  globalForDb.pool = pool;
}

async function ensureSchemaAndSeed() {
  if (!DATABASE_URL) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      price INTEGER NOT NULL,
      category TEXT NOT NULL,
      badge TEXT,
      is_new BOOLEAN NOT NULL DEFAULT FALSE,
      image TEXT NOT NULL,
      hover_image TEXT NOT NULL,
      description TEXT NOT NULL,
      details JSONB NOT NULL,
      gallery JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS name TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS subtitle TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS price INTEGER;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS badge TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS image TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS hover_image TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS hover_image_url TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
    ALTER TABLE products ALTER COLUMN updated_at SET DEFAULT now();
    ALTER TABLE products ALTER COLUMN is_new SET DEFAULT FALSE;
    CREATE UNIQUE INDEX IF NOT EXISTS products_slug_key ON products(slug);
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS segments (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS product_segments (
      product_slug TEXT NOT NULL REFERENCES products(slug) ON DELETE CASCADE,
      segment_slug TEXT NOT NULL REFERENCES segments(slug) ON DELETE CASCADE,
      PRIMARY KEY (product_slug, segment_slug)
    );
  `);

  const segmentRows = [
    { slug: "new-in", title: "New In", description: "Latest skincare arrivals" },
    { slug: "best-sellers", title: "Best Sellers", description: "Most loved products" },
    { slug: "by-concern-glow", title: "Glow", description: "Brightness and radiance" },
    { slug: "by-concern-acne", title: "Acne", description: "Breakout and blemish control" },
    { slug: "by-concern-anti-aging", title: "Anti-Aging", description: "Fine lines and texture" },
  ];

  for (const segment of segmentRows) {
    await pool.query(
      `
      INSERT INTO segments (slug, title, description)
      VALUES ($1, $2, $3)
      ON CONFLICT (slug)
      DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description
      `,
      [segment.slug, segment.title, segment.description],
    );
  }

  const {
    rows: [{ count }],
  } = await pool.query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM products`);
  const shouldSeedProducts = Number(count) === 0;

  if (!shouldSeedProducts) return;

  for (const product of PRODUCTS) {
    await pool.query(
      `
      INSERT INTO products (
        id, slug, name, subtitle, price, category, badge, is_new,
        image, image_url, hover_image, hover_image_url, description, details, gallery
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15::jsonb)
      ON CONFLICT (id)
      DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        subtitle = EXCLUDED.subtitle,
        price = EXCLUDED.price,
        category = EXCLUDED.category,
        badge = EXCLUDED.badge,
        is_new = EXCLUDED.is_new,
        image = EXCLUDED.image,
        image_url = EXCLUDED.image_url,
        hover_image = EXCLUDED.hover_image,
        hover_image_url = EXCLUDED.hover_image_url,
        description = EXCLUDED.description,
        details = EXCLUDED.details,
        gallery = EXCLUDED.gallery,
        updated_at = now()
      `,
      [
        product.id,
        product.slug,
        product.name,
        product.subtitle,
        product.price,
        product.category,
        product.badge,
        product.isNew,
        product.image,
        product.image,
        product.hoverImage,
        product.hoverImage,
        product.description,
        JSON.stringify(product.details),
        JSON.stringify(product.gallery),
      ],
    );

    const segmentSlugs = new Set<string>();
    if (product.isNew) segmentSlugs.add("new-in");
    if (product.badge === "Best Seller") segmentSlugs.add("best-sellers");

    if (["The Ordinary", "Black Girl Sunscreen"].includes(product.category)) {
      segmentSlugs.add("by-concern-glow");
    }
    if (["The Ordinary", "La Roche-Posay"].includes(product.category)) {
      segmentSlugs.add("by-concern-acne");
    }
    if (["CeraVe", "La Roche-Posay"].includes(product.category)) {
      segmentSlugs.add("by-concern-anti-aging");
    }

    await pool.query(`DELETE FROM product_segments WHERE product_slug = $1`, [product.slug]);
    for (const segment of segmentSlugs) {
      await pool.query(
        `INSERT INTO product_segments (product_slug, segment_slug) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [product.slug, segment],
      );
    }
  }
}

function getSegmentSlugsForProduct(input: {
  category: string;
  badge: string | null;
  isNew: boolean;
}): string[] {
  const segmentSlugs = new Set<string>();
  if (input.isNew) segmentSlugs.add("new-in");
  if (input.badge === "Best Seller") segmentSlugs.add("best-sellers");

  if (["The Ordinary", "Black Girl Sunscreen"].includes(input.category)) {
    segmentSlugs.add("by-concern-glow");
  }
  if (["The Ordinary", "La Roche-Posay"].includes(input.category)) {
    segmentSlugs.add("by-concern-acne");
  }
  if (["CeraVe", "La Roche-Posay"].includes(input.category)) {
    segmentSlugs.add("by-concern-anti-aging");
  }

  return [...segmentSlugs];
}

async function syncProductSegments(
  productSlug: string,
  input: { category: string; badge: string | null; isNew: boolean },
) {
  const segmentSlugs = getSegmentSlugsForProduct(input);
  await pool.query(`DELETE FROM product_segments WHERE product_slug = $1`, [productSlug]);
  for (const segment of segmentSlugs) {
    await pool.query(
      `INSERT INTO product_segments (product_slug, segment_slug) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [productSlug, segment],
    );
  }
}

async function ensureReady() {
  if (!DATABASE_URL) return;
  if (!globalForDb.neonCatalogReady) {
    globalForDb.neonCatalogReady = ensureSchemaAndSeed();
  }

  try {
    await globalForDb.neonCatalogReady;
  } catch (error) {
    // Reset failed init promise so the next request can retry DB setup.
    globalForDb.neonCatalogReady = undefined;
    throw error;
  }
}

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  category: string;
  badge: string | null;
  is_new: boolean;
  image: string;
  image_url?: string | null;
  hover_image: string;
  hover_image_url?: string | null;
  description: string;
  details: unknown;
  gallery: unknown;
};

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    price: row.price,
    category: row.category,
    badge: row.badge,
    isNew: row.is_new,
    image: row.image ?? row.image_url ?? "",
    hoverImage: row.hover_image ?? row.hover_image_url ?? row.image ?? row.image_url ?? "",
    description: row.description,
    details: Array.isArray(row.details) ? row.details : [],
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
  };
}

export async function getCatalogProducts(): Promise<Product[]> {
  if (!DATABASE_URL) return PRODUCTS;
  try {
    await ensureReady();
    const { rows } = await pool.query(`SELECT * FROM products ORDER BY id ASC`);
    return rows.map(rowToProduct);
  } catch {
    console.warn("Neon read failed in getCatalogProducts, using fallback catalog.");
    return PRODUCTS;
  }
}

export async function getCatalogProductBySlug(slug: string): Promise<Product | undefined> {
  if (!DATABASE_URL) return PRODUCTS.find((p) => p.slug === slug);
  try {
    await ensureReady();
    const { rows } = await pool.query(`SELECT * FROM products WHERE slug = $1 LIMIT 1`, [slug]);
    return rows[0] ? rowToProduct(rows[0]) : undefined;
  } catch {
    console.warn("Neon read failed in getCatalogProductBySlug, using fallback product.");
    return PRODUCTS.find((p) => p.slug === slug);
  }
}

export async function getProductsBySegment(segmentSlug: string): Promise<Product[]> {
  if (!DATABASE_URL) {
    if (segmentSlug === "new-in") return PRODUCTS.filter((p) => p.isNew);
    if (segmentSlug === "best-sellers") return PRODUCTS.filter((p) => p.badge === "Best Seller");
    return PRODUCTS;
  }

  try {
    await ensureReady();
    const { rows } = await pool.query(
      `
      SELECT p.*
      FROM products p
      INNER JOIN product_segments ps ON ps.product_slug = p.slug
      WHERE ps.segment_slug = $1
      ORDER BY p.id ASC
      `,
      [segmentSlug],
    );
    return rows.map(rowToProduct);
  } catch {
    console.warn("Neon read failed in getProductsBySegment, using fallback segment data.");
    if (segmentSlug === "new-in") return PRODUCTS.filter((p) => p.isNew);
    if (segmentSlug === "best-sellers") return PRODUCTS.filter((p) => p.badge === "Best Seller");
    return PRODUCTS;
  }
}

export type AdminProductInput = {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  category: string;
  badge: string | null;
  isNew: boolean;
  image: string;
  hoverImage: string;
  description: string;
};

function assertDbConfigured() {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }
}

export async function createAdminProduct(input: AdminProductInput): Promise<void> {
  assertDbConfigured();
  await ensureReady();

  const {
    rows: [{ next_id }],
  } = await pool.query<{ next_id: number }>(
    `SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM products`,
  );

  await pool.query(
    `
    INSERT INTO products (
      id, slug, name, subtitle, price, category, badge, is_new,
      image, image_url, hover_image, hover_image_url, description, details, gallery
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'[]'::jsonb,'[]'::jsonb)
    `,
    [
      next_id,
      input.slug,
      input.name,
      input.subtitle,
      input.price,
      input.category,
      input.badge,
      input.isNew,
      input.image,
      input.image,
      input.hoverImage,
      input.hoverImage,
      input.description,
    ],
  );

  await syncProductSegments(input.slug, input);
}

export async function updateAdminProduct(id: number, input: AdminProductInput): Promise<void> {
  assertDbConfigured();
  await ensureReady();

  const previous = await pool.query<{ slug: string }>(
    `SELECT slug FROM products WHERE id = $1 LIMIT 1`,
    [id],
  );
  const previousSlug = previous.rows[0]?.slug;

  await pool.query(
    `
    UPDATE products
    SET slug = $2,
        name = $3,
        subtitle = $4,
        price = $5,
        category = $6,
        badge = $7,
        is_new = $8,
        image = $9,
        image_url = $10,
        hover_image = $11,
        hover_image_url = $12,
        description = $13,
        updated_at = now()
    WHERE id = $1
    `,
    [
      id,
      input.slug,
      input.name,
      input.subtitle,
      input.price,
      input.category,
      input.badge,
      input.isNew,
      input.image,
      input.image,
      input.hoverImage,
      input.hoverImage,
      input.description,
    ],
  );

  if (previousSlug && previousSlug !== input.slug) {
    await pool.query(`DELETE FROM product_segments WHERE product_slug = $1`, [previousSlug]);
  }
  await syncProductSegments(input.slug, input);
}

export async function deleteAdminProduct(id: number): Promise<void> {
  assertDbConfigured();
  await ensureReady();
  await pool.query(`DELETE FROM products WHERE id = $1`, [id]);
}

export async function deleteAllAdminProducts(): Promise<void> {
  assertDbConfigured();
  await ensureReady();
  await pool.query(`TRUNCATE TABLE product_segments`);
  await pool.query(`DELETE FROM products`);
}
