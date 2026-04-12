"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useCart } from "@/context/CartContext";
import { useProductsCatalog } from "@/context/ProductsCatalogContext";

export default function Home() {
  const { addItem } = useCart();
  const { getQuickProduct } = useProductsCatalog();
  const [newsletterDone, setNewsletterDone] = useState(false);

  function addQuickProduct(productId: string) {
    const p = getQuickProduct(productId);
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
    <>
      {/* HERO SECTION */}
      <header
        className="relative w-full min-h-[100dvh] lg:h-screen flex items-center bg-white overflow-hidden isolate pt-32 lg:pt-0"
        id="hero"
      >
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-neutral-50 via-neutral-100/50 to-transparent rounded-[100%] blur-3xl -z-10 opacity-70 pointer-events-none"></div>

        {/* Inner Container */}
        <div className="w-full max-w-[1440px] mx-auto px-6 h-full flex items-center">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full mt-8 lg:mt-0">
            {/* Left: Copy (Col Span 5) */}
            <div className="lg:col-span-5 flex flex-col items-start relative z-10">
              {/* Social Proof */}
              <div className="flex items-center gap-3 mb-8 animate-fade-in-up opacity-0 mt-8 lg:mt-0">
                <div className="flex -space-x-2.5">
                  <img
                    className="h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&q=80"
                    alt=""
                  />
                  <img
                    className="h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&q=80"
                    alt=""
                  />
                  <img
                    className="h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&q=80"
                    alt=""
                  />
                  <div className="h-9 w-9 rounded-full ring-2 ring-white bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-600">
                    +2k
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex text-neutral-900 text-[10px] gap-0.5">
                    <Icon icon="lucide:star" fill="currentColor"></Icon>
                    <Icon icon="lucide:star" fill="currentColor"></Icon>
                    <Icon icon="lucide:star" fill="currentColor"></Icon>
                    <Icon icon="lucide:star" fill="currentColor"></Icon>
                    <Icon icon="lucide:star" fill="currentColor"></Icon>
                  </div>
                  <span className="text-xs font-medium text-neutral-500 mt-0.5">
                    Trusted by skincare lovers
                  </span>
                </div>
              </div>

              <h1 className="text-5xl lg:text-7xl font-medium tracking-tighter leading-[0.95] mb-6 text-neutral-900 animate-fade-in-up opacity-0 delay-100">
                Radiant skin, <br />
                <span className="text-neutral-400">thoughtful care.</span>
              </h1>

              <p className="text-lg text-neutral-500 mb-10 leading-relaxed max-w-md animate-fade-in-up opacity-0 delay-200">
                Premium skincare and beauty for real routines—clean formulas,
                flattering makeup, and body care you will reach for every day.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 animate-fade-in-up opacity-0 delay-300">
                <Link
                  href="/product-listing-page"
                  className="inline-flex items-center justify-center h-12 px-8 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-500/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Shop Collection
                </Link>
                <Link
                  href="/product-detail-page"
                  className="inline-flex items-center justify-center h-12 px-8 bg-white border border-neutral-200 text-neutral-900 text-sm font-semibold rounded-full hover:bg-neutral-50 hover:border-neutral-300 transition-all group"
                >
                  <span>View Lookbook</span>
                  <Icon
                    icon="lucide:arrow-right"
                    className="ml-2 transition-transform group-hover:translate-x-1"
                    width="16"
                  ></Icon>
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-neutral-400 animate-fade-in-up opacity-0 delay-300">
                <div className="flex items-center gap-1.5">
                  <Icon icon="lucide:truck" width="14"></Icon> Free Shipping
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon icon="lucide:shield-check" width="14"></Icon> Easy
                  returns
                </div>
              </div>
            </div>

            {/* Right: Product Showcase (Col Span 7) */}
            <div className="lg:col-span-7 relative h-[550px] lg:h-[75vh] min-h-[500px] w-full animate-fade-in-up opacity-0 delay-200">
              {/* Main Product Image */}
              <div className="absolute inset-0 rounded-[32px] overflow-hidden shadow-2xl bg-[#F8F8F8] group">
                <Link href="/product-detail-page" className="block w-full h-full cursor-pointer relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1780&auto=format&fit=crop"
                    alt="Barrier Restore Serum"
                    className="object-center transition-transform duration-[2s] group-hover:scale-105 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              </div>

              {/* Floating Detail Card */}
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 w-72 bg-white p-7 rounded-[28px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] z-30 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Best Seller
                    </p>
                    <h3 className="text-[17px] font-bold text-neutral-900 tracking-tight">
                      Barrier Restore Serum
                    </h3>
                  </div>
                  <span className="bg-neutral-900 text-white text-[11px] font-bold px-2 py-1 rounded-md">
                    KSh 1,295
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Color Selection */}
                  <div className="flex gap-2.5">
                    <button className="w-6 h-6 rounded-full bg-[#E5E0D5] ring-2 ring-offset-2 ring-black cursor-pointer transition-all"></button>
                    <button className="w-6 h-6 rounded-full bg-[#3F3F3F] ring-2 ring-transparent hover:ring-offset-2 hover:ring-neutral-200 cursor-pointer transition-all"></button>
                    <button className="w-6 h-6 rounded-full bg-[#8C7E72] ring-2 ring-transparent hover:ring-offset-2 hover:ring-neutral-200 cursor-pointer transition-all"></button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => addQuickProduct("barrier-serum")}
                    className="w-full h-12 bg-neutral-900 hover:bg-black text-white text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-black/10"
                  >
                    <Icon icon="lucide:shopping-bag" width="16"></Icon>
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Secondary Image (Context) */}
              <div className="hidden lg:block absolute -right-6 top-10 w-52 aspect-[3/4] rounded-2xl overflow-hidden border-[6px] border-white shadow-2xl animate-fade-in-up opacity-0 delay-300 hover:scale-[1.03] transition-transform duration-700 z-20">
                <img
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop"
                  className="w-full h-full object-cover"
                  alt="Skincare products"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Ticker Section */}
      <div className="w-full border-y border-neutral-100 bg-neutral-50/60 py-5">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest text-center">
            <span className="flex items-center gap-2 hover:text-neutral-600 transition-colors cursor-default">
              <Icon icon="lucide:check-circle" width="14"></Icon> Sustainably
              Sourced
            </span>
            <span className="flex items-center gap-2 hover:text-neutral-600 transition-colors cursor-default">
              <Icon icon="lucide:box" width="14"></Icon> Free Global Shipping
            </span>
            <span className="flex items-center gap-2 hover:text-neutral-600 transition-colors cursor-default">
              <Icon icon="lucide:shield-check" width="14"></Icon> Dermatologist-tested
            </span>
            <span className="flex items-center gap-2 hidden sm:flex hover:text-neutral-600 transition-colors cursor-default">
              <Icon icon="lucide:heart" width="14"></Icon> Cruelty-free
            </span>
          </div>
        </div>
      </div>

      {/* NEW ARRIVALS */}
      <section className="w-full py-20 lg:py-32 scroll-mt-20" id="new">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex justify-between items-end mb-10 reveal">
            <h2 className="text-3xl lg:text-4xl font-medium tracking-tighter">
              New Arrivals
            </h2>
            <Link
              href="/product-listing-page"
              className="text-sm font-medium text-neutral-500 hover:text-black transition-colors flex items-center gap-1 group pb-1 border-b border-transparent hover:border-black"
            >
              Browse All
              <Icon
                icon="lucide:arrow-up-right"
                width="16"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              ></Icon>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
            {/* Large Item */}
            <div className="h-96 md:h-auto md:col-span-2 relative group overflow-hidden rounded-xl bg-neutral-100 reveal cursor-pointer">
              <Link href="/product-detail-page" className="block w-full h-full cursor-pointer relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=2560&auto=format&fit=crop"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Serums and treatments"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 transition-opacity duration-500"></div>
              </Link>
              <div className="absolute bottom-8 left-8 text-white z-10">
                <span className="text-xs font-bold uppercase tracking-wider mb-2 block opacity-80">
                  Collection 01
                </span>
                <h3 className="text-3xl font-medium tracking-tight mb-2">
                  Serums & treatments
                </h3>
                <p className="text-white/80 text-sm max-w-sm">
                  Targeted actives for glow, clarity, and barrier support—layered your way.
                </p>
              </div>
              <button className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl z-20 text-neutral-900">
                <Icon icon="lucide:arrow-right" width="20"></Icon>
              </button>
            </div>

            {/* Stacked Items */}
            <div className="grid grid-rows-2 gap-6 h-96 md:h-auto">
              <div className="relative group overflow-hidden rounded-xl bg-neutral-100 reveal delay-100 cursor-pointer">
                <Link href="/product-detail-page" className="block w-full h-full cursor-pointer relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=2070&auto=format&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt="Cleansers"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80"></div>
                </Link>
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h3 className="text-xl font-medium tracking-tight">Cleansers</h3>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-xl bg-neutral-100 reveal delay-200 cursor-pointer">
                <Link href="/product-detail-page" className="block w-full h-full cursor-pointer relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1780&auto=format&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt="Makeup"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80"></div>
                </Link>
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h3 className="text-xl font-medium tracking-tight">Makeup</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP SECTION */}
      <section
        className="w-full py-20 bg-neutral-50 border-y border-neutral-200 scroll-mt-20"
        id="shop"
      >
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6 reveal">
            <h2 className="text-3xl font-medium tracking-tighter text-neutral-900">
              Skincare essentials
            </h2>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <button className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold shadow-lg shadow-neutral-900/10 transition-transform active:scale-95">
                All
              </button>
              <button className="px-5 py-2.5 rounded-full bg-white border border-neutral-200 text-neutral-600 text-xs font-semibold hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                Skincare
              </button>
              <button className="px-5 py-2.5 rounded-full bg-white border border-neutral-200 text-neutral-600 text-xs font-semibold hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                Makeup
              </button>
              <button className="px-5 py-2.5 rounded-full bg-white border border-neutral-200 text-neutral-600 text-xs font-semibold hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                Body care
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
            {/* Product 1 */}
            <div className="group relative reveal">
              <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4 relative border border-neutral-100">
                <Link href="/product-detail-page" className="block w-full h-full cursor-pointer relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop"
                    alt="Barrier Restore Serum"
                    className="w-full h-full object-cover group-hover:opacity-0 transition-opacity absolute inset-0 z-10"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop"
                    alt="Serum alternate angle"
                    className="w-full h-full object-cover absolute inset-0 scale-105"
                  />
                </Link>

                <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addQuickProduct("barrier-serum");
                    }}
                    className="w-full h-10 bg-white/95 backdrop-blur text-neutral-900 text-xs font-bold rounded shadow-lg hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon icon="lucide:plus" width="14"></Icon> Quick Add
                  </button>
                </div>
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-all text-neutral-400 hover:text-red-500 hover:scale-110">
                    <Icon icon="lucide:heart" width="16"></Icon>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div className="cursor-pointer" onClick={() => window.location.href='/product-detail-page'}>
                  <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
                    Barrier Restore Serum
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">30 ml · Niacinamide</p>
                </div>
                <span className="text-sm font-semibold text-neutral-900">KSh 1,295</span>
              </div>
            </div>

            {/* Product 2 */}
            <div className="group relative reveal delay-75">
              <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4 relative border border-neutral-100">
                <Link href="/product-detail-page" className="block w-full h-full cursor-pointer relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1964&auto=format&fit=crop"
                    alt="Cloud Cream Moisturizer"
                    className="w-full h-full object-cover group-hover:opacity-0 transition-opacity absolute inset-0 z-10"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1598440947619-c608c443a5c7?q=80&w=800&auto=format&fit=crop"
                    alt="Moisturizer texture"
                    className="w-full h-full object-cover absolute inset-0 scale-105"
                  />
                </Link>
                <div className="absolute top-3 left-3 z-20 bg-neutral-900 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm">
                  New
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addQuickProduct("cloud-cream");
                    }}
                    className="w-full h-10 bg-white/95 backdrop-blur text-neutral-900 text-xs font-bold rounded shadow-lg hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon icon="lucide:plus" width="14"></Icon> Quick Add
                  </button>
                </div>
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-all text-neutral-400 hover:text-red-500 hover:scale-110">
                    <Icon icon="lucide:heart" width="16"></Icon>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div className="cursor-pointer" onClick={() => window.location.href='/product-detail-page'}>
                  <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
                    Cloud Cream Moisturizer
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">Ceramides · Unscented</p>
                </div>
                <span className="text-sm font-semibold text-neutral-900">KSh 890</span>
              </div>
            </div>

            {/* Product 3 */}
            <div className="group relative reveal delay-100">
              <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4 relative border border-neutral-100">
                <Link href="/product-detail-page" className="block w-full h-full cursor-pointer relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop"
                    alt="Velvet Matte Lip"
                    className="w-full h-full object-cover group-hover:opacity-0 transition-opacity absolute inset-0 z-10"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop"
                    alt="Lipstick shades"
                    className="w-full h-full object-cover absolute inset-0 scale-105"
                  />
                </Link>
                <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addQuickProduct("velvet-lip");
                    }}
                    className="w-full h-10 bg-white/95 backdrop-blur text-neutral-900 text-xs font-bold rounded shadow-lg hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon icon="lucide:plus" width="14"></Icon> Quick Add
                  </button>
                </div>
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-all text-neutral-400 hover:text-red-500 hover:scale-110">
                    <Icon icon="lucide:heart" width="16"></Icon>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div className="cursor-pointer" onClick={() => window.location.href='/product-detail-page'}>
                  <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
                    Velvet Matte Lip
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">Rosewood · 4 g</p>
                </div>
                <span className="text-sm font-semibold text-neutral-900">KSh 895</span>
              </div>
            </div>

            {/* Product 4 */}
            <div className="group relative reveal delay-150">
              <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4 relative border border-neutral-100">
                <Link href="/product-detail-page" className="block w-full h-full cursor-pointer relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1888&auto=format&fit=crop"
                    alt="Gentle Foam Cleanser"
                    className="w-full h-full object-cover group-hover:opacity-0 transition-opacity absolute inset-0 z-10"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?q=80&w=800&auto=format&fit=crop"
                    alt="Cleanser lather"
                    className="w-full h-full object-cover absolute inset-0 scale-105"
                  />
                </Link>
                <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addQuickProduct("gentle-cleanser");
                    }}
                    className="w-full h-10 bg-white/95 backdrop-blur text-neutral-900 text-xs font-bold rounded shadow-lg hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon icon="lucide:plus" width="14"></Icon> Quick Add
                  </button>
                </div>
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-all text-neutral-400 hover:text-red-500 hover:scale-110">
                    <Icon icon="lucide:heart" width="16"></Icon>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div className="cursor-pointer" onClick={() => window.location.href='/product-detail-page'}>
                  <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
                    Gentle Foam Cleanser
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">pH-balanced · 150 ml</p>
                </div>
                <span className="text-sm font-semibold text-neutral-900">KSh 695</span>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/product-listing-page"
              className="inline-block border-b border-black pb-0.5 text-sm font-semibold hover:text-neutral-600 hover:border-neutral-600 transition-all"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* COLLECTIONS (Split Screen) */}
      <section
        className="w-full grid lg:grid-cols-2 min-h-[600px] border-b border-neutral-100 scroll-mt-20"
        id="collections"
      >
        <div className="relative bg-neutral-100 h-96 lg:h-auto overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1556228578-0d85b1a4e571?q=80&w=1992&auto=format&fit=crop"
            alt="ANASHE beauty products"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-20 lg:px-24 bg-white">
          <div className="reveal max-w-lg">
            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase mb-4 block">
              Our Philosophy
            </span>
            <h2 className="text-3xl lg:text-4xl font-medium tracking-tighter mb-6 leading-tight">
              Formulas you trust,<br />results you can see.
            </h2>
            <p className="text-neutral-500 leading-relaxed mb-8 text-sm">
              We believe in honest labels and textures you will use to the last drop.
              Every product is developed with efficacy, skin tolerance, and
              responsible sourcing in mind.
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm font-medium text-neutral-800">
                <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
                  <Icon icon="lucide:check" width="12"></Icon>
                </div>
                No unnecessary fillers
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-neutral-800">
                <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
                  <Icon icon="lucide:check" width="12"></Icon>
                </div>
                Carbon-conscious shipping
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-neutral-800">
                <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
                  <Icon icon="lucide:check" width="12"></Icon>
                </div>
                Cruelty-free &amp; dermatologist-tested
              </li>
            </ul>

            <Link
              href="/about-us"
              className="inline-flex items-center text-sm font-semibold border border-neutral-200 px-6 py-3.5 rounded hover:bg-neutral-50 transition-colors"
            >
              Read our story
            </Link>
          </div>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="w-full py-20 lg:py-32 scroll-mt-20" id="journal">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-3xl font-medium tracking-tighter mb-12 reveal">
            The Journal
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article 1 */}
            <article className="group cursor-pointer reveal">
              <div className="overflow-hidden rounded-xl mb-5 aspect-[16/10] bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2070&auto=format&fit=crop"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Blog 1"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-2.5 uppercase tracking-wide">
                <span>Oct 12, 2023</span>
                <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                <span>Skincare</span>
              </div>
              <h3 className="text-xl font-medium tracking-tight mb-2 group-hover:underline decoration-1 underline-offset-4">
                Your barrier-friendly routine
              </h3>
              <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                How to layer cleanser, serum, and moisturizer without overwhelming
                sensitive or reactive skin.
              </p>
            </article>

            {/* Article 2 */}
            <article className="group cursor-pointer reveal delay-100">
              <div className="overflow-hidden rounded-xl mb-5 aspect-[16/10] bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1987&auto=format&fit=crop"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Blog 2"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-2.5 uppercase tracking-wide">
                <span>Sep 28, 2023</span>
                <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                <span>Makeup</span>
              </div>
              <h3 className="text-xl font-medium tracking-tight mb-2 group-hover:underline decoration-1 underline-offset-4">
                Makeup that works with your skin
              </h3>
              <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                Choosing finishes and coverage that complement the skincare underneath,
                from sheer tint to full glam.
              </p>
            </article>

            {/* Article 3 */}
            <article className="group cursor-pointer reveal delay-200">
              <div className="overflow-hidden rounded-xl mb-5 aspect-[16/10] bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1556228578-0d85b1a4e571?q=80&w=2070&auto=format&fit=crop"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Blog 3"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-2.5 uppercase tracking-wide">
                <span>Sep 15, 2023</span>
                <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                <span>Lab</span>
              </div>
              <h3 className="text-xl font-medium tracking-tight mb-2 group-hover:underline decoration-1 underline-offset-4">
                Inside our formulation lab
              </h3>
              <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                Why we stability-test every batch and how small production runs help
                us keep quality consistent.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full py-24 bg-neutral-900 text-white" id="newsletter">
        <div className="max-w-screen-xl mx-auto px-6 text-center reveal">
          <Icon icon="lucide:mail-open" width="32" className="mb-6 text-neutral-400"></Icon>
          <h2 className="text-3xl lg:text-4xl font-medium tracking-tighter mb-4">
            Join the list
          </h2>
          <p className="text-neutral-400 mb-10 max-w-md mx-auto text-sm">
            Sign up for early access to new drops and exclusive offers. No spam,
            ever.
          </p>

          <form
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const email = String(fd.get("email") ?? "").trim();
              if (email) setNewsletterDone(true);
            }}
          >
            <input
              name="email"
              type="email"
              required
              disabled={newsletterDone}
              placeholder="email@address.com"
              className="flex-1 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-4 py-3 outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all placeholder:text-neutral-600 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={newsletterDone}
              className="bg-white text-neutral-900 text-sm font-bold px-6 py-3 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-60"
            >
              {newsletterDone ? "Subscribed" : "Subscribe"}
            </button>
          </form>
          {newsletterDone && (
            <p className="mt-4 text-sm text-neutral-400">Thanks — you&apos;re on the list.</p>
          )}
        </div>
      </section>
    </>
  );
}
