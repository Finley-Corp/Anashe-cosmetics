"use client";

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const { items, cartTotal, updateQuantity, removeFromCart, isFreeShipping } = useCart();

  return (
    <main className="min-h-screen bg-anashe-bg font-poppins selection:bg-anashe-lila selection:text-anashe-bg overflow-x-hidden">
      <Navbar />
      
      <section className="pt-32 pb-24 px-6 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extralight text-white tracking-tight mb-4">Your <em className="text-anashe-lila not-italic italic font-light">Selection</em></h1>
            <p className="text-white/40 font-light text-sm italic">Review your curated ritual before proceeding to checkout.</p>
          </motion.div>

          {items.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-[#252726]/30">
              <Icon icon="solar:bag-2-linear" className="text-6xl text-white/10 mx-auto mb-6" />
              <p className="text-white/50 font-light mb-8">Your bag is currently empty.</p>
              <Link 
                href="/face" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-anashe-bg text-xs font-normal tracking-widest uppercase rounded hover:bg-anashe-lila transition-all"
              >
                Discover Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 flex flex-col gap-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 p-6 bg-[#252726]/40 backdrop-blur-md border border-white/5 rounded-2xl group">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden bg-[#1a1b1a] shrink-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="text-[10px] tracking-widest uppercase text-anashe-lila mb-1">{item.brand}</div>
                        <h3 className="text-base lg:text-lg font-light text-white leading-tight mb-2">{item.name}</h3>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-white/5 rounded-full px-4 py-1.5 border border-white/10">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-white/40 hover:text-white transition-colors">-</button>
                          <span className="text-xs text-white min-w-[20px] text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-white/40 hover:text-white transition-colors">+</button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm lg:text-base font-light text-white">{(item.price * item.quantity).toLocaleString()} KSH</div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-[10px] text-white/20 hover:text-anashe-pink uppercase tracking-widest mt-1 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {!isFreeShipping && (
                  <div className="p-6 bg-anashe-lila/5 border border-anashe-lila/10 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-anashe-lila/10 flex items-center justify-center text-anashe-lila">
                      <Icon icon="solar:delivery-linear" />
                    </div>
                    <p className="text-xs text-white/50 font-light">
                      Add <strong className="text-anashe-lila font-normal">{(5000 - cartTotal).toLocaleString()} KSH</strong> more to unlock <span className="text-anashe-mint">FREE SHIPPING</span>.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-6">
                <div className="p-8 bg-[#252726]/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl sticky top-32">
                  <h3 className="text-lg font-light text-white mb-8 tracking-widest uppercase">Summary</h3>
                  
                  <div className="flex flex-col gap-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40 font-light">Subtotal</span>
                      <span className="text-white font-light">{cartTotal.toLocaleString()} KSH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40 font-light">Shipping</span>
                      <span className="text-white font-light">{isFreeShipping ? 'FREE' : '450 KSH'}</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/5 flex justify-between items-end mb-10">
                    <span className="text-xs tracking-widest uppercase text-white/40">Total</span>
                    <span className="text-3xl font-extralight text-anashe-peach">
                      {(cartTotal + (isFreeShipping ? 0 : 450)).toLocaleString()} <span className="text-sm">KSH</span>
                    </span>
                  </div>
                  
                  <Link 
                    href="/checkout"
                    className="flex items-center justify-center gap-2 w-full py-5 bg-white text-anashe-bg text-xs font-normal tracking-widest uppercase rounded hover:bg-anashe-peach transition-all"
                  >
                    Proceed to Checkout <Icon icon="solar:arrow-right-linear" />
                  </Link>

                  <div className="mt-6 flex items-center justify-center gap-4 text-white/20">
                    <Icon icon="logos:visa" width="30" />
                    <Icon icon="logos:mastercard" width="30" />
                    <Icon icon="simple-icons:mpesa" className="text-[#39df1b]" width="30" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
