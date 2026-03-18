"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

export function Hero() {
  return (
    <div className="z-10 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-8 items-end pt-10 md:pt-16 lg:pt-20">
          <AnimatedSection className="lg:col-span-7" delay={0.1}>
            <p className="uppercase text-xs tracking-[0.18em] text-white/60 font-sans">The Future of Bio-Fermentation</p>
            <h1 className="sm:text-5xl lg:text-7xl leading-[1.05] text-4xl mt-4 font-bricolage font-semibold tracking-tighter">
              Unlock the secret to ageless luminosity.
            </h1>
            <p className="sm:text-lg text-base text-white/80 max-w-2xl mt-5 font-sans">
              ANASHE fuses rare botanicals with clinical precision to restore your skin&apos;s natural radiance. Experience the ritual of transformation.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="#" className="inline-flex items-center justify-center rounded-2xl bg-white text-neutral-900 px-5 py-3 text-sm font-medium shadow-sm hover:bg-white/90 transition font-sans">
                Shop the Collection
              </Link>
              <Link 
                href="#" 
                className="inline-flex items-center justify-center gap-2 border-gradient before:rounded-2xl hover:text-white transition text-sm font-medium text-white/90 bg-white/5 rounded-2xl pt-3 pr-5 pb-3 pl-5"
                style={{ backdropFilter: "blur(4px) saturate(1.25)" }}
              >
                <div className="rounded-full border border-current p-0.5">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                The Ritual Film
              </Link>
            </div>

            <p className="mt-4 text-sm text-white/50 font-sans">Cruelty-Free — Vegan — Dermatologist Tested</p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm">
              <div className="inline-flex items-center gap-2 text-white/90">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="h-4 w-4 text-white"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="m12 22l-4.706-5.835a7.502 7.502 0 0 1 1.83-10.978l1.018-.679a2.5 2.5 0 0 1 3.716 0l1.018.68a7.502 7.502 0 0 1 1.83 10.977z"></path></svg>
                <span className="font-sans"><span className="font-semibold font-sans">50,000+</span> glowing reviews</span>
              </div>
              <div className="hidden sm:inline-flex h-4 w-px bg-white/15"></div>
              <div className="inline-flex items-center gap-2 text-white/90">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="h-4 w-4"><path fill="none" stroke="currentColor" strokeWidth="1.5" d="M14.272 10.445L18 2m-8.68 8.968L6 2m11.161 18.252a1.272 1.272 0 0 1-1.258.948H8.097a1.272 1.272 0 0 1-1.258-.948l-1.63-6.52a2 2 0 0 1 1.941-2.485h9.699a2 2 0 0 1 1.942 2.485z"></path></svg>
                <span className="font-sans">Rated <span className="font-semibold font-sans">4.9</span>/5 stars</span>
              </div>
              <div className="hidden sm:inline-flex h-4 w-px bg-white/15"></div>
              <div className="inline-flex items-center gap-2 text-white/90">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="h-4 w-4"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M12 12c4 4 2 10 2 10s-3-2-5-5s2-9 2-9s1 1 1 4"></path></svg>
                <span className="font-sans">100% Clean Ingredients</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Right badge */}
          <AnimatedSection className="lg:col-span-5 lg:pl-8" delay={0.3}>
            <div 
              className="border-gradient before:rounded-3xl sm:p-5 bg-white/5 max-w-sm rounded-3xl ml-auto pt-4 pr-4 pb-4 pl-4 backdrop-blur-lg"
              style={{ backdropFilter: "blur(4px) saturate(1.25)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60 font-sans">Best Seller</p>
                  <p className="mt-1 text-sm text-white/90 font-sans">Night Repair Complex</p>
                </div>
                <div className="flex -space-x-2">
                  <span className="w-8 h-8 bg-[url('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop')] bg-cover bg-center ring-white/10 ring-2 rounded-full"></span>
                  <span className="w-8 h-8 bg-amber-400/90 bg-[url('https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=100&h=100&fit=crop')] bg-cover bg-center ring-white/10 ring-2 rounded-full"></span>
                  <span className="w-8 h-8 bg-cyan-400/90 bg-[url('https://images.unsplash.com/photo-1556228720-198759498bd4?w=100&h=100&fit=crop')] bg-cover bg-center ring-white/10 ring-2 rounded-full"></span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Testimonial card */}
        <AnimatedSection className="mt-12 sm:mt-16 max-w-md" delay={0.5}>
          <div className="border-gradient before:rounded-3xl bg-white/5 rounded-3xl pt-5 pr-5 pb-5 pl-5 backdrop-blur-xl">
            <p className="text-sm text-white/85 font-sans">
              "I've tried every luxury brand, but anashe is the only one that actually changed my skin texture. It's not just skincare, it's a daily moment of peace."
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Portrait of Sarah" className="h-9 w-9 rounded-full object-cover ring-1 ring-white/20" />
                <div>
                  <p className="text-sm font-medium font-sans">Sarah Jenkins</p>
                  <p className="text-xs text-white/60 font-sans">Beauty Editor</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/30"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/30"></span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Scroll hint */}
        <div className="mt-10 sm:mt-14 pb-10">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="h-4 w-4"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="m12 16l4-4m-4 4l-4-4m4 4V8"></path></svg>
            <span className="font-sans">Scroll to explore</span>
          </div>
        </div>
      </div>
    </div>
  );
}
