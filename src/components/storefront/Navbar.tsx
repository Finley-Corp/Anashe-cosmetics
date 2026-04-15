'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, User, Menu, X, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { CartDrawer } from './CartDrawer';
import { SearchBar } from './SearchBar';

const NAV_LINKS = [
  { label: 'Shop', href: '/products' },
  { label: 'Journal', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { getItemCount, toggleCart } = useCartStore();
  const itemCount = getItemCount();
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 border-b border-zinc-100 bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-[0_4px_30px_-4px_rgba(0,0,0,0.06)]' : ''
        }`}
      >
        <div className="flex h-16 max-w-screen-2xl mx-auto px-4 md:px-6 items-center justify-between relative">
          <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

          {/* Left: mobile trigger + desktop links */}
          <div className="flex items-center gap-3 z-50">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-1.5 -ml-1 text-zinc-500 hover:text-zinc-900 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-500">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="hover:text-zinc-900 transition-colors"
                >
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
              className={`text-zinc-500 hover:text-zinc-900 transition-colors ${isMobileOpen ? 'hidden lg:inline-flex' : ''}`}
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
              {isHydrated && itemCount > 0 && (
                <>
                  <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[var(--primary)] text-white text-[10px] leading-4 font-semibold flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                  <span className="sr-only">{itemCount} items in cart</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen ? (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-[70] border-t border-neutral-200 bg-white shadow-2xl">
          <div className="px-8 py-8 max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="border-b border-neutral-200 pb-6">
              <span className="block text-[24px] leading-none tracking-[0.22em] font-semibold uppercase text-[var(--primary)]">
                Shop
              </span>
            </div>

            <div className="border-b border-neutral-200 py-6">
              <Link
                href="/blog"
                onClick={() => setIsMobileOpen(false)}
                className="block text-[24px] leading-none tracking-[0.16em] font-semibold uppercase text-[var(--text-primary)]"
              >
                Journal
              </Link>
            </div>

            <div className="border-b border-neutral-200 py-6">
              <Link
                href="/about"
                onClick={() => setIsMobileOpen(false)}
                className="block text-[24px] leading-none tracking-[0.16em] font-semibold uppercase text-[var(--text-primary)]"
              >
                About
              </Link>
            </div>

            <div className="border-b border-neutral-200 py-6">
              <Link
                href="/contact"
                onClick={() => setIsMobileOpen(false)}
                className="block text-[24px] leading-none tracking-[0.16em] font-semibold uppercase text-[var(--text-primary)]"
              >
                Contact
              </Link>
            </div>

            <div className="border-b border-neutral-200 py-6">
              <Link
                href="/account"
                onClick={() => setIsMobileOpen(false)}
                className="block text-[24px] leading-none tracking-[0.16em] font-semibold uppercase text-[var(--text-primary)]"
              >
                Account
              </Link>
            </div>

            {NAV_LINKS.map((link) => (
              pathname === link.href ? (
                <span key={link.label} className="sr-only">{link.label}</span>
              ) : null
            ))}
          </div>
        </div>
        ) : null}
      </nav>

      <CartDrawer />
    </>
  );
}
