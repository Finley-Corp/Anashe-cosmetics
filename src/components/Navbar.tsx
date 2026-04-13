"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

const MOBILE_LINKS: { href: string; label: string; accent?: boolean }[] = [
  { href: "/shop", label: "New Arrivals", accent: true },
  { href: "/shop", label: "Furniture" },
  { href: "/shop", label: "Lighting" },
  { href: "/shop", label: "Accessories" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/account", label: "Account" },
  { href: "/contact", label: "Trade Inquiries", accent: true },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isSearchOpen) setIsSearchOpen(false);
        if (isMenuOpen) setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isSearchOpen, isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-neutral-100 transition-all duration-300${isScrolled ? " shadow-[0_4px_30px_-4px_rgba(0,0,0,0.03)]" : ""}`}
      >
      <div className="flex h-16 max-w-[1440px] mr-auto ml-auto pr-6 pl-6 relative items-center justify-between">

        {/* Search Bar Overlay */}
        <div
          id="search-bar-container"
          className={`absolute inset-0 bg-white z-[60] flex items-center px-6 transition-all duration-300${
            isSearchOpen
              ? " opacity-100 visible translate-y-0"
              : " opacity-0 invisible -translate-y-2"
          }`}
        >
          <div className="max-w-[1440px] mx-auto w-full flex items-center gap-3">
            <Icon icon="lucide:search" width={20} className="text-neutral-400" />
            <input
              type="text"
              autoFocus={isSearchOpen}
              placeholder="Search for products, collections, or articles..."
              className="flex-1 h-10 bg-transparent border-none outline-none text-sm text-neutral-900 placeholder:text-neutral-400 font-medium"
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <Icon icon="lucide:x" width={20} />
            </button>
          </div>
        </div>

        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-4 z-50">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-1 -ml-1 text-neutral-500 hover:text-black transition-colors focus:outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <Icon
              icon={isMenuOpen ? "lucide:x" : "lucide:menu"}
              width={24}
            />
          </button>
          <Link
            href="/"
            className="hover:opacity-70 transition-opacity text-xl font-medium tracking-tighter"
            onClick={() => isMenuOpen && closeMenu()}
          >
            LUMA
          </Link>
        </div>

        {/* Center Nav (Desktop) */}
        <div className="hidden lg:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

          {/* Shop Mega Dropdown */}
          <div className="nav-item group flex items-center justify-center relative h-16">
            <Link
              href="/shop"
              className="hover:text-black transition-colors text-sm font-medium text-neutral-500"
            >
              Shop
            </Link>
            <div className="nav-dropdown absolute top-full left-0 w-[500px] bg-white border border-neutral-100 rounded-xl shadow-[0_16px_40px_-12px_rgba(0,0,0,0.1)] p-6 opacity-0 invisible translate-y-2 transition-all duration-200 ease-out cursor-default z-50">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col space-y-3">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Browse
                  </span>
                  <Link
                    href="/shop"
                    className="hover:text-neutral-500 transition-colors text-sm font-medium text-neutral-900"
                  >
                    All Products
                  </Link>
                  <Link
                    href="/shop"
                    className="hover:text-neutral-500 transition-colors flex items-center justify-between text-sm font-medium text-neutral-900"
                  >
                    New Arrivals
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">
                      NEW
                    </span>
                  </Link>
                  <Link
                    href="/shop"
                    className="hover:text-neutral-500 transition-colors text-sm font-medium text-neutral-900"
                  >
                    Best Sellers
                  </Link>
                  <Link
                    href="/shop"
                    className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
                  >
                    Sale
                  </Link>
                </div>
                <div className="flex flex-col space-y-3">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Categories
                  </span>
                  <Link
                    href="/shop"
                    className="text-sm text-neutral-600 hover:text-black transition-colors flex items-center gap-2"
                  >
                    <Icon icon="lucide:sofa" width={14} /> Furniture
                  </Link>
                  <Link
                    href="/shop"
                    className="text-sm text-neutral-600 hover:text-black transition-colors flex items-center gap-2"
                  >
                    <Icon icon="lucide:lamp" width={14} /> Lighting
                  </Link>
                  <Link
                    href="/shop"
                    className="text-sm text-neutral-600 hover:text-black transition-colors flex items-center gap-2"
                  >
                    <Icon icon="lucide:flower-2" width={14} /> Accessories
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/about"
            className="hover:text-black transition-colors text-sm font-medium text-neutral-500"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="hover:text-black transition-colors text-sm font-medium text-neutral-500"
          >
            Journal
          </Link>
          <Link
            href="/contact"
            className="hover:text-black transition-colors text-sm font-medium text-neutral-500"
          >
            Contact
          </Link>

        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3 z-50">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-black transition-colors rounded-full hover:bg-neutral-100"
            aria-label="Search"
          >
            <Icon icon="lucide:search" width={20} />
          </button>
          <Link
            href="/account"
            className="flex items-center justify-center hover:text-black transition-colors hover:bg-neutral-100 text-neutral-500 w-8 h-8 rounded-full"
            aria-label="Account"
          >
            <Icon icon="lucide:user" width={20} />
          </Link>
          <button
            onClick={() => (window.location.href = "/cart")}
            className="flex hover:text-black transition-colors hover:bg-neutral-100 text-neutral-500 w-8 h-8 rounded-full relative items-center justify-center"
            aria-label="Cart"
          >
            <Icon icon="lucide:shopping-bag" width={20} />
            <span className="absolute top-1 right-0.5 w-3 h-3 bg-neutral-900 text-white text-[8px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
              2
            </span>
          </button>
        </div>
      </div>

      </nav>

      {/* Full-screen mobile menu (reference: MNADA-style overlay) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col bg-[#F9F9F9] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          {/* Row: close | logo | account + cart */}
          <div className="relative shrink-0 flex h-14 items-center justify-between px-4 sm:px-6 bg-white border-b border-neutral-200/80">
            <button
              type="button"
              onClick={closeMenu}
              className="flex h-10 w-10 items-center justify-center text-neutral-900 -ml-1"
              aria-label="Close menu"
            >
              <Icon icon="lucide:x" width={22} strokeWidth={1.75} />
            </button>
            <Link
              href="/"
              onClick={closeMenu}
              className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold tracking-tighter text-neutral-900"
            >
              LUMA
            </Link>
            <div className="flex items-center gap-1">
              <Link
                href="/account"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center text-neutral-600"
                aria-label="Account"
              >
                <Icon icon="lucide:user" width={20} strokeWidth={1.5} />
              </Link>
              <Link
                href="/cart"
                onClick={closeMenu}
                className="relative flex h-10 w-10 items-center justify-center text-neutral-600"
                aria-label="Cart"
              >
                <Icon icon="lucide:shopping-bag" width={20} strokeWidth={1.5} />
                <span className="absolute top-1.5 right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-neutral-900 px-0.5 text-[8px] font-bold text-white ring-2 ring-white">
                  2
                </span>
              </Link>
            </div>
          </div>

          {/* Link list */}
          <div className="flex-1 overflow-y-auto overscroll-contain bg-white">
            <ul className="divide-y divide-neutral-200/90">
              {MOBILE_LINKS.map(({ href, label, accent }) => (
                <li key={`${href}-${label}`}>
                  <Link
                    href={href}
                    onClick={closeMenu}
                    className={`flex items-center justify-between px-6 py-5 text-[14px] font-extrabold uppercase tracking-[0.14em] ${
                      accent ? "text-[#B5A284]" : "text-neutral-900"
                    }`}
                  >
                    <span>{label}</span>
                    <Icon
                      icon="lucide:chevron-right"
                      width={18}
                      className="text-neutral-300"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
