"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { BrandsMarquee } from '@/components/sections/BrandsMarquee';
import { Categories } from '@/components/sections/Categories';
import { ProductsGrid } from '@/components/sections/ProductsGrid';
import { RitualSection } from '@/components/sections/RitualSection';
import { QuizSection } from '@/components/sections/QuizSection';
import { KitBuilder } from '@/components/sections/KitBuilder';
import { Newsletter } from '@/components/sections/Newsletter';
import { Footer } from '@/components/layout/Footer';
import { CartProgressBar } from '@/components/ui/CartProgressBar';
import { QuickViewProvider } from '@/components/ui/QuickViewModal';
import { AuthModal } from '@/components/ui/AuthModal';

import { Icon } from '@iconify/react';

export default function AnasheLandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <QuickViewProvider>
      <main className="min-h-screen">
        <Navbar onAuthClick={() => setIsAuthOpen(true)} />
        
        <Hero />
        <BrandsMarquee />
        <Categories />
        <ProductsGrid />
        <RitualSection />
        <QuizSection />
        <KitBuilder />
        <Newsletter />
        
        <Footer />
        
        {/* Overlays */}
        <CartProgressBar />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        
        {/* WhatsApp support button */}
        <div className="fixed bottom-8 right-8 z-[400] flex flex-col items-end gap-3 group">
          <div className="bg-[#252726]/90 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 text-xs font-normal text-white opacity-0 translate-x-2 transition-all duration-200 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0">
            Apoio ao Cliente
          </div>
          <button 
            className="w-14 h-14 rounded-full bg-[#252726]/90 backdrop-blur-md border border-anashe-mint/30 shadow-2xl flex items-center justify-center text-anashe-mint hover:bg-anashe-mint/10 hover:border-anashe-mint/60 hover:scale-110 transition-all duration-300"
            onClick={() => window.open('https://wa.me/244900000000', '_blank')}
          >
            <Icon icon="solar:chat-round-dots-linear" width={24} />
          </button>
        </div>
      </main>
    </QuickViewProvider>
  );
}
