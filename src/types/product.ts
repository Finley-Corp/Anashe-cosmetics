export type ProductRow = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  gallery_urls: string[];
  keywords: string[];
  swatches: string[];
  material: string | null;
  tag: string | null;
  shade_count: number | null;
  detail_href: string | null;
  default_variant: string;
  sort_order: number;
  pdp_key: string | null;
};

export type ProductJson = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  galleryUrls: string[];
  keywords: string[];
  swatches: string[];
  material: string | null;
  tag: string | null;
  shadeCount: number | null;
  detailHref: string | null;
  defaultVariant: string;
  sortOrder: number;
  pdpKey: string | null;
};

export function toProductJson(row: ProductRow): ProductJson {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    imageUrl: row.image_url,
    galleryUrls: row.gallery_urls,
    keywords: row.keywords,
    swatches: row.swatches,
    material: row.material,
    tag: row.tag,
    shadeCount: row.shade_count,
    detailHref: row.detail_href,
    defaultVariant: row.default_variant,
    sortOrder: row.sort_order,
    pdpKey: row.pdp_key,
  };
}
