"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

const CATEGORIES = ["All", "Furniture", "Lighting", "Accessories"];
const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

const PRODUCTS = [
  { id: 1, name: "Orbital Lamp", subtitle: "Matte Black Steel", price: 320, category: "Lighting", badge: null, isNew: false, image: "https://images.unsplash.com/photo-1604610728890-6f4b631ed081?w=800&q=80", hoverImage: "https://images.unsplash.com/photo-1603801705819-e3b27f8bb8cc?w=800&q=80" },
  { id: 2, name: "Linen Lounge Chair", subtitle: "Natural Oak Frame", price: 890, category: "Furniture", badge: "New", isNew: true, image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1964&auto=format&fit=crop", hoverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80" },
  { id: 3, name: "Sculpt Vase 02", subtitle: "Raw Clay", price: 140, category: "Accessories", badge: null, isNew: false, image: "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?w=800&q=80", hoverImage: "https://images.unsplash.com/photo-1608111115633-872fa895d40d?w=800&q=80" },
  { id: 4, name: "Side Table", subtitle: "Walnut Finish", price: 450, category: "Furniture", badge: null, isNew: false, image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1888&auto=format&fit=crop", hoverImage: "https://images.unsplash.com/photo-1605239435870-67df4c54a0b3?w=800&q=80" },
  { id: 5, name: "Arc Floor Lamp", subtitle: "Brushed Brass", price: 560, category: "Lighting", badge: "New", isNew: true, image: "https://images.unsplash.com/photo-1513506003901-1e6a35eb7b4e?w=800&q=80", hoverImage: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80" },
  { id: 6, name: "Woven Throw", subtitle: "Organic Merino", price: 180, category: "Accessories", badge: null, isNew: false, image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80", hoverImage: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80" },
  { id: 7, name: "Dining Chair", subtitle: "Ash Wood + Linen", price: 620, category: "Furniture", badge: null, isNew: false, image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=1780&auto=format&fit=crop", hoverImage: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=800&q=80" },
  { id: 8, name: "Ceramic Tray", subtitle: "Stone White", price: 95, category: "Accessories", badge: null, isNew: false, image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2070&auto=format&fit=crop", hoverImage: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80" },
  { id: 9, name: "Pendant Light", subtitle: "Hand-blown Glass", price: 740, category: "Lighting", badge: null, isNew: false, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", hoverImage: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80" },
  { id: 10, name: "Modular Shelf", subtitle: "Solid Oak", price: 1100, category: "Furniture", badge: null, isNew: false, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80", hoverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80" },
  { id: 11, name: "Pillar Candle Set", subtitle: "Soy Wax", price: 65, category: "Accessories", badge: "Sale", isNew: false, image: "https://images.unsplash.com/photo-1608111115633-872fa895d40d?w=800&q=80", hoverImage: "https://images.unsplash.com/photo-1599619351208-3e6c839d6828?w=800&q=80" },
  { id: 12, name: "Ottoman Cube", subtitle: "Bouclé Fabric", price: 390, category: "Furniture", badge: "New", isNew: true, image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1992&auto=format&fit=crop", hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80" },
];

const BADGE_STYLES: Record<string, string> = {
  New: "bg-neutral-900 text-white",
  Sale: "bg-red-500 text-white",
};

export default function ShopClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = activeCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);
    if (sortBy === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "Newest") list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return list;
  }, [activeCategory, sortBy]);

  return (
    <>
      {/* Page Header */}
      <div className="max-w-[1440px] mx-auto px-6 pt-12 pb-8 border-b border-neutral-100">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase block mb-3">
              The Collection
            </span>
            <h1 className="text-4xl lg:text-5xl font-medium tracking-tighter leading-none">
              Essential Objects
            </h1>
          </div>
          <p className="hidden lg:block text-sm text-neutral-500 max-w-xs text-right pb-1">
            Thoughtfully designed pieces for the modern home.
          </p>
        </div>
      </div>

      {/* Filters + Sort Bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-neutral-100">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                  activeCategory === cat
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right: count + sort */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-xs text-neutral-400 font-medium">
              {filtered.length} products
            </span>
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 text-xs font-semibold text-neutral-700 border border-neutral-200 rounded-lg px-3 py-2 hover:border-neutral-400 transition-colors"
              >
                {sortBy}
                <Icon icon="lucide:chevron-down" width={14} className={`transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
              </button>
              {isSortOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-neutral-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setIsSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-neutral-50 ${sortBy === opt ? "text-neutral-900 font-semibold" : "text-neutral-500"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-32 text-neutral-400">
            <Icon icon="lucide:package-open" width={40} className="mx-auto mb-4 opacity-40" />
            <p className="text-sm font-medium">No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14">
            {filtered.map((product) => (
              <div key={product.id} className="group relative reveal">
                <div className="aspect-square bg-neutral-50 rounded-xl overflow-hidden mb-4 relative border border-neutral-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:opacity-0 transition-opacity duration-500 absolute inset-0 z-10"
                  />
                  <Image
                    src={product.hoverImage}
                    alt={`${product.name} styled`}
                    fill
                    className="object-cover absolute inset-0 scale-105"
                  />
                  {product.badge && (
                    <div className={`absolute top-3 left-3 z-20 text-[10px] uppercase font-bold px-2 py-1 rounded-sm ${BADGE_STYLES[product.badge] ?? "bg-neutral-900 text-white"}`}>
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-full h-10 bg-white/95 backdrop-blur text-neutral-900 text-xs font-bold rounded-lg shadow-lg hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-2">
                      <Icon icon="lucide:shopping-bag" width={14} /> Add to Cart
                    </button>
                  </div>
                  <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-neutral-400 hover:text-red-500 hover:scale-110 transition-all">
                      <Icon icon="lucide:heart" width={16} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 tracking-tight leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">{product.subtitle}</p>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900 ml-2 shrink-0">
                    ${product.price.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
