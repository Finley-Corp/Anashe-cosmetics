'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, Search, User, Menu, X, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { CartDrawer } from './CartDrawer';

const NAV_LINKS = [
  { label: 'Shop', href: '/products' },
  { label: 'Collections', href: '/products?sort=popular' },
  { label: 'Editorial', href: '/blog' },
  { label: 'Journal', href: '/blog' },
  { label: 'About', href: '/about' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { getItemCount, toggleCart } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 transition-all duration-300 ${
          isScrolled ? 'shadow-[0_4px_30px_-4px_rgba(0,0,0,0.06)]' : ''
        }`}
      >
        <div className="flex h-16 max-w-screen-2xl mx-auto px-4 md:px-6 items-center justify-between relative">
          {/* Search overlay */}
          {isSearchOpen && (
            <div className="absolute inset-0 bg-white z-60 flex items-center px-4 md:px-6">
              <form onSubmit={handleSearch} className="flex items-center gap-3 w-full max-w-[1440px] mx-auto">
                <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="flex-1 h-10 bg-transparent border-none outline-none text-sm text-neutral-900 placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* Left: mobile trigger + desktop links */}
          <div className="flex items-center gap-3 z-50">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-1.5 -ml-1 text-zinc-500 hover:text-zinc-900 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-500">
              {NAV_LINKS.slice(0, 3).map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-zinc-900 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Center logo */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold tracking-tighter text-xl text-zinc-900 hover:opacity-80 transition-opacity"
          >
            ANASHE
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-2 md:gap-4 z-50">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-zinc-500 hover:text-zinc-900 transition-colors"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <Link
              href="/wishlist"
              className="text-zinc-500 hover:text-zinc-900 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-[18px] h-[18px]" />
            </Link>
            <Link
              href="/account"
              className="hidden lg:block text-zinc-500 hover:text-zinc-900 transition-colors"
              aria-label="Account"
            >
              <User className="w-[18px] h-[18px]" />
            </Link>
            <button
              onClick={toggleCart}
              className="relative text-zinc-500 hover:text-zinc-900 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {mounted && itemCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-900" />
                  </span>
                  <span className="sr-only">{itemCount} items in cart</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-16 left-0 w-full bg-white border-b border-neutral-100 shadow-xl overflow-hidden transition-all duration-300 ${
            isMobileOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <div className="px-4 py-6 space-y-4 max-h-[calc(100vh-64px)] overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="space-y-2">
                <Link
                  href={link.href}
                  className={`block text-lg font-medium transition-colors ${
                    pathname === link.href ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {link.label}
                </Link>
              </div>
            ))}
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <Link href="/account" className="block text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors">My Account</Link>
              <Link href="/wishlist" className="block text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors">Wishlist</Link>
              <Link href="/contact" className="block text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer />
    </>
  );
}
