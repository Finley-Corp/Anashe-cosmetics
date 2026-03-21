"use client";

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { PRODUCT_CATALOG } from './ProductsGrid';

const kitSteps = [
  { label: 'Cleansing', icon: '🧴', type: 'limpeza' },
  { label: 'Toner', icon: '💧', type: 'tonico' },
  { label: 'Serum', icon: '✨', type: 'serum' },
  { label: 'Cream', icon: '🌿', type: 'hidratante' },
  { label: 'Sunscreen', icon: '☀️', type: 'solar' }
];

export const KitBuilder = () => {
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null, null]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const { addKitToCart } = useCart();
  const { showToast } = useToast();

  const filledCount = slots.filter(Boolean).length;
  const discount = filledCount >= 5 ? 15 : filledCount >= 4 ? 12 : filledCount >= 3 ? 8 : 0;

  const handleSelectProduct = (productId: string) => {
    if (activeSlot === null) return;
    const newSlots = [...slots];
    newSlots[activeSlot] = productId;
    setSlots(newSlots);
    setActiveSlot(null);
  };

  const calculateTotal = () => {
    let total = 0;
    slots.forEach(id => {
      if (id) {
        const p = PRODUCT_CATALOG.find(x => x.id === id);
        if (p) total += p.price;
      }
    });
    return total;
  };

  const subtotal = calculateTotal();
  const finalTotal = subtotal * (1 - discount / 100);

  return (
    <section id="kit" className="py-24 px-6 lg:px-20 bg-[#1a1b1a] relative border-t border-white/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-xs tracking-widest uppercase text-anashe-mint font-normal mb-3">
            <Icon icon="solar:box-minimalistic-linear" /> Personalized Kit
          </div>
          <h2 className="text-3xl md:text-4xl font-extralight tracking-tight text-white line-height-[1.2]">
            Build your <em className="text-anashe-mint not-italic">complete ritual</em>
          </h2>
          <p className="text-sm text-white/50 mt-4 max-w-lg mx-auto font-light">
            Choose 3, 4 or 5 products and get a progressive discount.
          </p>
        </div>

        <div className="bg-[#252726]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 lg:p-12 relative overflow-hidden">
          <div className="flex justify-center gap-3 mb-10">
            {[3, 4, 5].map((num) => {
              const d = num === 3 ? 8 : num === 4 ? 12 : 15;
              const isActive = filledCount >= num;
              return (
                <div 
                  key={num}
                  className={cn(
                    "flex-1 max-w-[160px] border rounded-xl p-4 text-center transition-all duration-500",
                    isActive ? "border-anashe-mint/50 bg-anashe-mint/10" : "border-white/10 bg-transparent"
                  )}
                >
                  <div className={cn("text-3xl font-extralight mb-1", isActive ? "text-white" : "text-white/20")}>
                    {d}<span className="text-base text-anashe-mint">%</span>
                  </div>
                  <div className="text-[10px] tracking-widest uppercase text-white/40">{num} Products</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {slots.map((pid, i) => {
              if (pid) {
                const p = PRODUCT_CATALOG.find(x => x.id === pid);
                return (
                  <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-anashe-lila/30 group cursor-pointer" onClick={() => setActiveSlot(i)}>
                    <img src={p?.img} alt={p?.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-anashe-bg pt-8 pb-3 px-2 text-center text-[10px] font-normal text-white leading-tight">
                      {p?.name.substring(0, 20)}...
                    </div>
                    <button 
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-anashe-bg/80 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-anashe-pink"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newSlots = [...slots];
                        newSlots[i] = null;
                        setSlots(newSlots);
                      }}
                    >
                      <Icon icon="solar:close-circle-linear" />
                    </button>
                  </div>
                );
              }
              return (
                <div 
                  key={i}
                  onClick={() => setActiveSlot(i)}
                  className={cn(
                    "aspect-[3/4] rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group",
                    activeSlot === i ? "border-anashe-lila bg-anashe-lila/10" : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40"
                  )}
                >
                  <div className="text-3xl opacity-40 group-hover:opacity-100 group-hover:scale-110 duration-300">{kitSteps[i].icon}</div>
                  <div className="text-[10px] tracking-widest uppercase text-white/50 text-center px-2">{kitSteps[i].label}</div>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {activeSlot !== null && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-white/10 pt-8 mt-4"
              >
                <div className="text-xl font-light text-white mb-6">
                  <span className="text-2xl mr-2">{kitSteps[activeSlot].icon}</span> Choose your <strong className="font-normal text-anashe-lila">{kitSteps[activeSlot].label}</strong>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto hide-scroll pr-2">
                  {PRODUCT_CATALOG.filter(p => !slots.includes(p.id)).map(p => (
                    <div 
                      key={p.id}
                      onClick={() => handleSelectProduct(p.id)}
                      className="bg-[#1a1b1a] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-anashe-lila/50 transition-all p-3"
                    >
                      <img src={p.img} alt={p.name} className="aspect-square w-full object-cover rounded-lg mb-3" />
                      <div className="text-[9px] tracking-widest uppercase text-anashe-lila font-normal mb-1">{p.brand}</div>
                      <div className="text-xs font-light text-white line-clamp-1 mb-1">{p.name}</div>
                      <div className="text-xs text-white/50">{p.price.toLocaleString()} Kz</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 lg:p-8 bg-anashe-bg border border-white/5 rounded-xl mt-10">
            {filledCount === 0 ? (
              <div className="w-full text-center text-sm font-light text-white/50">Add products to see your discount.</div>
            ) : (
              <>
                <div className="flex-1 w-full md:w-auto">
                  <div className="text-[10px] tracking-widest uppercase text-white/50 mb-2">{filledCount} of 5 products</div>
                  <div className="text-3xl font-extralight text-white mb-1">
                    {Math.round(finalTotal).toLocaleString()} <span className="text-sm">Kz</span>
                  </div>
                  {discount > 0 ? (
                    <div className="text-xs text-anashe-mint font-normal">Discount applied: -{Math.round(subtotal - finalTotal).toLocaleString()} Kz ({discount}%)</div>
                  ) : (
                    <div className="text-xs text-white/30">Add {3 - filledCount} more for 8% off.</div>
                  )}
                </div>
                <button 
                  disabled={filledCount < 3}
                  onClick={() => {
                    const items = slots.filter(Boolean).map(id => {
                        const p = PRODUCT_CATALOG.find(x => x.id === id);
                        return p!;
                    });
                    addKitToCart(items);
                    showToast(`Kit with ${items.length} products added!`);
                  }}
                  className={cn(
                    "w-full md:w-auto px-8 py-4 rounded-lg text-xs font-normal tracking-widest uppercase transition-all",
                    filledCount >= 3 ? "bg-white text-anashe-bg hover:bg-anashe-mint hover:-translate-y-0.5" : "bg-white/5 text-white/30 pointer-events-none"
                  )}
                >
                  Add Kit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
