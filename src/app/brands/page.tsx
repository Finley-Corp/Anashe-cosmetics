"use client";

import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const BRANDS_DATA = [
  {
    name: "Beauty of Joseon",
    desc: "Merging traditional Hanbang herbal medicine with modern science for timeless skincare.",
    origin: "Seoul, South Korea",
    philosophy: "Modern Hanbang",
    icon: "solar:leaf-linear",
    color: "bg-[#ECBAA8]"
  },
  {
    name: "Anua",
    desc: "Minimalist skincare focusing on high-quality natural ingredients like Heartleaf for sensitive skin.",
    origin: "Seoul, South Korea",
    philosophy: "Pure Ingredients",
    icon: "solar:water-drops-linear",
    color: "bg-[#B5E3D8]"
  },
  {
    name: "SKIN1004",
    desc: "Harnessing the power of high-quality Centella Asiatica from Madagascar for raw purity.",
    origin: "Seoul, South Korea",
    philosophy: "Nature's Purity",
    icon: "solar:mountain-linear",
    color: "bg-[#B4B5DF]"
  },
  {
    name: "VT Cosmetics",
    desc: "Innovators in skincare technology, famous for the Reedle Shot and Cica-based solutions.",
    origin: "Seoul, South Korea",
    philosophy: "Skin Tech",
    icon: "solar:magic-stick-linear",
    color: "bg-[#F1BDC8]"
  },
  {
    name: "Purito Seoul",
    desc: "Earth-friendly, 100% cruelty-free skincare focusing on fundamental skin barrier health.",
    origin: "Seoul, South Korea",
    philosophy: "Eco-Friendly",
    icon: "solar:planet-linear",
    color: "bg-[#B5E3D8]"
  },
  {
    name: "SOME BY MI",
    desc: "High-performance treatments for specific skin concerns like acne and hyperpigmentation.",
    origin: "Seoul, South Korea",
    philosophy: "Miracle Results",
    icon: "solar:stars-linear",
    color: "bg-[#ECBAA8]"
  },
  {
    name: "K-SECRET",
    desc: "Hidden gems of K-Beauty, bringing effective and targeted solutions to global audiences.",
    origin: "Seoul, South Korea",
    philosophy: "Secret Formulas",
    icon: "solar:key-linear",
    color: "bg-[#B4B5DF]"
  },
  {
    name: "Abib",
    desc: "Seeking perfection in the purest form of skincare, prioritizing natural vitality and health.",
    origin: "Seoul, South Korea",
    philosophy: "Minimalist Perfection",
    icon: "solar:shield-check-linear",
    color: "bg-[#F1BDC8]"
  }
];

export default function BrandsPage() {
  return (
    <main className="min-h-screen bg-anashe-bg font-poppins selection:bg-anashe-lila selection:text-anashe-bg">
      <Navbar />
      
      {/* Hero Header */}
      <section className="pt-40 pb-24 px-8 lg:px-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle,rgba(180,181,223,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 text-xs tracking-[0.3em] uppercase text-anashe-lila font-normal mb-6">
              <Icon icon="solar:stars-bold" /> Our Partners
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-white mb-8">
              The Finest of <br />
              <em className="text-anashe-peach not-italic">Korean Beauty</em>
            </h1>
            <p className="text-sm md:text-base text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
              We exclusively curate authentic brands that combine centuries of tradition with cutting-edge science. 
              Each brand in our selection is chosen for its efficacy and commitment to skin health.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="pb-32 px-8 lg:px-20 relative">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRANDS_DATA.map((brand, idx) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-[#252726]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:bg-[#252726]/80 hover:border-white/10 transition-all duration-500 flex flex-col items-center text-center shadow-xl"
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-anashe-bg text-3xl transition-transform duration-500 group-hover:scale-110",
                brand.color
              )}>
                <Icon icon={brand.icon} />
              </div>
              
              <h3 className="text-xl font-light text-white mb-4 group-hover:text-anashe-lila transition-colors">
                {brand.name}
              </h3>
              
              <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/30 font-normal mb-6">
                <Icon icon="solar:map-point-linear" /> {brand.origin}
              </div>
              
              <p className="text-xs text-white/50 font-light leading-relaxed mb-8 flex-1">
                {brand.desc}
              </p>
              
              <div className="w-full pt-6 border-t border-white/5 flex flex-col gap-3">
                <div className="text-[9px] tracking-widest uppercase text-white/20">Philosophy</div>
                <div className="text-[10px] text-anashe-mint font-normal tracking-widest uppercase">
                  {brand.philosophy}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-8 lg:px-20 bg-[#1a1b1a] border-y border-white/5">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <Icon icon="solar:verified-check-linear" className="text-3xl text-anashe-mint mb-6" />
            <h4 className="text-white text-lg font-light mb-3">100% Authentic</h4>
            <p className="text-xs text-white/40 leading-relaxed font-light">All products are sourced directly from authorized brand distributors.</p>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon="solar:diploma-linear" className="text-3xl text-anashe-lila mb-6" />
            <h4 className="text-white text-lg font-light mb-3">Curated Selection</h4>
            <p className="text-xs text-white/40 leading-relaxed font-light">Only the most effective and safe formulas make it into our routine guide.</p>
          </div>
          <div className="flex flex-col items-center">
            <Icon icon="solar:earth-linear" className="text-3xl text-anashe-peach mb-6" />
            <h4 className="text-white text-lg font-light mb-3">Global Standards</h4>
            <p className="text-xs text-white/40 leading-relaxed font-light">Complying with the highest quality standards from South Korea to the world.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
