"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import { useCart } from "@/context/CartContext";
import { useProductsCatalog } from "@/context/ProductsCatalogContext";
import { productHref } from "@/lib/catalog";

type VariantOption = { name: string; hex: string };

type ProductConfig = {
  name: string;
  price: number;
  description: string;
  images: string[];
  variants: VariantOption[];
  variantLabel: string;
  /** When true, use dense scrollable grid (typical for makeup shades) */
  manyVariants: boolean;
  categorySlug: string;
  categoryHref: string;
  collectionLabel: string;
  badge: string;
  specs: { label: string; value: string }[];
  details: { title: string; content: string }[];
};

const PDP_CART_PRODUCT_ID: Record<"serum" | "concealer", string> = {
  serum: "barrier-serum",
  concealer: "soft-focus-concealer",
};

const relatedByProduct: Record<string, { name: string; price: number; img: string }[]> = {
  serum: [
    { name: "Cloud Cream Moisturizer", price: 890, img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop" },
    { name: "Gentle Foam Cleanser", price: 695, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop" },
    { name: "Overnight Repair Mask", price: 1120, img: "https://images.unsplash.com/photo-1598440947619-c608c443a5c7?q=80&w=1200&auto=format&fit=crop" },
    { name: "Mineral SPF 50", price: 1450, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop" }
  ],
  concealer: [
    { name: "Velvet Matte Lip", price: 895, img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1200&auto=format&fit=crop" },
    { name: "Luminous Skin Tint", price: 1120, img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200&auto=format&fit=crop" },
    { name: "Brow Sculpt Pencil", price: 650, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop" },
    { name: "Cloud Cream Moisturizer", price: 890, img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop" }
  ]
};

const CATALOG: Record<"serum" | "concealer", ProductConfig> = {
  serum: {
    name: "Barrier Restore Serum",
    price: 1295,
    description:
      "A lightweight, fast-absorbing serum that supports your skin barrier with niacinamide, ceramides, and hyaluronic acid. Designed for daily use on all skin types, it helps reduce visible redness and leaves skin feeling calm, supple, and balanced.",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4e571?q=80&w=1200&auto=format&fit=crop"
    ],
    variants: [
      { name: "30 ml", hex: "#E8DFD4" },
      { name: "50 ml", hex: "#C4B8A8" }
    ],
    variantLabel: "Size",
    manyVariants: false,
    categorySlug: "Skincare",
    categoryHref: "/product-listing-page",
    collectionLabel: "Skincare Collection",
    badge: "CLINICAL GRADE",
    specs: [
      { label: "Volume", value: "30 ml / 1 fl oz" },
      { label: "Skin type", value: "All, including sensitive" },
      { label: "Key ingredients", value: "Niacinamide 5%, ceramide NP, HA" },
      { label: "Finish", value: "Lightweight, non-greasy" }
    ],
    details: [
      {
        title: "How to use",
        content:
          "Apply 2–3 drops to clean, dry skin morning and evening. Follow with moisturizer and SPF during the day. Patch test if you are new to active ingredients."
      },
      {
        title: "Our standards",
        content:
          "Fragrance-free, cruelty-free, and made without parabens or sulfates. Dermatologist-tested for tolerance on sensitive skin."
      }
    ]
  },
  concealer: {
    name: "Soft Focus Concealer",
    price: 895,
    description:
      "Full coverage with a skin-like soft-matte finish. Buildable, crease-resistant, and designed to blur uneven tone under eyes and on blemishes. Available in a wide shade range with warm, cool, and neutral undertones.",
    images: [
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596701062351-62c4fd126f75?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200&auto=format&fit=crop"
    ],
    variants: [
      { name: "0 Porcelain", hex: "#F4E8DC" },
      { name: "1C Fair Cool", hex: "#EDD8C8" },
      { name: "1W Fair Warm", hex: "#E8D0B8" },
      { name: "2N Light Neutral", hex: "#E0C4A8" },
      { name: "3C Light-Med Cool", hex: "#D4B896" },
      { name: "3W Light-Med Warm", hex: "#CFAE88" },
      { name: "4N Medium Neutral", hex: "#C49A78" },
      { name: "5W Medium Warm", hex: "#B88968" },
      { name: "5C Medium Cool", hex: "#A87B5C" },
      { name: "6N Med-Deep Neutral", hex: "#9D6B4A" },
      { name: "7W Tan Warm", hex: "#8F5E42" },
      { name: "7C Tan Cool", hex: "#7A5238" },
      { name: "8N Deep Neutral", hex: "#6B4530" },
      { name: "9W Deep Warm", hex: "#5C3A28" },
      { name: "9C Deep Cool", hex: "#4E3224" },
      { name: "10N Rich Neutral", hex: "#3D2618" },
      { name: "11W Rich Warm", hex: "#2E1A10" },
      { name: "12 Espresso", hex: "#1E120A" }
    ],
    variantLabel: "Shade",
    manyVariants: true,
    categorySlug: "Makeup",
    categoryHref: "/product-listing-page",
    collectionLabel: "Complexion",
    badge: "18 SHADES",
    specs: [
      { label: "Coverage", value: "Full, buildable" },
      { label: "Finish", value: "Soft matte" },
      { label: "Size", value: "6.5 ml / 0.22 fl oz" },
      { label: "Undertone", value: "See shade name (C/W/N)" }
    ],
    details: [
      {
        title: "How to use",
        content:
          "Dot onto areas you want to cover, then tap with a finger, sponge, or brush. Set lightly with powder if desired. Patch test before first use."
      },
      {
        title: "Shade guide",
        content:
          "C = cool (pink/red undertone), W = warm (golden/olive undertone), N = neutral. When in doubt, compare jawline to neck in natural light."
      }
    ]
  }
};

function ProductDetailInner() {
  const searchParams = useSearchParams();
  const productKey = searchParams.get("p") === "concealer" ? "concealer" : "serum";
  const base = CATALOG[productKey];
  const { products: apiProducts } = useProductsCatalog();
  const dbRow = useMemo(() => {
    const want = productKey === "concealer" ? "concealer" : "serum";
    return apiProducts.find((p) => p.pdpKey === want) ?? null;
  }, [apiProducts, productKey]);

  const product = useMemo(() => {
    const images =
      dbRow && dbRow.galleryUrls.length > 0 ? dbRow.galleryUrls : base.images;
    return {
      ...base,
      name: dbRow?.name ?? base.name,
      price: dbRow?.price ?? base.price,
      images,
    };
  }, [base, dbRow]);

  const relatedProducts = useMemo(() => {
    const slug = productKey === "concealer" ? "soft-focus-concealer" : "barrier-serum";
    const fromApi = apiProducts
      .filter((p) => p.slug !== slug)
      .slice(0, 4)
      .map((p) => ({
        name: p.name,
        price: p.price,
        img: p.imageUrl,
        href: productHref(p),
      }));
    if (fromApi.length >= 4) return fromApi;
    return relatedByProduct[productKey].map((r) => ({
      name: r.name,
      price: r.price,
      img: r.img,
      href: "/product-detail-page",
    }));
  }, [apiProducts, productKey]);
  const { addItem } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openDetail, setOpenDetail] = useState<number | null>(0);

  const selected = product.variants[selectedVariant];
  const variantCount = product.variants.length;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-12 reveal">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span className="text-neutral-200">/</span>
          <Link href={product.categoryHref} className="hover:text-black transition-colors">
            {product.categorySlug}
          </Link>
          <span className="text-neutral-200">/</span>
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-32">
          {/* Left: Gallery */}
          <div className="flex-1 flex flex-col-reverse lg:flex-row gap-6 reveal">
            <div className="flex lg:flex-col gap-4 overflow-x-auto no-scrollbar lg:w-20">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square w-20 flex-shrink-0 rounded-lg overflow-hidden border transition-all ${activeImage === i ? "border-black shadow-md" : "border-neutral-100 opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumb ${i}`} />
                </button>
              ))}
            </div>
            <div className="flex-1 aspect-[4/5] bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 relative group">
              <img
                src={product.images[activeImage]}
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                alt={product.name}
              />
              <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur px-3 py-1.5 rounded-sm shadow-sm text-[9px] font-bold tracking-[0.2em] text-black">
                {product.badge}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-[480px] space-y-12 reveal delay-100">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">{product.collectionLabel}</span>
                <h1 className="text-4xl lg:text-5xl font-medium tracking-tighter text-black">{product.name}</h1>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold text-black">KSh {product.price.toLocaleString()}</div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1.5 rounded-full uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Ready to Ship
                </div>
              </div>

              <p className="text-neutral-500 text-base md:text-lg font-medium leading-relaxed">{product.description}</p>
            </div>

            {/* Variants: compact row (few) vs scrollable shade grid (many) */}
            <div className="space-y-10 pt-6 border-t border-neutral-100">
              <div className="space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                    {product.variantLabel}: <span className="text-neutral-900">{selected.name}</span>
                  </span>
                  {product.manyVariants && (
                    <span className="text-[10px] font-medium text-neutral-400">
                      {variantCount} shades
                    </span>
                  )}
                </div>

                {product.manyVariants ? (
                  <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-3">
                    <div
                      className="max-h-[220px] overflow-y-auto overscroll-contain pr-1"
                      role="listbox"
                      aria-label="Choose a shade"
                    >
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((v, i) => (
                          <button
                            key={v.name}
                            type="button"
                            role="option"
                            aria-selected={selectedVariant === i}
                            title={v.name}
                            onClick={() => setSelectedVariant(i)}
                            className={`h-9 w-9 shrink-0 rounded-full p-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${selectedVariant === i ? "ring-2 ring-black ring-offset-2 scale-105" : "ring-1 ring-black/10 hover:ring-black/30"}`}
                          >
                            <span
                              className="block h-full w-full rounded-full ring-1 ring-inset ring-black/5"
                              style={{ background: v.hex }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.name}
                        type="button"
                        onClick={() => setSelectedVariant(i)}
                        className={`h-11 w-11 rounded-full p-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${selectedVariant === i ? "ring-2 ring-black scale-110 shadow-lg" : "ring-1 ring-black/10 hover:scale-105"}`}
                        title={v.name}
                      >
                        <span
                          className="block h-full w-full rounded-full ring-1 ring-inset ring-black/5"
                          style={{ background: v.hex }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center h-14 bg-neutral-50 border border-neutral-100 rounded-xl px-2 w-full sm:w-36">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex-1 flex items-center justify-center hover:bg-white rounded-lg transition-all h-10"
                  >
                    <Icon icon="lucide:minus" width="16"></Icon>
                  </button>
                  <span className="flex-1 flex items-center justify-center font-bold text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex-1 flex items-center justify-center hover:bg-white rounded-lg transition-all h-10"
                  >
                    <Icon icon="lucide:plus" width="16"></Icon>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      productId: PDP_CART_PRODUCT_ID[productKey],
                      name: product.name,
                      price: product.price,
                      image: product.images[0],
                      variantLabel: selected.name,
                      quantity,
                    })
                  }
                  className="w-full sm:flex-1 h-14 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-2xl shadow-black/10 flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                >
                  Add to Cart <Icon icon="lucide:shopping-bag" width="18"></Icon>
                </button>
              </div>
            </div>

            {/* Details Accordion */}
            <div className="space-y-4 pt-4">
              {product.details.map((detail, idx) => (
                <div key={detail.title} className="border-b border-neutral-100 pb-4">
                  <button
                    type="button"
                    onClick={() => setOpenDetail(openDetail === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-black py-2"
                  >
                    {detail.title}
                    <Icon
                      icon="lucide:chevron-down"
                      width="16"
                      className={`transition-transform duration-300 ${openDetail === idx ? "rotate-180" : ""}`}
                    ></Icon>
                  </button>
                  {openDetail === idx && (
                    <div className="pt-4 text-sm text-neutral-500 font-medium leading-relaxed animate-fade-in-up">{detail.content}</div>
                  )}
                </div>
              ))}

              <div className="pt-6 grid grid-cols-2 gap-y-6">
                {product.specs.map((spec) => (
                  <div key={spec.label}>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{spec.label}</div>
                    <div className="text-[13px] font-bold text-black">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Complete the Look */}
        <section className="mt-32 pt-24 border-t border-neutral-100 reveal">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Curation</span>
              <h2 className="text-4xl font-medium tracking-tighter text-black">Complete the look</h2>
            </div>
            <Link
              href="/product-listing-page"
              className="hidden sm:flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-black transition-colors uppercase tracking-widest group"
            >
              Browse Collection <Icon icon="lucide:arrow-right" width="16" className="group-hover:translate-x-1 transition-transform"></Icon>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <div key={item.name} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-neutral-50 rounded-2xl overflow-hidden mb-6 border border-neutral-100 relative">
                  <Link href={item.href} className="block w-full h-full cursor-pointer">
                    <img
                      src={item.img}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      alt={item.name}
                    />
                  </Link>
                  <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button
                      type="button"
                      className="w-full py-3 bg-white/95 backdrop-blur text-black text-[10px] font-bold rounded shadow-lg uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start px-1">
                  <div>
                    <h4 className="text-sm font-semibold text-black tracking-tight">{item.name}</h4>
                    <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider mt-1">Anashe Essentials</p>
                  </div>
                  <span className="text-sm font-bold text-black">KSh {item.price}</span>
                </div>
              </div>
            ))}
          </div>

          {productKey === "serum" && (
            <p className="mt-12 text-center text-sm text-neutral-500">
              See how many-shade makeup looks:{" "}
              <Link href="/product-detail-page?p=concealer" className="font-semibold text-black underline underline-offset-4 hover:text-neutral-600">
                Soft Focus Concealer
              </Link>
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-24 bg-white flex items-center justify-center text-sm text-neutral-400">Loading…</div>
      }
    >
      <ProductDetailInner />
    </Suspense>
  );
}
