"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

const product = {
  name: "Kyoto Lounge Chair",
  price: 1295,
  description: "A harmonious fusion of Japanese minimalism and Scandinavian craftsmanship. The Kyoto Lounge Chair features a hand-woven paper cord seat and a precisely milled solid ash frame, designed to age gracefully over generations.",
  images: [
    "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1964&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=800&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80"
  ],
  colors: [
    { name: "Natural Ash", hex: "#E5E0D5" },
    { name: "Blackened Ash", hex: "#171717" }
  ],
  specs: [
    { label: "Dimensions", value: "75cm W x 82cm D x 78cm H" },
    { label: "Seat Height", value: "38cm" },
    { label: "Material", value: "Solid FSC Ash, Paper Cord" },
    { label: "Weight", value: "14kg" }
  ],
  details: [
    {
      title: "Artisan Craftsmanship",
      content: "Each Kyoto chair requires over 40 hours of manual labor, including the intricate hand-weaving of the paper cord seat which uses over 400 meters of material."
    },
    {
      title: "Sustainability",
      content: "We source our timber exclusively from FSC-certified forests in Northern Europe. Our paper cord is biodegradable and treated with a natural wax finish for longevity."
    }
  ]
};

const relatedProducts = [
  { name: "Nara Side Table", price: 450, img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1888&auto=format&fit=crop" },
  { name: "Arco Floor Lamp", price: 895, img: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800&q=80" },
  { name: "Orbital Lamp", price: 320, img: "https://images.unsplash.com/photo-1604610728890-6f4b631ed081?w=800&q=80" },
  { name: "Linear Console", price: 1850, img: "https://images.unsplash.com/photo-1622653533660-a1538fe8424c?w=2560&q=80" }
];

export default function ProductDetailPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openDetail, setOpenDetail] = useState<number | null>(0);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-12 reveal">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="text-neutral-200">/</span>
          <Link href="/product-listing-page" className="hover:text-black transition-colors">Furniture</Link>
          <span className="text-neutral-200">/</span>
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-32">
          {/* Left: Gallery (Vertical layout for desktop) */}
          <div className="flex-1 flex flex-col-reverse lg:flex-row gap-6 reveal">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto no-scrollbar lg:w-20">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square w-20 flex-shrink-0 rounded-lg overflow-hidden border transition-all ${activeImage === i ? "border-black shadow-md" : "border-neutral-100 opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumb ${i}`} />
                </button>
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1 aspect-[4/5] bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 relative group">
              <img 
                src={product.images[activeImage]} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                alt={product.name}
              />
              <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur px-3 py-1.5 rounded-sm shadow-sm text-[9px] font-bold tracking-[0.2em] text-black">
                ARTISAN EDITION
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-[480px] space-y-12 reveal delay-100">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Furniture Collection</span>
                <h1 className="text-4xl lg:text-5xl font-medium tracking-tighter text-black">{product.name}</h1>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold text-black">KSh {product.price.toLocaleString()}</div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1.5 rounded-full uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Ready to Ship
                </div>
              </div>

              <p className="text-neutral-500 text-base md:text-lg font-medium leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Configurator */}
            <div className="space-y-10 pt-6 border-t border-neutral-100">
               {/* Color Selection */}
               <div className="space-y-4">
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Finish: {product.colors[selectedColor].name}</span>
                 <div className="flex gap-4">
                    {product.colors.map((color, i) => (
                      <button 
                        key={i}
                        onClick={() => setSelectedColor(i)}
                        className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 ${selectedColor === i ? "border-black scale-110 shadow-lg" : "border-transparent hover:scale-105"}`}
                      >
                         <div className="w-full h-full rounded-full" style={{ background: color.hex }}></div>
                      </button>
                    ))}
                 </div>
               </div>

               {/* Quantity & Actions */}
               <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center h-14 bg-neutral-50 border border-neutral-100 rounded-xl px-2 w-full sm:w-36">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 flex items-center justify-center hover:bg-white rounded-lg transition-all h-10">
                      <Icon icon="lucide:minus" width="16"></Icon>
                    </button>
                    <span className="flex-1 flex items-center justify-center font-bold text-sm">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="flex-1 flex items-center justify-center hover:bg-white rounded-lg transition-all h-10">
                      <Icon icon="lucide:plus" width="16"></Icon>
                    </button>
                  </div>
                  <button className="w-full sm:flex-1 h-14 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-2xl shadow-black/10 flex items-center justify-center gap-2 uppercase text-xs tracking-widest">
                    Add to Cart <Icon icon="lucide:shopping-bag" width="18"></Icon>
                  </button>
               </div>
            </div>

            {/* Details Accordion */}
            <div className="space-y-4 pt-4">
              {product.details.map((detail, idx) => (
                <div key={idx} className="border-b border-neutral-100 pb-4">
                  <button 
                    onClick={() => setOpenDetail(openDetail === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-black py-2"
                  >
                    {detail.title}
                    <Icon icon="lucide:chevron-down" width="16" className={`transition-transform duration-300 ${openDetail === idx ? "rotate-180" : ""}`}></Icon>
                  </button>
                  {openDetail === idx && (
                    <div className="pt-4 text-sm text-neutral-500 font-medium leading-relaxed animate-fade-in-up">
                      {detail.content}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Static Specs Row */}
              <div className="pt-6 grid grid-cols-2 gap-y-6">
                 {product.specs.map((spec, i) => (
                   <div key={i}>
                     <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{spec.label}</div>
                     <div className="text-[13px] font-bold text-black">{spec.value}</div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>

        {/* Complete the Look Section */}
        <section className="mt-32 pt-24 border-t border-neutral-100 reveal">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Curation</span>
               <h2 className="text-4xl font-medium tracking-tighter text-black">Complete the look</h2>
            </div>
            <Link href="/product-listing-page" className="hidden sm:flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-black transition-colors uppercase tracking-widest group">
              Browse Collection <Icon icon="lucide:arrow-right" width="16" className="group-hover:translate-x-1 transition-transform"></Icon>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-neutral-50 rounded-2xl overflow-hidden mb-6 border border-neutral-100 relative">
                  <Link href="/product-detail-page" className="block w-full h-full cursor-pointer">
                    <img src={item.img} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" alt={item.name} />
                  </Link>
                  <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button className="w-full py-3 bg-white/95 backdrop-blur text-black text-[10px] font-bold rounded shadow-lg uppercase tracking-widest hover:bg-black hover:text-white transition-all">Quick View</button>
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
        </section>
      </div>
    </div>
  );
}
