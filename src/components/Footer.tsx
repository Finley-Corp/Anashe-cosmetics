"use client";

import Link from "next/link";
import { MoveRight, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="z-10 bg-[url('https://images.unsplash.com/photo-1614859324967-bdaa65817084?w=3000&auto=format&fit=crop')] bg-cover bg-center border-white/10 border-t mt-20 relative animate-on-scroll animate">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
        <div className="overflow-hidden border-gradient before:rounded-3xl rounded-3xl relative" style={{ backdropFilter: "blur(4px) saturate(1.25)" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10"></div>

          <div className="sm:px-10 lg:px-14 lg:py-16 pt-12 pr-6 pb-12 pl-6 relative backdrop-blur-lg">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
              <div className="max-w-md">
                <Link href="#" className="inline-flex items-center">
                  <span className="text-2xl font-bricolage font-semibold tracking-tighter text-white">ANASHE</span>
                </Link>
                <p className="mt-4 text-sm text-slate-300 leading-relaxed font-sans">Join the inner circle for exclusive access to new formulations, expert skin advice, and community events.</p>

                <form className="mt-6 flex items-center gap-2">
                  <div className="flex-1">
                    <label htmlFor="footer-email" className="sr-only font-sans">Email</label>
                    <input id="footer-email" type="email" required placeholder="Enter your email" className="w-full rounded-2xl bg-white/5 text-white placeholder-slate-400 px-4 py-3 text-sm border-gradient before:rounded-2xl focus:ring-2 focus:ring-lime-400/30 outline-none" style={{ backdropFilter: "blur(4px) saturate(1.25)" }} />
                  </div>
                  <button type="submit" className="inline-flex items-center justify-center gap-2 border-gradient before:rounded-2xl hover:text-white transition text-sm font-medium text-white/90 bg-white/5 rounded-2xl pt-3 pr-5 pb-3 pl-5" style={{ backdropFilter: "blur(4px) saturate(1.25)" }}>
                    Join
                  </button>
                </form>
                <p className="mt-2 text-xs text-slate-400 font-sans">10% off your first order.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full lg:w-auto">
                <div>
                  <p className="text-sm font-medium text-slate-200 tracking-tight font-sans">Shop</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-400">
                    <li><Link href="/shop" className="hover:text-white transition font-sans">All Products</Link></li>
                    <li><Link href="/shop" className="hover:text-white transition font-sans">Best Sellers</Link></li>
                    <li><Link href="/shop" className="hover:text-white transition font-sans">Sets &amp; Kits</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200 tracking-tight font-sans">Company</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-400">
                    <li><Link href="/about" className="hover:text-white transition font-sans">Our Story</Link></li>
                    <li><Link href="#" className="hover:text-white transition font-sans">Ingredients</Link></li>
                    <li><Link href="#" className="hover:text-white transition font-sans">Sustainability</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200 tracking-tight font-sans">Support</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-400">
                    <li><Link href="#" className="hover:text-white transition font-sans">Shipping</Link></li>
                    <li><Link href="#" className="hover:text-white transition font-sans">Returns</Link></li>
                    <li><Link href="#" className="hover:text-white transition font-sans">FAQ</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 font-sans">© 2026 anashe Beauty. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <Link href="#" className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 border-gradient before:rounded-2xl hover:bg-white/10 transition" style={{ backdropFilter: "blur(4px) saturate(1.25)" }}>
                  <Facebook className="h-4 w-4 text-slate-300" />
                </Link>
                <Link href="#" className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 border-gradient before:rounded-2xl hover:bg-white/10 transition" style={{ backdropFilter: "blur(4px) saturate(1.25)" }}>
                  <Instagram className="h-4 w-4 text-slate-300" />
                </Link>
                <Link href="#" className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 border-gradient before:rounded-2xl hover:bg-white/10 transition" style={{ backdropFilter: "blur(4px) saturate(1.25)" }}>
                  <Twitter className="h-4 w-4 text-slate-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
