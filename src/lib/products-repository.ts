import { getSql } from "@/lib/db";
import type { ProductRow } from "@/types/product";

function parseJsonArray(raw: unknown): string[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw) as unknown;
      return Array.isArray(p) ? (p as string[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function parseRow(r: Record<string, unknown>): ProductRow {
  return {
    id: r.id as number,
    slug: r.slug as string,
    name: r.name as string,
    description: (r.description as string) ?? null,
    price: Number(r.price),
    image_url: r.image_url as string,
    gallery_urls: parseJsonArray(r.gallery_json),
    keywords: parseJsonArray(r.keywords_json),
    swatches: parseJsonArray(r.swatches_json),
    material: (r.material as string) ?? null,
    tag: (r.tag as string) ?? null,
    shade_count: r.shade_count != null ? Number(r.shade_count) : null,
    detail_href: (r.detail_href as string) ?? null,
    default_variant: (r.default_variant as string) ?? "",
    sort_order: Number(r.sort_order),
    pdp_key: (r.pdp_key as string) ?? null,
  };
}

export async function listProducts(search?: string): Promise<ProductRow[]> {
  const sql = getSql();
  const q = search?.trim().toLowerCase() ?? "";
  if (!q) {
    const rows = await sql`
      SELECT * FROM products ORDER BY sort_order ASC, id ASC
    `;
    return rows.map((r) => parseRow(r as Record<string, unknown>));
  }
  const like = `%${q}%`;
  const rows = await sql`
    SELECT * FROM products
    WHERE
      lower(name) LIKE ${like}
      OR lower(coalesce(slug, '')) LIKE ${like}
      OR lower(keywords_json) LIKE ${like}
    ORDER BY sort_order ASC, id ASC
  `;
  return rows.map((r) => parseRow(r as Record<string, unknown>));
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM products WHERE slug = ${slug} LIMIT 1
  `;
  if (rows.length === 0) return null;
  return parseRow(rows[0] as Record<string, unknown>);
}
