"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { Quote, Star } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

export function Testimonials() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions: ISourceOptions = {
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
      },
      modes: {
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: "#ffffff" },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "out" },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: { enable: true },
        value: 60,
      },
      opacity: { value: 0.3 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 2 } },
    },
    detectRetina: true,
  };

  return (
    <section className="sm:py-24 bg-center bg-[url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=3870&auto=format&fit=crop')] bg-cover mt-20 mb-20 pt-16 pb-16 relative w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-neutral-950/40"></div>
        {init && (
          <Particles
            id="tsparticles"
            options={particlesOptions}
            className="w-full h-full"
          />
        )}
      </div>

      <AnimatedSection className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10" delay={0.1}>
        <div className="mb-12 text-center">
          <p className="text-xs uppercase text-neutral-300 tracking-widest mb-2 font-sans">Real Results</p>
          <h2 className="text-3xl sm:text-4xl text-white font-bricolage font-semibold tracking-tighter">Community Love</h2>
        </div>

        <div className="relative flex items-center justify-center py-12 sm:py-20 overflow-x-auto" style={{ minHeight: "450px" }}>
          <div className="container max-w-full flex justify-center items-center gap-6 px-4">
            
            {/* Card 1 */}
            <div className="border-gradient before:rounded-3xl flex-shrink-0 w-[340px] h-[340px] rounded-3xl relative backdrop-blur" 
              style={{ background: "linear-gradient(rgba(255, 255, 255, 0.1), transparent)", boxShadow: "rgba(0, 0, 0, 0.1) 0px 25px 25px", transform: "rotate(-10deg)", backdropFilter: "blur(4px) saturate(1.25)" } as React.CSSProperties}
            >
              <div className="absolute inset-4 rounded-3xl bg-white text-neutral-900 shadow-2xl ring-1 ring-neutral-200 overflow-hidden">
                <div className="p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-2xl bg-neutral-100 ring-1 ring-neutral-200 mb-4">
                      <Quote className="h-4 w-4 text-neutral-700" />
                    </div>
                    <p className="text-sm leading-relaxed text-neutral-900 mb-4 font-sans">&quot;My sensitive skin has finally met its match. The calming serum reduced my redness in just three days. Absolutely in love.&quot;</p>
                  </div>
                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" alt="Jessica" className="h-6 w-6 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-medium text-neutral-900 font-sans">Jessica M.</div>
                        <div className="text-xs text-neutral-500 font-sans">Verified Buyer</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                       <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-medium font-sans text-neutral-900">5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="border-gradient before:rounded-3xl flex-shrink-0 w-[340px] h-[340px] rounded-3xl relative backdrop-blur z-10" 
             style={{ background: "linear-gradient(rgba(255, 255, 255, 0.08), transparent)", boxShadow: "rgba(0, 0, 0, 0.1) 0px 25px 25px", transform: "rotate(-2deg)", backdropFilter: "blur(4px) saturate(1.25)" } as React.CSSProperties}
            >
              <div className="absolute inset-4 rounded-3xl bg-white/90 text-neutral-900 shadow-xl ring-1 ring-neutral-200 overflow-hidden" style={{ backdropFilter: "blur(4px)" }}>
                <div className="p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-2xl bg-neutral-100 ring-1 ring-neutral-200 mb-4">
                      <Quote className="h-4 w-4 text-neutral-700" />
                    </div>
                    <p className="text-sm leading-relaxed text-neutral-900 mb-4 font-sans">&quot;The glow is real. I stopped wearing foundation after using the Vitamin C elixir for two weeks. It feels luxurious and smells divine.&quot;</p>
                  </div>
                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop" alt="David" className="h-6 w-6 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-medium text-neutral-900 font-sans">David K.</div>
                        <div className="text-xs text-neutral-500 font-sans">Verified Buyer</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-medium font-sans text-neutral-900">5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border-gradient before:rounded-3xl flex-shrink-0 w-[340px] h-[340px] rounded-3xl relative backdrop-blur" 
             style={{ background: "linear-gradient(rgba(255, 255, 255, 0.06), transparent)", boxShadow: "rgba(0, 0, 0, 0.1) 0px 25px 25px", transform: "rotate(6deg)", backdropFilter: "blur(4px) saturate(1.25)" } as React.CSSProperties}
            >
              <div className="absolute inset-4 rounded-3xl bg-white/80 text-neutral-900 shadow-lg ring-1 ring-neutral-200 overflow-hidden" style={{ backdropFilter: "blur(4px)" }}>
                <div className="p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-2xl bg-neutral-100 ring-1 ring-neutral-200 mb-4">
                      <Quote className="h-4 w-4 text-neutral-700" />
                    </div>
                    <p className="text-sm leading-relaxed text-neutral-900 mb-4 font-sans">&quot;Finally, skincare that respects the microbiome. My skin barrier has never been stronger. anashe is a staple.&quot;</p>
                  </div>
                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop" alt="Elena" className="h-6 w-6 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-medium text-neutral-900 font-sans">Elena R.</div>
                        <div className="text-xs text-neutral-500 font-sans">Verified Buyer</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-medium font-sans text-neutral-900">5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
