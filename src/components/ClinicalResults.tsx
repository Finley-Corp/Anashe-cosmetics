"use client";

import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "./AnimatedSection";

export function ClinicalResults() {
  return (
    <section className="pt-16 pb-16 sm:py-24 mx-auto max-w-7xl px-6 lg:px-10">
      <AnimatedSection className="mb-12" delay={0.1}>
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="flex items-center justify-between text-[13px] sm:text-sm font-medium uppercase tracking-tight text-white">
              <span className="font-sans">PROOF</span>
              <span className="font-sans">(04)</span>
            </div>
            <div className="mt-2 h-px w-full bg-white/20"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-center">
            <div className="lg:col-span-7">
              <h3 className="text-[32px] sm:text-[48px] lg:text-[64px] xl:text-[80px] leading-[0.9] font-semibold text-white tracking-tighter font-bricolage">Clinical Results.</h3>
            </div>

            <div className="lg:col-span-5">
              <p className="sm:text-lg text-white/60 max-w-3xl mb-6 font-sans">Our formulas are rigorously tested to ensure efficacy. See the visible difference in texture, tone, and hydration.</p>
              <div className="flex justify-start">
                <Link href="#" className="inline-flex items-center gap-3 border-gradient before:rounded-full hover:shadow-2xl transition bg-white/5 rounded-full pt-2 pr-2 pb-2 pl-2 shadow" style={{ backdropFilter: "blur(4px) saturate(1.25)" }}>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white">
                    <ArrowRight className="w-5 h-5 text-neutral-900" />
                  </span>
                  <span className="px-3 text-sm font-medium text-white font-sans">See Before &amp; After</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-3 gap-0 rounded-3xl overflow-hidden shadow-sm border-gradient before:rounded-3xl" 
        style={{ backdropFilter: "blur(4px) saturate(1.25)" }}
        delay={0.3}
      >
        <div className="relative overflow-hidden text-white bg-black pt-6 pr-6 pb-6 pl-6">
          <div className="flex gap-2 mb-4 items-center">
             <div className="inline-flex items-center justify-center h-8 w-8 rounded-2xl bg-white/10 ring-1 ring-white/20 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="h-4 w-4 text-white"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="m11.132 3.65l-1.353 4.258a1.27 1.27 0 0 1-1.213.895H4.258a1.27 1.27 0 0 0-.75 2.29l3.352 2.48a1.27 1.27 0 0 1 .465 1.446l-1.282 4.043a1.27 1.27 0 0 0 1.956 1.42l3.419-2.527a1.27 1.27 0 0 1 1.564 0l3.42 2.527a1.27 1.27 0 0 0 1.956-1.42l-1.282-4.043a1.27 1.27 0 0 1 .465-1.447l3.351-2.479a1.27 1.27 0 0 0-.75-2.29h-4.307a1.27 1.27 0 0 1-1.214-.895l-1.353-4.258a1.27 1.27 0 0 0-2.427 0"></path></svg>
             </div>
          </div>
          <div className="flex items-center gap-1 mb-4 text-white">
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
          </div>
          <p className="text-base leading-relaxed mb-6 font-sans">&quot;The hydration is instant. I woke up looking like I had a facial. It&apos;s truly magic in a bottle.&quot;</p>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium font-sans">Sophie T.</div>
              <div className="text-xs mt-1 text-white/70 font-sans">Model, London</div>
            </div>
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop" alt="Sophie" className="w-8 h-8 object-cover rounded-full" />
          </div>
        </div>

        <div className="relative overflow-hidden text-black bg-white pt-6 pr-6 pb-6 pl-6">
          <div className="flex items-center gap-3 mb-4">
            <img src="https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=64&h=64&fit=crop" alt="Michelle" className="w-6 h-6 object-cover rounded-full" />
            <div>
              <div className="text-sm font-medium font-sans">Michelle B.</div>
              <div className="text-xs text-black/70 font-sans">Dermatologist</div>
            </div>
          </div>
          <div className="flex gap-1 text-black mb-4 items-center">
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
          </div>
          <p className="leading-relaxed relative z-10 text-base font-sans">&quot;I recommend anashe to all my clients. The ingredient deck is impeccable—clean, effective, and safe for sensitive skin types.&quot;</p>
        </div>

        <div className="relative overflow-hidden text-white bg-black pt-6 pr-6 pb-6 pl-6">
          <div className="flex items-center gap-2 mb-4">
             <div className="inline-flex items-center justify-center h-8 w-8 rounded-2xl bg-white/10 ring-1 ring-white/20 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="h-4 w-4 text-white"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="m11.132 3.65l-1.353 4.258a1.27 1.27 0 0 1-1.213.895H4.258a1.27 1.27 0 0 0-.75 2.29l3.352 2.48a1.27 1.27 0 0 1 .465 1.446l-1.282 4.043a1.27 1.27 0 0 0 1.956 1.42l3.419-2.527a1.27 1.27 0 0 1 1.564 0l3.42 2.527a1.27 1.27 0 0 0 1.956-1.42l-1.282-4.043a1.27 1.27 0 0 1 .465-1.447l3.351-2.479a1.27 1.27 0 0 0-.75-2.29h-4.307a1.27 1.27 0 0 1-1.214-.895l-1.353-4.258a1.27 1.27 0 0 0-2.427 0"></path></svg>
             </div>
          </div>
          <div className="flex items-center gap-1 mb-4 text-white">
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
          </div>
          <p className="text-base leading-relaxed mb-6 font-sans">&quot;The packaging is gorgeous, but the formula inside is what keeps me coming back. My pigmentation has faded significantly.&quot;</p>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium font-sans">Amara K.</div>
              <div className="text-xs mt-1 text-white/70 font-sans">Artist, NYC</div>
            </div>
            <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=64&h=64&fit=crop" alt="Amara" className="w-8 h-8 object-cover rounded-full" />
          </div>
        </div>

        <div className="lg:col-span-3 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
            <div className="text-white bg-black border-white/10 border-b sm:border-b-0 sm:border-r pt-6 pr-6 pb-6 pl-6">
              <div className="text-3xl sm:text-4xl mb-2 font-bricolage font-semibold tracking-tighter">14 Days</div>
              <div className="text-xs text-white/70 font-sans">To visible improvement in skin texture</div>
            </div>
            <div className="p-6 border-b sm:border-b-0 sm:border-r bg-black text-white border-white/10">
              <div className="text-3xl sm:text-4xl mb-2 font-bricolage font-semibold tracking-tighter">98%</div>
              <div className="text-xs text-white/70 font-sans">Users agreed their skin felt hydrated</div>
            </div>
            <div className="p-6 bg-black text-white">
              <div className="text-3xl sm:text-4xl mb-2 font-bricolage font-semibold tracking-tighter">0%</div>
              <div className="text-xs text-white/70 font-sans">Synthetic fragrances or parabens</div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
