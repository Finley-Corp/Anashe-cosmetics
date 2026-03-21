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
        {[
          { label: 'Face', href: '/face' },
          { label: 'Body', href: '/body' },
          { label: 'Services', href: '/services' },
          { label: 'Brands', href: '/brands' }
        ].map((item) => (
          <Link 
            key={item.label} 
            href={item.href} 
            className="text-xs font-normal tracking-widest uppercase text-anashe-fg/60 hover:text-anashe-fg transition-colors relative group py-1"
          >
            {item.label}
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
          className="lg:hidden flex flex-col justify-center gap-1 w-9 h-9 text-anashe-fg relative z-[600]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={cn("w-5 h-[1.5px] bg-current transition-all duration-300 origin-center absolute left-2", isMobileMenuOpen ? "rotate-45" : "-translate-y-1.5")}></span>
          <span className={cn("w-5 h-[1.5px] bg-current transition-all duration-300 absolute left-2", isMobileMenuOpen && "opacity-0")}></span>
          <span className={cn("w-5 h-[1.5px] bg-current transition-all duration-300 origin-center absolute left-2", isMobileMenuOpen ? "-rotate-45" : "translate-y-1.5")}></span>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[590] transition-opacity duration-500 lg:hidden",
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div 
        className={cn(
          "fixed top-0 right-0 w-[300px] h-full z-[600] flex flex-col p-12 gap-8 transition-transform duration-500 ease-out lg:hidden border-l border-white/10 shadow-2xl",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ backgroundColor: '#212322', opacity: 1 }}
      >
        <button 
          className="absolute top-6 right-6 text-anashe-fg/40 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Icon icon="solar:close-circle-linear" width="1.5em" />
        </button>

        <div className="flex flex-col gap-6 mt-12">
          {[
            { label: 'Face', href: '/face' },
            { label: 'Body', href: '/body' },
            { label: 'Services', href: '/services' },
            { label: 'Brands', href: '/brands' },
            { label: 'My Account', href: '#' }
          ].map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className="text-lg tracking-widest uppercase font-light text-white hover:text-anashe-lila transition-colors" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-12 border-t border-white/5 flex flex-col gap-4">
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/20">Follow us</div>
          <div className="flex gap-4">
            <Icon icon="solar:camera-linear" className="text-white/40 text-xl" />
            <Icon icon="solar:letter-linear" className="text-white/40 text-xl" />
          </div>
        </div>
      </div>
    </nav>
  );
};
