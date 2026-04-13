"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

const FILTERS = ["All", "Lighting", "Furniture", "Accessories"];

const PRODUCTS = [
  {
    id: 1,
    name: "Orbital Lamp",
    subtitle: "Matte Black Steel",
    price: "$320",
    category: "Lighting",
    image: "https://images.unsplash.com/photo-1604610728890-6f4b631ed081?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1603801705819-e3b27f8bb8cc?w=800&q=80",
    badge: null,
  },
  {
    id: 2,
    name: "Linen Lounge",
    subtitle: "Natural Oak",
    price: "$890",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1964&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    badge: "New",
  },
  {
    id: 3,
    name: "Sculpt Vase 02",
    subtitle: "Raw Clay",
    price: "$140",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1608111115633-872fa895d40d?w=800&q=80",
    badge: null,
  },
  {
    id: 4,
    name: "Side Table",
    subtitle: "Walnut Finish",
    price: "$450",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1888&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1605239435870-67df4c54a0b3?w=800&q=80",
    badge: null,
  },
];

const DELAY = ["", "delay-75", "delay-100", "delay-150"];

export default function Shop() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeFilter);

  return (
    <section
      className="w-full py-20 bg-neutral-50 border-y border-neutral-200 scroll-mt-20"
      id="shop"
    >
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6 reveal">
          <h2 className="text-3xl font-medium tracking-tighter text-neutral-900">
            Essential Objects
          </h2>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                  activeFilter === f
                    ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/10"
                    : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className={`group relative reveal ${DELAY[i % DELAY.length]}`}
            >
              <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4 relative border border-neutral-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:opacity-0 transition-opacity absolute inset-0 z-10"
                />
                <Image
                  src={product.hoverImage}
                  alt={`${product.name} context`}
                  fill
                  className="object-cover absolute inset-0 scale-105"
                />
                {product.badge && (
                  <div className="absolute top-3 left-3 z-20 bg-neutral-900 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm">
                    {product.badge}
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="w-full h-10 bg-white/95 backdrop-blur text-neutral-900 text-xs font-bold rounded shadow-lg hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-2">
                    <Icon icon="lucide:plus" width={14} /> Quick Add
                  </button>
                </div>
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-all text-neutral-400 hover:text-red-500 hover:scale-110">
                    <Icon icon="lucide:heart" width={16} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    {product.subtitle}
                  </p>
                </div>
                <span className="text-sm font-semibold text-neutral-900">
                  {product.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-block border-b border-black pb-0.5 text-sm font-semibold hover:text-neutral-600 hover:border-neutral-600 transition-all"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
