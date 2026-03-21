"use client";

import React, { createContext, useContext, useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface QuickViewContextType {
  openQuickView: (product: any) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export const QuickViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [product, setProduct] = useState<any>(null);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const openQuickView = (p: any) => setProduct(p);
  const closeQuickView = () => setProduct(null);

  return (
    <QuickViewContext.Provider value={{ openQuickView, closeQuickView }}>
      {children}
      <AnimatePresence>
        {product && (
          <div className="fixed inset-0 z-[800] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 lg:p-12">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#252726] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 relative shadow-2xl"
            >
              <button 
                className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-20"
                onClick={closeQuickView}
              >
                <Icon icon="solar:close-circle-linear" width="1.2em" />
              </button>
              
              <div className="aspect-square md:aspect-auto bg-[#1a1b1a] relative">
                <img src={product.img} className="absolute inset-0 w-full h-full object-cover" alt={product.name} />
              </div>
              
              <div className="p-8 lg:p-12 flex flex-col gap-4">
                <div className={cn("self-start text-[9px] font-normal tracking-widest uppercase px-2 py-1 rounded-sm mb-4", product.badgeClass)}>
                  {product.badge || 'Featured'}
                </div>
                <div className="text-[10px] tracking-widest uppercase text-anashe-lila font-normal mb-1">{product.brand}</div>
                <div className="text-3xl font-extralight tracking-tight text-white mb-2 leading-tight">{product.name}</div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="text-anashe-peach text-xs tracking-widest">★★★★★</div>
                  <span className="text-xs text-white/50 font-light">{product.reviews} reviews</span>
                </div>
                <p className="text-sm font-light text-white/70 leading-relaxed mb-6">{product.desc}</p>
                
                <div className="bg-anashe-lila/5 border border-anashe-lila/20 rounded-xl p-4 mb-6">
                  <div className="text-[10px] tracking-widest uppercase text-anashe-lila font-normal mb-2">✦ Why choose?</div>
                  <p className="text-xs font-light text-white/80 leading-relaxed italic">
                    Ideal for those seeking real results and a simplified skincare routine.
                  </p>
                </div>
                
                <div className="flex items-end justify-between mt-auto pt-6 border-t border-white/10">
                  <div>
                    {product.oldPrice && <div className="text-xs text-white/30 line-through mb-1">{product.oldPrice.toLocaleString()} KSH</div>}
                    <div className="text-3xl font-extralight text-white">{product.price.toLocaleString()} <span className="text-sm text-white/50">KSH</span></div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-12 h-12 rounded-lg border border-white/20 flex items-center justify-center text-white/50 hover:border-anashe-pink hover:text-anashe-pink transition-colors">
                      <Icon icon="solar:heart-linear" width="1.5em" />
                    </button>
                    <button 
                      className="px-8 py-3 bg-white text-anashe-bg text-xs font-normal tracking-widest uppercase rounded-lg hover:bg-anashe-lila hover:-translate-y-0.5 transition-all font-medium"
                      onClick={() => {
                        addToCart(product);
                        showToast(`"${product.name.substring(0, 20)}..." added`);
                        closeQuickView();
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </QuickViewContext.Provider>
  );
};

export const useQuickView = () => {
  const context = useContext(QuickViewContext);
  if (!context) throw new Error('useQuickView must be used within a QuickViewProvider');
  return context;
};
