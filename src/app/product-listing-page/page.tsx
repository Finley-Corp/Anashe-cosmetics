"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useCart } from "@/context/CartContext";
import { useProductsCatalog } from "@/context/ProductsCatalogContext";
import { productHref } from "@/lib/catalog";
import type { ProductJson } from "@/types/product";

const categories = [
  { name: "All beauty", count: 42 },
  { name: "Skincare", count: 22 },
  { name: "Makeup", count: 10 },
  { name: "Body care", count: 6 },
  { name: "Tools & accessories", count: 4 },
];

const materials = [
  "Dry",
  "Oily",
  "Combination",
  "Sensitive",
];

const colors = [
  { name: "White", hex: "#F3F4F6" },
  { name: "Black", hex: "#171717" },
  { name: "Grey", hex: "#9CA3AF" },
  { name: "Brown", hex: "#78350F" },
  { name: "Dark Grey", hex: "#4B5563" },
];

type ListingRow = {
  id: number;
  name: string;
  material: string;
  price: number;
  image: string;
  tag: string | null;
  swatches: string[];
  detailHref: string | null;
  shadeCount: number | null;
  quickAddId: string;
  href: string;
};

function rowFromApi(p: ProductJson): ListingRow {
  return {
    id: p.id,
    name: p.name,
    material: p.material ?? "",
    price: p.price,
    image: p.imageUrl,
    tag: p.tag,
    swatches: p.swatches,
    detailHref: p.detailHref,
    shadeCount: p.shadeCount,
    quickAddId: p.slug,
    href: productHref(p),
  };
}

const FALLBACK_PRODUCTS: ListingRow[] = [
  {
    id: 1,
    name: "Barrier Restore Serum",
    material: "All skin types · 30 ml",
    price: 1295,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1964&auto=format&fit=crop",
    tag: "NEW",
    swatches: ["#F3F4F6", "#E8DFD4"],
    detailHref: "/product-detail-page",
    shadeCount: null,
    quickAddId: "barrier-serum",
    href: "/product-detail-page",
  },
  {
    id: 2,
    name: "Cloud Cream Moisturizer",
    material: "Dry to combination",
    price: 890,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1888&auto=format&fit=crop",
    tag: null,
    swatches: ["#F5F0E8", "#D4C4B0"],
    detailHref: null,
    shadeCount: null,
    quickAddId: "cloud-cream",
    href: "/product-detail-page",
  },
  {
    id: 3,
    name: "Soft Focus Concealer",
    material: "Full coverage · C / W / N undertones",
    price: 895,
    image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?q=80&w=800&auto=format&fit=crop",
    tag: "BEST SELLER",
    swatches: [
      "#F4E8DC",
      "#EDD8C8",
      "#E8D0B8",
      "#E0C4A8",
      "#D4B896",
      "#CFAE88",
      "#C49A78",
      "#B88968"
    ],
    shadeCount: 18,
    detailHref: "/product-detail-page?p=concealer",
    quickAddId: "soft-focus-concealer",
    href: "/product-detail-page?p=concealer",
  },
  {
    id: 4,
    name: "Gentle Foam Cleanser",
    material: "Sensitive skin safe",
    price: 695,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=2587&auto=format&fit=crop",
    tag: null,
    swatches: ["#F3F4F6", "#93C5FD"],
    detailHref: null,
    shadeCount: null,
    quickAddId: "gentle-cleanser",
    href: "/product-detail-page",
  },
  {
    id: 5,
    name: "Overnight Repair Mask",
    material: "Weekly treatment",
    price: 1120,
    image: "https://images.unsplash.com/photo-1598440947619-c608c443a5c7?q=80&w=800&auto=format&fit=crop",
    tag: null,
    swatches: ["#E9D5FF"],
    detailHref: null,
    shadeCount: null,
    quickAddId: "overnight-mask",
    href: "/product-listing-page",
  },
  {
    id: 6,
    name: "Mineral SPF 50",
    material: "Invisible on all tones",
    price: 1450,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4e571?q=80&w=2560&auto=format&fit=crop",
    tag: null,
    swatches: ["#FEF3C7", "#FDE68A"],
    detailHref: null,
    shadeCount: null,
    quickAddId: "mineral-spf",
    href: "/product-listing-page",
  }
];

