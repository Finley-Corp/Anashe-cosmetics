"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useCart } from "@/context/CartContext";
import { useProductsCatalog } from "@/context/ProductsCatalogContext";

export default function Navbar() {
  const { itemCount } = useCart();
  const { searchCatalog } = useProductsCatalog();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(
    () => searchCatalog(searchQuery),
    [searchCatalog, searchQuery]
  );

  useEffect(() => {
    // Scroll logic for navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Escape for search
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchActive) {
        setSearchQuery("");
        setIsSearchActive(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchActive]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  function handleToggleSearch() {
    setIsSearchActive((prev) => {
      if (prev) setSearchQuery("");
      return !prev;
    });
  }

  function closeSearchOverlay() {
    setSearchQuery("");
    setIsSearchActive(false);
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-neutral-100 transition-all duration-300 ${
        isScrolled ? "shadow-[0_4px_30px_-4px_rgba(0,0,0,0.03)]" : ""
      }`}
      id="navbar"
    >
      <div className="flex h-16 max-w-[1440px] mr-auto ml-auto pr-6 pl-6 relative items-center justify-between">
        {/* Search Bar Overlay */}
        <div
          id="search-bar-container"
          className={`absolute inset-0 bg-white z-[60] flex flex-col pt-4 pb-6 px-6 transition-all duration-300 transform overflow-y-auto ${
            isSearchActive
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2"
          }`}
        >
          <div className="max-w-[1440px] mx-auto w-full flex items-center gap-3 shrink-0">
            <Icon icon="lucide:search" width="20" className="text-neutral-400 shrink-0"></Icon>
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or pages…"
              className="flex-1 h-10 bg-transparent border-none outline-none text-sm text-neutral-900 placeholder:text-neutral-400 font-medium"
              ref={(input) => {
                if (input && isSearchActive) input.focus();
              }}
            />
            <button
              type="button"
              onClick={handleToggleSearch}
              className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500 hover:text-neutral-900 transition-colors shrink-0"
            >
              <Icon icon="lucide:x" width="20"></Icon>
            </button>
          </div>
          {searchQuery.trim().length > 0 && (
            <div className="max-w-[1440px] mx-auto w-full mt-4 border border-neutral-100 rounded-xl bg-white shadow-lg max-h-[min(50vh,320px)] overflow-y-auto">
              {searchResults.length === 0 ? (
                <p className="px-4 py-6 text-sm text-neutral-500">No matches. Try &quot;serum&quot;, &quot;concealer&quot;, or &quot;journal&quot;.</p>
              ) : (
                <ul className="py-2">
                  {searchResults.map((r) => (
                    <li key={`${r.type}-${r.href}-${r.label}`}>
                      <Link
                        href={r.href}
                        onClick={closeSearchOverlay}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-neutral-50 flex justify-between gap-4"
                      >
                        <span className="font-medium text-neutral-900">{r.label}</span>
                        <span className="text-[10px] uppercase tracking-widest text-neutral-400 shrink-0">{r.type}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Left Group: Mobile Menu & Logo */}
        <div className="flex items-center gap-4 z-50">
          <button
            onClick={toggleMenu}
            className="lg:hidden p-1 -ml-1 text-neutral-500 hover:text-black transition-colors focus:outline-none"
          >
            {isMenuOpen ? (
              <Icon icon="lucide:x" width="24" stroke-width="1.5"></Icon>
            ) : (
              <Icon icon="lucide:menu" width="24" stroke-width="1.5"></Icon>
            )}
          </button>
          <Link
            href="/"
            className="hover:opacity-70 transition-opacity text-xl font-medium tracking-tighter"
          >
            ANASHE
          </Link>
        </div>

        {/* Center Navigation (Desktop) - Absolutely Centered */}
        <div className="hidden lg:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Shop (Mega Menu) */}
          <div className="nav-item group flex items-center justify-center relative h-16">
            <Link
              href="/product-listing-page"
              className="hover:text-black transition-colors text-sm font-medium text-neutral-500"
            >
              Shop
            </Link>
            {/* Dropdown aligned left-0 */}
            <div className="nav-dropdown absolute top-full left-0 w-[500px] bg-white border border-neutral-100 rounded-xl shadow-[0_16px_40px_-12px_rgba(0,0,0,0.1)] p-6 opacity-0 invisible transform translate-y-2 transition-all duration-200 ease-out cursor-default z-50">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col space-y-3">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                    Browse
                  </span>
                  <Link
                    href="/product-listing-page"
                    className="hover:text-neutral-500 transition-colors text-sm font-medium text-neutral-900"
                  >
                    All Products
                  </Link>
                  <Link
                    href="/product-detail-page"
                    className="hover:text-neutral-500 transition-colors flex items-center justify-between text-sm font-medium text-neutral-900"
                  >
                    New Arrivals
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">
                      NEW
                    </span>
                  </Link>
                  <Link
                    href="#"
                    className="hover:text-neutral-500 transition-colors text-sm font-medium text-neutral-900"
                  >
                    Best Sellers
                  </Link>
                  <Link
                    href="#"
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
                    href="#"
                    className="text-sm text-neutral-600 hover:text-black transition-colors flex items-center gap-2"
                  >
                    <Icon icon="lucide:droplets" width="14"></Icon> Skincare
                  </Link>
                  <Link
                    href="#"
                    className="text-sm text-neutral-600 hover:text-black transition-colors flex items-center gap-2"
                  >
                    <Icon icon="lucide:sparkles" width="14"></Icon> Makeup
                  </Link>
                  <Link
                    href="#"
                    className="text-sm text-neutral-600 hover:text-black transition-colors flex items-center gap-2"
                  >
                    <Icon icon="lucide:flower-2" width="14"></Icon> Body care
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/about-us"
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
            href="/contact-us"
            className="hover:text-black transition-colors text-sm font-medium text-neutral-500"
          >
            Contact
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3 z-50">
          <button
            type="button"
            onClick={handleToggleSearch}
            className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-black transition-colors rounded-full hover:bg-neutral-100"
            aria-label="Search"
          >
            <Icon icon="lucide:search" width="20" stroke-width="1.5"></Icon>
          </button>

          <Link
            href="/account-dashboard"
            className="flex items-center justify-center hover:text-black transition-colors hover:bg-neutral-100 text-neutral-500 w-8 h-8 rounded-full"
            aria-label="Account"
          >
            <Icon icon="lucide:user" width="20" stroke-width="1.5"></Icon>
          </Link>

          <Link
            href="/cart"
            className="flex hover:text-black transition-colors hover:bg-neutral-100 text-neutral-500 w-8 h-8 rounded-full relative items-center justify-center"
            aria-label="Cart"
            role="button"
          >
            <Icon icon="lucide:shopping-bag" width="20" stroke-width="1.5"></Icon>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 px-0.5 bg-neutral-900 text-white text-[8px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu (Full Width) */}
      <div
        id="mobile-menu"
        className={`absolute top-16 left-0 w-full bg-white border-b border-neutral-100 px-6 py-8 lg:hidden shadow-xl h-[calc(100vh-64px)] overflow-y-auto ${
          isMenuOpen ? "open" : ""
        }`}
      >
        <div className="flex flex-col space-y-6 max-w-[1440px] mx-auto">
          <div className="space-y-3">
            <Link
              href="/product-listing-page"
              onClick={closeMenu}
              className="text-2xl font-medium text-neutral-900 block tracking-tight"
            >
              Shop
            </Link>
            <div className="pl-4 space-y-3 border-l-2 border-neutral-100">
              <Link href="#" className="block text-sm text-neutral-500">
                New Arrivals
              </Link>
              <Link href="#" className="block text-sm text-neutral-500">
                Categories
              </Link>
              <Link href="#" className="block text-sm text-red-500">
                Sale
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <Link
              href="#"
              onClick={closeMenu}
              className="text-2xl font-medium text-neutral-900 block tracking-tight"
            >
              Collections
            </Link>
            <div className="pl-4 space-y-3 border-l-2 border-neutral-100">
              <Link href="#" className="block text-sm text-neutral-500">
                Seasonal
              </Link>
              <Link href="#" className="block text-sm text-neutral-500">
                Gift sets
              </Link>
            </div>
          </div>
          <Link
            href="/about-us"
            onClick={closeMenu}
            className="text-2xl font-medium text-neutral-900 block tracking-tight"
          >
            About
          </Link>
          <Link
            href="/blog"
            onClick={closeMenu}
            className="text-2xl font-medium text-neutral-900 block tracking-tight"
          >
            Journal
          </Link>
          <Link
            href="/contact-us"
            onClick={closeMenu}
            className="text-2xl font-medium text-neutral-900 block tracking-tight"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
