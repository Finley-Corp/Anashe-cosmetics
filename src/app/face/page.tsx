"use client";

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PRODUCT_CATALOG } from '@/components/sections/ProductsGrid';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/Toast';
import { useQuickView } from '@/components/ui/QuickViewModal';
import { cn } from '@/lib/utils';

export default function FacePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { openQuickView } = useQuickView();

  // Filter products that belong to face (most of them are face, but I'll filter by category if added)
  // For now, I'll use the existing filters to demonstrate
  const faceProducts = PRODUCT_CATALOG.filter(p => 
    activeFilter === 'all' || p.filter.includes(activeFilter)
  );

  return (
    <main className="min-h-screen bg-anashe-bg font-poppins selection:bg-anashe-lila selection:text-anashe-bg overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-8 lg:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(236,186,168,0.05)_0%,transparent_70%)] pointer-events-none translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-anashe-peach font-normal mb-6">
              <Icon icon="solar:star-bold" /> Facial Skincare
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-white mb-8">
              Radiance for Your <br />
              <em className="text-anashe-lila not-italic font-light italic">Most Precious Canvas</em>
            </h1>
            <p className="text-sm md:text-base text-white/50 font-light max-w-xl leading-relaxed mb-10">
              Discover the transformative power of Korean skincare. Our facial collection is curated to cleanse, treat, and protect your skin with the purest ingredients and most advanced formulas.
            </p>
            
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'all', label: 'All Essentials' },
                { id: 'limpeza', label: 'Cleansers' },
                { id: 'oleosa', label: 'Oily Skin' },
                { id: 'seca', label: 'Dry Skin' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-[10px] tracking-widest uppercase font-normal border transition-all duration-300",
                    activeFilter === f.id 
                      ? "bg-anashe-peach text-anashe-bg border-anashe-peach shadow-lg shadow-anashe-peach/20" 
                      : "border-white/10 text-white/40 hover:border-white/30 hover:text-white"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden hidden lg:block"
          >
            <img 
              src="https://imagedelivery.net/6HwnxsMACp9LGRV7S6ZRBA/luno.ao/2025/02/cuidados-facial-luno-ao.jpg/w=1000,q=85" 
              alt="Face Skin Ritual"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-anashe-bg via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-32 px-8 lg:px-20">
        <div className="max-w-[1600px] mx-auto">
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {faceProducts.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => openQuickView(p)}
                  className="group bg-[#252726]/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:bg-[#252726]/60 transition-all duration-500 flex flex-col h-full shadow-xl"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#1a1b1a]">
                    <img 
                      src={p.img} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className={cn("absolute top-4 left-4 text-[9px] font-normal tracking-widest uppercase px-3 py-1.5 rounded-full z-10", p.badgeClass)}>
                      {p.badge}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-[10px] tracking-widest uppercase text-anashe-peach font-normal mb-1">{p.brand}</div>
                    <h3 className="text-base font-light text-white mb-2 leading-tight group-hover:text-anashe-peach transition-colors">{p.name}</h3>
                    <p className="text-[11px] text-white/40 mb-4 font-extralight line-clamp-2">{p.desc}</p>
                    
                    <div className="flex items-center gap-1 mb-6">
                      <div className="text-anashe-peach text-[10px] flex items-center tracking-widest">★★★★★</div>
                      <span className="text-[9px] text-white/20 uppercase tracking-widest font-normal">({p.reviews} reviews)</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        {p.oldPrice && <div className="text-[10px] text-white/20 line-through mb-0.5">{p.oldPrice.toLocaleString()} KSH</div>}
                        <div className="text-lg font-light text-white">
                          {p.price.toLocaleString()} <span className="text-xs text-white/30">KSH</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p);
                          showToast(`"${p.name.substring(0, 20)}..." added`);
                        }}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-anashe-peach hover:text-anashe-bg hover:border-anashe-peach transition-all duration-300 group-hover:scale-110"
                      >
                        <Icon icon="solar:bag-plus-linear" width="1.2em" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="py-32 px-8 lg:px-20 bg-[#1a1b1a] border-t border-white/5">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extralight text-white mb-6 tracking-tight">Facial Routine <em className="text-anashe-lila not-italic italic font-light">Guide</em></h2>
            <p className="text-sm text-white/40 font-light italic">The fundamental 4-step ritual for healthy skin.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Cleanse", icon: "solar:water-linear", desc: "Double cleanse to remove impurities and SPF." },
              { step: "02", title: "Tonify", icon: "solar:magic-stick-linear", desc: "Balance pH and prep for deep absorption." },
              { step: "03", title: "Treat", icon: "solar:stars-linear", desc: "Serums targeting specific skin concerns." },
              { step: "04", title: "Protect", icon: "solar:sun-linear", desc: "Seal with moisturizer and always apply SPF." }
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/30 text-2xl mb-6 group-hover:bg-anashe-lila/10 group-hover:text-anashe-lila transition-all">
                  <Icon icon={item.icon} />
                </div>
                <div className="text-[10px] tracking-[0.3em] font-light text-white/20 mb-2">{item.step}</div>
                <h4 className="text-white font-light text-sm mb-3 uppercase tracking-widest">{item.title}</h4>
                <p className="text-[11px] text-white/30 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
