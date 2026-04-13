"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import type { Product } from "@/lib/products";

const BADGE_STYLES: Record<string, string> = {
  New: "bg-neutral-900 text-white",
  Sale: "bg-red-500 text-white",
};

export default function ProductDetailClient({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-24 lg:pt-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8 font-medium">
        <Link href="/" className="hover:text-neutral-700 transition-colors">Home</Link>
        <Icon icon="lucide:chevron-right" width={12} />
        <Link href="/shop" className="hover:text-neutral-700 transition-colors">Shop</Link>
        <Icon icon="lucide:chevron-right" width={12} />
        <span className="text-neutral-600">{product.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-12 lg:gap-14 xl:gap-20">
        {/* ── Gallery ── */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main image */}
          <div className="relative aspect-[4/3] bg-white rounded-2xl overflow-hidden border border-neutral-100">
            {product.badge && (
              <span className={`absolute top-4 left-4 z-10 text-[11px] font-bold uppercase px-2.5 py-1 rounded-sm ${BADGE_STYLES[product.badge] ?? "bg-neutral-900 text-white"}`}>
                {product.badge}
              </span>
            )}
            <Image
              src={product.gallery[activeImage]}
              alt={product.name}
              fill
              className="object-cover transition-all duration-500"
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {product.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                  activeImage === i
                    ? "border-neutral-900 scale-105"
                    : "border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Info panel ── */}
        <div className="lg:col-span-5 mt-10 lg:mt-0">
          <div className="sticky top-24 space-y-7">
            {/* Header */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-base text-neutral-500 mt-1">{product.subtitle}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-neutral-900">
                KSh {product.price.toLocaleString()}
              </span>
              <span className="text-sm text-neutral-400 font-medium">Free global shipping</span>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-6">
              {product.description}
            </p>

            {/* Quantity + Add to cart */}
            <div className="pt-2 space-y-3">
              <div className="flex gap-3 items-center">
                <div className="flex-1 sm:flex-initial flex items-center border border-neutral-200 rounded-xl h-12 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-12 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="flex-1 sm:w-10 text-center text-sm font-semibold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-12 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors text-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => setWishlisted((w) => !w)}
                  className="w-12 h-12 rounded-xl border border-neutral-200 flex items-center justify-center hover:border-red-300 hover:text-red-500 transition-all shrink-0"
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Icon
                    icon="lucide:heart"
                    className={wishlisted ? "text-red-500" : "text-neutral-400"}
                    width={20}
                  />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full h-12 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-neutral-900 text-white hover:bg-neutral-700"
                }`}
              >
                {addedToCart ? (
                  <>
                    <Icon icon="lucide:check" width={16} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:shopping-bag" width={16} />
                    Add to Cart · KSh {(product.price * quantity).toLocaleString()}
                  </>
                )}
              </button>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-neutral-100">
              {[
                { icon: "lucide:shield-check", label: "5-Year Warranty" },
                { icon: "lucide:truck", label: "Free Shipping" },
                { icon: "lucide:rotate-ccw", label: "30-Day Returns" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon icon={icon} width={18} className="text-neutral-400" />
                  <span className="text-[11px] font-medium text-neutral-500">{label}</span>
                </div>
              ))}
            </div>

            {/* Product details */}
            <div className="border-t border-neutral-100 pt-6 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
                Details
              </p>
              <ul className="space-y-2">
                {product.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-neutral-600">
                    <span className="mt-[5px] w-1 h-1 rounded-full bg-neutral-400 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
