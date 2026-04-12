-- Run this in the Neon SQL Editor: https://console.neon.tech
-- (schema must already exist — run src/db/schema.sql first if not done yet)

INSERT INTO products (
  slug, name, description, price, image_url, gallery_json,
  keywords_json, swatches_json, material, tag, shade_count,
  detail_href, default_variant, sort_order, pdp_key
) VALUES (
  'barrier-serum',
  'Barrier Restore Serum',
  'All skin types · barrier-supporting serum with niacinamide.',
  1295,
  'https://ik.imagekit.io/5dondemhf/anashe/products/barrier-serum-0_6mkO1iNRW.jpg',
  '["https://ik.imagekit.io/5dondemhf/anashe/products/barrier-serum-0_6mkO1iNRW.jpg","https://ik.imagekit.io/5dondemhf/anashe/products/barrier-serum-1_fCeRnrMfh.jpg","https://ik.imagekit.io/5dondemhf/anashe/products/barrier-serum-2_jlj-VjMQZ.jpg","https://ik.imagekit.io/5dondemhf/anashe/products/barrier-serum-3_slPgm1zmX.jpg"]',
  '["serum","niacinamide","skincare","barrier"]',
  '["#F3F4F6","#E8DFD4"]',
  'All skin types · 30 ml',
  'NEW',
  NULL,
  '/product-detail-page',
  '30 ml',
  1,
  'serum'
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

INSERT INTO products (
  slug, name, description, price, image_url, gallery_json,
  keywords_json, swatches_json, material, tag, shade_count,
  detail_href, default_variant, sort_order, pdp_key
) VALUES (
  'cloud-cream',
  'Cloud Cream Moisturizer',
  'Dry to combination · ceramide-rich moisturizer.',
  890,
  'https://ik.imagekit.io/5dondemhf/anashe/products/cloud-cream-0_xA9uIEEIz.jpg',
  '["https://ik.imagekit.io/5dondemhf/anashe/products/cloud-cream-0_xA9uIEEIz.jpg"]',
  '["moisturizer","cream","ceramide","dry"]',
  '["#F5F0E8","#D4C4B0"]',
  'Dry to combination',
  NULL,
  NULL,
  NULL,
  'Unscented',
  2,
  NULL
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

INSERT INTO products (
  slug, name, description, price, image_url, gallery_json,
  keywords_json, swatches_json, material, tag, shade_count,
  detail_href, default_variant, sort_order, pdp_key
) VALUES (
  'soft-focus-concealer',
  'Soft Focus Concealer',
  'Full coverage · C / W / N undertones.',
  895,
  'https://ik.imagekit.io/5dondemhf/anashe/products/soft-focus-concealer-0_z5sdle6sT.jpg',
  '["https://ik.imagekit.io/5dondemhf/anashe/products/soft-focus-concealer-0_z5sdle6sT.jpg","https://ik.imagekit.io/5dondemhf/anashe/products/soft-focus-concealer-1_x0tYJ7qOX.jpg","https://ik.imagekit.io/5dondemhf/anashe/products/soft-focus-concealer-2_NjfA1Cz1U.jpg","https://ik.imagekit.io/5dondemhf/anashe/products/soft-focus-concealer-3_8hhowMsIa.jpg"]',
  '["concealer","makeup","coverage","shade"]',
  '["#F4E8DC","#EDD8C8","#E8D0B8","#E0C4A8","#D4B896","#CFAE88","#C49A78","#B88968"]',
  'Full coverage · C / W / N undertones',
  'BEST SELLER',
  18,
  '/product-detail-page?p=concealer',
  '2N Light Neutral',
  3,
  'concealer'
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

INSERT INTO products (
  slug, name, description, price, image_url, gallery_json,
  keywords_json, swatches_json, material, tag, shade_count,
  detail_href, default_variant, sort_order, pdp_key
) VALUES (
  'gentle-cleanser',
  'Gentle Foam Cleanser',
  'Sensitive skin safe · pH-balanced foam.',
  695,
  'https://ik.imagekit.io/5dondemhf/anashe/products/gentle-cleanser-0_dsdGIiuq4.jpg',
  '["https://ik.imagekit.io/5dondemhf/anashe/products/gentle-cleanser-0_dsdGIiuq4.jpg"]',
  '["cleanser","foam","face wash"]',
  '["#F3F4F6","#93C5FD"]',
  'Sensitive skin safe',
  NULL,
  NULL,
  NULL,
  '150 ml',
  4,
  NULL
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

INSERT INTO products (
  slug, name, description, price, image_url, gallery_json,
  keywords_json, swatches_json, material, tag, shade_count,
  detail_href, default_variant, sort_order, pdp_key
) VALUES (
  'overnight-mask',
  'Overnight Repair Mask',
  'Weekly treatment mask.',
  1120,
  'https://ik.imagekit.io/5dondemhf/anashe/products/overnight-mask-0_AySsomr3S.jpg',
  '["https://ik.imagekit.io/5dondemhf/anashe/products/overnight-mask-0_AySsomr3S.jpg"]',
  '["mask","night","skincare"]',
  '["#E9D5FF"]',
  'Weekly treatment',
  NULL,
  NULL,
  NULL,
  '75 ml',
  5,
  NULL
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

INSERT INTO products (
  slug, name, description, price, image_url, gallery_json,
  keywords_json, swatches_json, material, tag, shade_count,
  detail_href, default_variant, sort_order, pdp_key
) VALUES (
  'mineral-spf',
  'Mineral SPF 50',
  'Invisible on all tones.',
  1450,
  'https://ik.imagekit.io/5dondemhf/anashe/products/mineral-spf-0_7V0OmBkpH.jpg',
  '["https://ik.imagekit.io/5dondemhf/anashe/products/mineral-spf-0_7V0OmBkpH.jpg"]',
  '["spf","sunscreen","sun"]',
  '["#FEF3C7","#FDE68A"]',
  'Invisible on all tones',
  NULL,
  NULL,
  NULL,
  '50 ml',
  6,
  NULL
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

INSERT INTO products (
  slug, name, description, price, image_url, gallery_json,
  keywords_json, swatches_json, material, tag, shade_count,
  detail_href, default_variant, sort_order, pdp_key
) VALUES (
  'velvet-lip',
  'Velvet Matte Lip',
  'Rosewood · 4 g',
  895,
  'https://ik.imagekit.io/5dondemhf/anashe/products/velvet-lip-0_yDaUYpzPA.jpg',
  '["https://ik.imagekit.io/5dondemhf/anashe/products/velvet-lip-0_yDaUYpzPA.jpg"]',
  '["lip","makeup","matte"]',
  '["#BE123C","#171717","#92400E"]',
  'Rosewood · 4 g',
  NULL,
  NULL,
  NULL,
  'Rosewood',
  7,
  NULL
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
