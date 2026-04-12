-- ANASHE products (Neon PostgreSQL)
-- Run in Neon SQL Editor once, then: npm run db:seed

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  image_url TEXT NOT NULL,
  gallery_json TEXT NOT NULL DEFAULT '[]',
  keywords_json TEXT NOT NULL DEFAULT '[]',
  swatches_json TEXT NOT NULL DEFAULT '[]',
  material TEXT,
  tag TEXT,
  shade_count INTEGER,
  detail_href TEXT,
  default_variant TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  pdp_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_sort ON products (sort_order);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