export default function ShopPage() {
  const { addItem } = useCart();
  const { products: apiProducts, getQuickProduct, isLoading } = useProductsCatalog();
  const products =
    apiProducts.length > 0 ? apiProducts.map(rowFromApi) : FALLBACK_PRODUCTS;

  function handleQuickAdd(quickAddId: string, e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const p = getQuickProduct(quickAddId);
    if (!p) return;
    addItem({
      productId: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      variantLabel: p.defaultVariant,
      quantity: 1,
    });
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar */}
          <aside className="lg:w-60 flex-shrink-0 space-y-12 reveal">
            {/* Categories */}
            <div className="pt-10">
              <h3 className="text-sm font-medium tracking-tighter text-black mb-8">Categories</h3>
              <ul className="space-y-4">
                {categories.map((cat, i) => (
                  <li key={cat.name} className="flex items-center justify-between group cursor-pointer group">
                    <span className={`text-[13px] font-medium transition-colors ${i === 0 ? "text-black" : "text-neutral-500 group-hover:text-black"}`}>
                      {cat.name}
                    </span>
                    <span className="text-[11px] font-bold text-neutral-300 group-hover:text-neutral-400 transition-colors">
                      {cat.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skin type */}
            <div>
              <h3 className="text-sm font-medium tracking-tighter text-black mb-8">Skin type</h3>
              <div className="space-y-4">
                {materials.map((mat) => (
                  <label key={mat} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-4 h-4 rounded-sm border border-neutral-200 flex items-center justify-center group-hover:border-neutral-400 transition-all">
                       {/* Box */}
                    </div>
                    <span className="text-[13px] font-medium text-neutral-500 group-hover:text-black transition-colors">{mat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-sm font-medium tracking-tighter text-black mb-8">Colors</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button 
                    key={color.name}
                    className="w-6 h-6 rounded-full border border-neutral-100 ring-2 ring-transparent hover:ring-neutral-200 ring-offset-2 transition-all shadow-sm"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-medium tracking-tighter text-black mb-8">Price Range</h3>
              <div className="flex items-center gap-3">
                 <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-400">KSh</span>
                    <input type="text" placeholder="0" className="w-full h-10 bg-neutral-50 border border-neutral-100 rounded-lg pl-6 pr-3 text-xs font-bold outline-none focus:border-neutral-900 transition-colors" />
                 </div>
                 <span className="text-neutral-300 font-medium">-</span>
                 <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-400">KSh</span>
                    <input type="text" placeholder="5000" className="w-full h-10 bg-neutral-50 border border-neutral-100 rounded-lg pl-6 pr-3 text-xs font-bold outline-none focus:border-neutral-900 transition-colors" />
                 </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area (Header + Grid) */}
          <main className="flex-1">
            {/* Header Section inside Right Column */}
            <header className="mb-14 reveal">
              <nav className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-4">
                <Link href="/" className="hover:text-black transition-colors">Home</Link>
                <span className="text-neutral-200">/</span>
                <span className="text-black">Skincare & beauty</span>
              </nav>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-4xl lg:text-[44px] font-medium tracking-tighter mb-4 text-black">Skincare & beauty</h1>
                  <p className="text-neutral-500 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                    Clean, effective formulas and makeup you can feel good about—thoughtfully made for real routines.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-between w-48 px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-xs font-bold text-black cursor-pointer hover:border-black transition-colors">
                    <span>Sort by: Featured</span>
                    <Icon icon="lucide:chevron-down" width="14"></Icon>
                  </div>
                </div>
              </div>
            </header>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {products.map((product, idx) => (
                <div key={product.id} className="group reveal" style={{ transitionDelay: `${idx * 100}ms` }}>
                  <div className="aspect-[4/5] bg-neutral-50 rounded-lg overflow-hidden mb-5 relative border border-neutral-100">
                    <Link href={product.href} className="block w-full h-full cursor-pointer">
                      <img
                        src={product.image}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                        alt={product.name}
                      />
                    </Link>
                    
                    {product.tag && (
                      <div className="absolute top-4 left-4 z-20 bg-black text-white text-[9px] uppercase font-black px-2.5 py-1.5 rounded-sm shadow-sm tracking-[0.1em]">
                        {product.tag}
                      </div>
                    )}

                    {/* Quick Add Button on Hover */}
                    <div className="absolute bottom-6 left-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(product.quickAddId, e)}
                        className="w-full h-12 bg-white/95 backdrop-blur text-black text-[11px] font-bold rounded shadow-xl hover:bg-black hover:text-white transition-all uppercase tracking-widest"
                      >
                        Quick Add
                      </button>
                    </div>

                    {/* Wishlist Button */}
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center transition-all text-neutral-400 hover:text-red-500 hover:scale-110">
                        <Icon icon="lucide:heart" width="16"></Icon>
                      </button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start group/title">
                      <Link href={product.href}>
                        <h3 className="text-sm font-semibold text-black tracking-tight group-hover/title:text-neutral-500 transition-colors leading-tight">
                          {product.name}
                        </h3>
                      </Link>
                      <span className="text-sm font-semibold text-black">KSh {product.price.toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">
                      {product.material}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1.5">
                       {(product.shadeCount
                         ? product.swatches.slice(0, 8)
                         : product.swatches
                       ).map((swatch, i) => (
                         <div
                           key={i}
                           className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10 ring-inset shrink-0"
                           style={{ backgroundColor: swatch }}
                           title="Shade preview"
                         />
                       ))}
                       {product.shadeCount != null && product.shadeCount > 8 && (
                         <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                           +{product.shadeCount - 8} shades
                         </span>
                       )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Section */}
            <div className="mt-24 pt-10 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-8 reveal">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest leading-none">
                {isLoading
                  ? "Loading products…"
                  : `Showing ${products.length} product${products.length === 1 ? "" : "s"}`}
              </p>
              
              <div className="flex items-center gap-4">
                 <button className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest hover:text-black transition-colors">Previous</button>
                 <div className="flex items-center gap-1.5">
                    <button className="w-9 h-9 flex items-center justify-center text-[11px] font-bold rounded-lg bg-black text-white">1</button>
                    <button className="w-9 h-9 flex items-center justify-center text-[11px] font-bold rounded-lg hover:bg-neutral-50 text-neutral-500 hover:text-black transition-colors font-bold">2</button>
                    <button className="w-9 h-9 flex items-center justify-center text-[11px] font-bold rounded-lg hover:bg-neutral-50 text-neutral-500 hover:text-black transition-colors font-bold">3</button>
                 </div>
                 <button className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest hover:text-black transition-colors">Next</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
