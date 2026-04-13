"use client";

import { useEffect } from "react";
import Link from "next/link";

const BLIND_IMAGE = "/images/hero-image.jpg";

const BG_IMAGE =
  "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4024eb96-6b8f-4f13-99f1-f1889425c4e5_3840w.jpg?w=800&q=80";

// Panel config matches the reference exactly
const PANELS = [
  { wPct: "18%", hPct: "80%", ty: "-translate-y-4", z: "z-10", shadow: "shadow-lg",   pos: "0%" },
  { wPct: "22%", hPct: "95%", ty: "translate-y-1",  z: "z-20", shadow: "shadow-xl",   pos: "25%" },
  { wPct: "28%", hPct: "110%",ty: "-translate-y-2", z: "z-30", shadow: "shadow-2xl",  pos: "50%" },
  { wPct: "22%", hPct: "95%", ty: "translate-y-1",  z: "z-20", shadow: "shadow-xl",   pos: "75%" },
  { wPct: "18%", hPct: "80%", ty: "-translate-y-4", z: "z-10", shadow: "shadow-lg",   pos: "100%" },
];

export default function Hero() {
  /* Cinematic parallax — mirrors the original JS exactly */
  useEffect(() => {
    const blinds = document.querySelectorAll<HTMLElement>(".js-hero-blind");
    let lastScroll = 0;
    let ticking = false;

    const doParallax = (scrollPos: number) => {
      if (scrollPos < 1200) {
        blinds.forEach((blind, index) => {
          const distanceFromCenter = Math.abs(2 - index);
          const yRaw = scrollPos * (0.028 + distanceFromCenter * 0.02);
          const yClamped = Math.max(-60, Math.min(yRaw, 60));
          // Shift background-position-y instead of translating the element
          // so the image always fills the panel (no dark gaps)
          const yPct = 50 - yClamped * 0.04;
          const currentPos = (blind as HTMLElement).style.backgroundPosition;
          const xPart = currentPos.split(" ")[0] || "50%";
          (blind as HTMLElement).style.backgroundPosition = `${xPart} ${yPct}%`;
        });
      }
    };

    const onScroll = () => {
      lastScroll = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          doParallax(lastScroll);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    doParallax(window.scrollY);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative w-full pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-[#ebedea]">
      {/* Full-width greyscale background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BG_IMAGE}
          className="w-full h-full object-cover grayscale opacity-100 scale-[1.06]"
          alt=""
        />
        {/* Lighten overlay */}
        <div className="absolute inset-0 bg-[#ebedea]/55" />
        {/* Side vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ebedea]/70 via-transparent to-[#ebedea]/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-x-12 gap-y-12 items-center">

          {/* ── LEFT: copy ── */}
          <div className="w-full lg:w-[45%] flex flex-col items-end order-2 lg:order-1 text-right relative py-16">
            <h1 className="relative flex flex-col items-end w-full">
              {/* REVEAL */}
              <span
                className="font-display uppercase font-semibold tracking-tighter leading-[0.85] text-[#2d322f]
                           text-[5.25rem] md:text-[7.25rem] lg:text-[9.5rem]
                           [animation:animationIn_1.2s_ease-out_0.2s_both]"
              >
                REVEAL
              </span>

              {/* RADIANCE */}
              <span
                className="font-display uppercase font-semibold tracking-tighter leading-[0.85] text-[#2d322f]
                           text-[5.75rem] md:text-[7.75rem] lg:text-[10.5rem]
                           [animation:animationIn_1.2s_ease-out_0.4s_both]"
              >
                RADIANCE
              </span>

              {/* YOUR badge — sits on the seam between the two words */}
              <span
                className="pointer-events-none absolute -right-2 top-1/2 -translate-y-[55%]
                           border border-[#2d322f]/45 bg-[#3F556B]
                           px-2 py-1 text-[11px] md:text-xs font-semibold uppercase text-white tracking-[0.35em]
                           [animation:animationIn_0.8s_ease-out_0.8s_both]"
              >
                YOUR
              </span>
            </h1>

            <p
              className="font-accent italic text-lg md:text-xl text-[#3F556B]
                         mt-10 mb-4 pr-2 [animation:animationIn_0.8s_ease-out_1s_both]"
            >
              Skin that speaks before you do.
            </p>

            <Link
              href="/shop"
              className="bg-[#2d322f] text-white px-10 py-4 text-xs font-semibold uppercase tracking-widest
                         hover:bg-[#3F556B] transition-colors duration-300
                         mt-12 mr-2 [animation:animationIn_0.8s_ease-out_1.2s_both]"
            >
              Explore the Collection
            </Link>
          </div>

          {/* ── RIGHT: venetian-blind panels ── */}
          <div
            className="w-full lg:w-[115%] lg:translate-x-[3%]
                        h-[500px] lg:h-[750px]
                        flex items-center gap-1 lg:gap-1.5
                        overflow-visible relative group
                        order-1 lg:order-2"
          >
            {PANELS.map((panel, i) => (
              <div
                key={i}
                className={`
                  relative overflow-hidden bg-[#1e2420] ${panel.shadow} ${panel.z} ${panel.ty} rounded-[1px]
                `}
                style={{ width: panel.wPct, height: panel.hPct }}
              >
                <div
                  className="absolute inset-0 js-hero-blind will-change-transform"
                  style={{
                    backgroundImage: `url('${BLIND_IMAGE}')`,
                    backgroundSize: "cover",
                    backgroundPosition: `${panel.pos} center`,
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
