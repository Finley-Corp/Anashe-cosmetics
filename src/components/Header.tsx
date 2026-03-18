"use client";

import { Search, ShoppingBag, Menu } from "lucide-react";
import Link from "next/link";

export function Header() {
  const navItems = [
    { label: "Shop", href: "/shop" },
    { label: "Rituals", href: "#" },
    { label: "Ingredients", href: "#" },
    { label: "About", href: "/about" },
    { label: "Journal", href: "#" },
  ];

  return (
    <header className="z-20 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group-hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-sm">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5"></path>
                  <path d="M12 7.5V9"></path>
                  <path d="M7.5 12H9"></path>
                  <path d="M16.5 12H15"></path>
                  <path d="M12 16.5V15"></path>
                  <path d="M8 8L9.5 9.5"></path>
                  <path d="M16 16L14.5 14.5"></path>
                  <path d="M16 8L14.5 9.5"></path>
                  <path d="M8 16L9.5 14.5"></path>
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tighter text-white font-bricolage drop-shadow-sm">ANASHE</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-white transition font-sans">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button 
              className="inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 text-sm text-white/80 border-gradient before:rounded-2xl bg-white/5 hover:text-white transition font-sans" 
              style={{ backdropFilter: "blur(4px) saturate(1.25)" }}
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-neutral-900 px-4 py-2.5 text-sm font-medium hover:bg-white/90 transition font-sans"
            >
              Bag (0)
              <ShoppingBag className="w-4 h-4" />
            </Link>
          </div>

          <button 
            aria-label="Open menu" 
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-2xl border-gradient before:rounded-2xl bg-white/5"
            style={{ backdropFilter: "blur(4px) saturate(1.25)" }}
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
