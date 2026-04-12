/** Source URLs (Unsplash) — seed uploads each to ImageKit and stores ImageKit URLs in Neon only. */

export type SeedProduct = {
  slug: string;
  name: string;
  description: string;
  price: number;
  /** Remote image URLs to fetch into ImageKit (order: primary card image first, then gallery) */
  sourceImageUrls: string[];
  keywords: string[];
  swatches: string[];
  material: string;
  tag: string | null;
  shadeCount: number | null;
  detailHref: string | null;
  defaultVariant: string;
  sortOrder: number;
  pdpKey: string | null;
};

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    slug: "barrier-serum",
    name: "Barrier Restore Serum",
    description: "All skin types · barrier-supporting serum with niacinamide.",
    price: 1295,
    sourceImageUrls: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    ],
    keywords: ["serum", "niacinamide", "skincare", "barrier"],
    swatches: ["#F3F4F6", "#E8DFD4"],
    material: "All skin types · 30 ml",
    tag: "NEW",
    shadeCount: null,
    detailHref: "/product-detail-page",
    defaultVariant: "30 ml",
    sortOrder: 1,
    pdpKey: "serum",
  },
  {
    slug: "cloud-cream",
    name: "Cloud Cream Moisturizer",
    description: "Dry to combination · ceramide-rich moisturizer.",
    price: 890,
    sourceImageUrls: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1888&auto=format&fit=crop",
    ],
    keywords: ["moisturizer", "cream", "ceramide", "dry"],
    swatches: ["#F5F0E8", "#D4C4B0"],
    material: "Dry to combination",
    tag: null,
    shadeCount: null,
    detailHref: null,
    defaultVariant: "Unscented",
    sortOrder: 2,
    pdpKey: null,
  },
  {
    slug: "soft-focus-concealer",
    name: "Soft Focus Concealer",
    description: "Full coverage · C / W / N undertones.",
    price: 895,
    sourceImageUrls: [
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200&auto=format&fit=crop",
    ],
    keywords: ["concealer", "makeup", "coverage", "shade"],
    swatches: ["#F4E8DC", "#EDD8C8", "#E8D0B8", "#E0C4A8", "#D4B896", "#CFAE88", "#C49A78", "#B88968"],
    material: "Full coverage · C / W / N undertones",
    tag: "BEST SELLER",
    shadeCount: 18,
    detailHref: "/product-detail-page?p=concealer",
    defaultVariant: "2N Light Neutral",
    sortOrder: 3,
    pdpKey: "concealer",
  },
  {
    slug: "gentle-cleanser",
    name: "Gentle Foam Cleanser",
    description: "Sensitive skin safe · pH-balanced foam.",
    price: 695,
    sourceImageUrls: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=2587&auto=format&fit=crop",
    ],
    keywords: ["cleanser", "foam", "face wash"],
    swatches: ["#F3F4F6", "#93C5FD"],
    material: "Sensitive skin safe",
    tag: null,
    shadeCount: null,
    detailHref: null,
    defaultVariant: "150 ml",
    sortOrder: 4,
    pdpKey: null,
  },
  {
    slug: "overnight-mask",
    name: "Overnight Repair Mask",
    description: "Weekly treatment mask.",
    price: 1120,
    sourceImageUrls: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop",
    ],
    keywords: ["mask", "night", "skincare"],
    swatches: ["#E9D5FF"],
    material: "Weekly treatment",
    tag: null,
    shadeCount: null,
    detailHref: null,
    defaultVariant: "75 ml",
    sortOrder: 5,
    pdpKey: null,
  },
  {
    slug: "mineral-spf",
    name: "Mineral SPF 50",
    description: "Invisible on all tones.",
    price: 1450,
    sourceImageUrls: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2560&auto=format&fit=crop",
    ],
    keywords: ["spf", "sunscreen", "sun"],
    swatches: ["#FEF3C7", "#FDE68A"],
    material: "Invisible on all tones",
    tag: null,
    shadeCount: null,
    detailHref: null,
    defaultVariant: "50 ml",
    sortOrder: 6,
    pdpKey: null,
  },
  {
    slug: "velvet-lip",
    name: "Velvet Matte Lip",
    description: "Rosewood · 4 g",
    price: 895,
    sourceImageUrls: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop",
    ],
    keywords: ["lip", "makeup", "matte"],
    swatches: ["#BE123C", "#171717", "#92400E"],
    material: "Rosewood · 4 g",
    tag: null,
    shadeCount: null,
    detailHref: null,
    defaultVariant: "Rosewood",
    sortOrder: 7,
    pdpKey: null,
  },
];
