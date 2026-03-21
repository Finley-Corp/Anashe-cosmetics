"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export const CartProgressBar = () => {
  const { cartTotal, isFreeShipping, shippingProgress } = useCart();

  if (cartTotal === 0) return null;

  return (
    <div className={cn(
      "fixed bottom-0 inset-x-0 z-[450] bg-[#1a1b1a]/95 backdrop-blur-xl border-t border-white/10 py-3 px-6 lg:px-12 flex items-center gap-6 transition-transform duration-500 ease-out",
      cartTotal > 0 ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="text-xs font-light text-white/70 whitespace-nowrap">
        {isFreeShipping ? (
          <strong className="text-white font-normal text-anashe-mint uppercase tracking-widest">🎉 Free shipping unlocked!</strong>
        ) : (
          <>Only <strong className="text-white font-normal uppercase tracking-widest">{(5000 - cartTotal).toLocaleString()} KSH</strong> for free shipping</>
        )}
      </div>
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-anashe-lila to-anashe-mint transition-all duration-500" 
          style={{ width: `${shippingProgress}%` }}
        />
      </div>
      <div className="text-[10px] text-anashe-mint font-normal whitespace-nowrap hidden sm:block uppercase tracking-widest">
        Free shipping at 5,000 KSH
      </div>
    </div>
  );
};
