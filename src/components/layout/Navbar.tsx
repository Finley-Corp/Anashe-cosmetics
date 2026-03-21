"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export const Navbar = ({ onAuthClick }: { onAuthClick?: () => void }) => {
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 inset-x-0 z-[500] grid grid-cols-2 lg:grid-cols-3 items-center px-6 lg:px-12 h-[68px] transition-all duration-500",
      isScrolled ? "bg-anashe-bg/80 backdrop-blur-xl border-b border-white/10 shadow-2xl" : "bg-[#212322]/80 backdrop-blur-xl border-b border-white/10"
    )}>
      <div className="hidden lg:flex gap-8 items-center">
        {['Face', 'Body', 'Hair', 'Brands'].map((item) => (
          <Link 
            key={item} 
            href={item === 'Brands' ? '/brands' : '/'} 
            className="text-xs font-normal tracking-widest uppercase text-anashe-fg/60 hover:text-anashe-fg transition-colors relative group py-1"
          >
            {item}
            <span className="absolute bottom-0 left-0 w-0 h-px bg-anashe-lila transition-all group-hover:w-full"></span>
          </Link>
        ))}
      </div>
      
      <Link href="/" className="flex items-center lg:justify-center hover:opacity-70 transition-opacity">
        <h1 className="text-xl lg:text-2xl tracking-[0.2em] font-extralight text-anashe-fg">ANASHE</h1>
      </Link>
      
      <div className="flex gap-4 items-center justify-end">
        <button className="hidden lg:flex w-9 h-9 items-center justify-center text-anashe-fg/60 hover:text-anashe-fg hover:bg-white/5 rounded-full transition-colors">
          <Icon icon="solar:magnifer-linear" width="1.2em" />
        </button>
        <button className="hidden lg:flex w-9 h-9 items-center justify-center text-anashe-fg/60 hover:text-anashe-fg hover:bg-white/5 rounded-full transition-colors">
          <Icon icon="solar:heart-linear" width="1.2em" />
        </button>
        <button className="relative w-9 h-9 flex items-center justify-center text-anashe-fg/60 hover:text-anashe-fg hover:bg-white/5 rounded-full transition-colors">
          <Icon icon="solar:bag-2-linear" width="1.2em" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-anashe-lila text-anashe-bg rounded-full text-[10px] font-normal flex items-center justify-center">
            {cartCount}
          </div>
        </button>
        
        <button 
          className="hidden lg:flex w-9 h-9 items-center justify-center text-anashe-fg/60 hover:text-anashe-fg hover:bg-white/5 rounded-full transition-colors"
          onClick={onAuthClick}
        >
          <Icon icon="solar:user-circle-linear" width="1.2em" />
        </button>

        <button 
          className="lg:hidden flex flex-col justify-center gap-1.5 w-9 h-9 text-anashe-fg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={cn("w-5 h-px bg-current transition-transform origin-center", isMobileMenuOpen && "rotate-45 translate-y-2")}></span>
          <span className={cn("w-5 h-px bg-current transition-opacity", isMobileMenuOpen && "opacity-0")}></span>
          <span className={cn("w-5 h-px bg-current transition-transform origin-center", isMobileMenuOpen && "-rotate-45 -translate-y-2")}></span>
        </button>
      </div>

      <div className={cn(
        "fixed inset-0 bg-anashe-bg z-[490] flex flex-col items-center justify-center gap-8 transition-all duration-500 lg:hidden",
        isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}>
        {['Face', 'Body', 'Hair', 'Brands', 'My Account'].map((item) => (
          <Link 
            key={item} 
            href={item === 'Brands' ? '/brands' : '/'} 
            className="text-xl tracking-widest uppercase font-light" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
};
