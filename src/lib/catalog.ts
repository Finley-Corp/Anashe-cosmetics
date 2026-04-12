/** Shared product data for quick add, search, and cart line metadata */

import type { ProductJson } from "@/types/product";

export type QuickProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  defaultVariant: string;
  href: string;
  keywords?: string[];
};

export const QUICK_PRODUCTS: Record<string, QuickProduct> = {
  "barrier-serum": {
    id: "barrier-serum",
    name: "Barrier Restore Serum",
    price: 1295,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
    defaultVariant: "30 ml",
    href: "/product-detail-page",
    keywords: ["serum", "niacinamide", "skincare", "barrier"],
  },
  "cloud-cream": {
    id: "cloud-cream",
    name: "Cloud Cream Moisturizer",
    price: 890,
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    defaultVariant: "Unscented",
    href: "/product-detail-page",
    keywords: ["moisturizer", "cream", "ceramide", "dry"],
  },
  "velvet-lip": {
    id: "velvet-lip",
    name: "Velvet Matte Lip",
    price: 895,
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop",
    defaultVariant: "Rosewood",
    href: "/product-detail-page",
    keywords: ["lip", "makeup", "matte"],
  },
  "gentle-cleanser": {
    id: "gentle-cleanser",
    name: "Gentle Foam Cleanser",
    price: 695,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
    defaultVariant: "150 ml",
    href: "/product-detail-page",
    keywords: ["cleanser", "foam", "face wash"],
  },
  "soft-focus-concealer": {
    id: "soft-focus-concealer",
    name: "Soft Focus Concealer",
    price: 895,
    image:
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?q=80&w=800&auto=format&fit=crop",
    defaultVariant: "2N Light Neutral",
    href: "/product-detail-page?p=concealer",
    keywords: ["concealer", "makeup", "coverage", "shade"],
  },
  "overnight-mask": {
    id: "overnight-mask",
    name: "Overnight Repair Mask",
    price: 1120,
    image:
      "https://images.unsplash.com/photo-1598440947619-c608c443a5c7?q=80&w=800&auto=format&fit=crop",
    defaultVariant: "75 ml",
    href: "/product-listing-page",
    keywords: ["mask", "night", "skincare"],
  },
  "mineral-spf": {
    id: "mineral-spf",
    name: "Mineral SPF 50",
    price: 1450,
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4e571?q=80&w=800&auto=format&fit=crop",
    defaultVariant: "50 ml",
    href: "/product-listing-page",
    keywords: ["spf", "sunscreen", "sun"],
  },
};

export function getQuickProduct(id: string): QuickProduct | undefined {
  return QUICK_PRODUCTS[id];
}

/** Prefer `detail_href` from Neon; otherwise PDP query when `pdp_key` is set; else shop listing. */
export function productHref(j: ProductJson): string {
  if (j.detailHref) return j.detailHref;
  if (j.pdpKey === "serum" || j.pdpKey === "concealer") {
    return `/product-detail-page?p=${encodeURIComponent(j.pdpKey)}`;
  }
  return "/product-listing-page";
}

export function productJsonToQuickProduct(j: ProductJson): QuickProduct {
  return {
    id: j.slug,
    name: j.name,
    price: j.price,
    image: j.imageUrl,
    defaultVariant: j.defaultVariant,
    href: productHref(j),
    keywords: j.keywords,
  };
}

/** Static defaults overridden by API rows with the same `slug`. */
export function mergeQuickProducts(fromDb: ProductJson[]): Record<string, QuickProduct> {
  const out: Record<string, QuickProduct> = { ...QUICK_PRODUCTS };
  for (const j of fromDb) {
    out[j.slug] = productJsonToQuickProduct(j);
  }
  return out;
}

export const STATIC_SEARCH_PAGES: { label: string; href: string; type: string }[] = [
  { label: "About ANASHE", href: "/about-us", type: "Page" },
  { label: "Journal", href: "/blog", type: "Page" },
  { label: "Contact", href: "/contact-us", type: "Page" },
  { label: "Shop all", href: "/product-listing-page", type: "Page" },
];

export function searchProducts(
  query: string,
  quickBySlug: Record<string, QuickProduct>
): { label: string; href: string; type: string }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const seen = new Set<string>();
  const out: { label: string; href: string; type: string }[] = [];

  for (const p of Object.values(quickBySlug)) {
    const hay = `${p.name} ${(p.keywords ?? []).join(" ")}`.toLowerCase();
    if (hay.includes(q)) {
      const key = `p:${p.href}:${p.name}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ label: p.name, href: p.href, type: "Product" });
      }
    }
  }
  for (const page of STATIC_SEARCH_PAGES) {
    if (page.label.toLowerCase().includes(q)) {
      const key = `s:${page.href}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(page);
      }
    }
  }
  return out.slice(0, 10);
}

export function searchSite(query: string): { label: string; href: string; type: string }[] {
  return searchProducts(query, QUICK_PRODUCTS);
}
