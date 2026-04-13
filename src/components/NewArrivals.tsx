import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function NewArrivals() {
  return (
    <section className="w-full py-20 lg:py-32 scroll-mt-20" id="new">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex justify-between items-end mb-10 reveal">
          <h2 className="text-3xl lg:text-4xl font-medium tracking-tighter">
            New Arrivals
          </h2>
          <Link
            href="/shop"
            className="text-sm font-medium text-neutral-500 hover:text-black transition-colors flex items-center gap-1 group pb-1 border-b border-transparent hover:border-black"
          >
            Browse All
            <Icon
              icon="lucide:arrow-up-right"
              width={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
          {/* Large Item */}
          <div className="h-96 md:h-auto md:col-span-2 relative group overflow-hidden rounded-xl bg-neutral-100 reveal cursor-pointer">
            <Image
              src="/images/black-woman-4.jpg"
              alt="Lighting Collection"
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
            />
            <Image
              src="/images/black-woman.jpg"
              alt="Lighting Collection alternate"
              fill
              className="object-cover transition-transform duration-700 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 transition-opacity duration-500" />
            <div className="absolute bottom-8 left-8 text-white z-10">
              <span className="text-xs font-bold uppercase tracking-wider mb-2 block opacity-80">
                Ritual 01
              </span>
              <h3 className="text-3xl font-medium tracking-tight mb-2">
                Vitamin C Glow
              </h3>
              <p className="text-white/80 text-sm max-w-sm">
                Brightening essentials for a radiant, even-toned complexion.
              </p>
            </div>
            <button className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl z-20 text-neutral-900">
              <Icon icon="lucide:arrow-right" width={20} />
            </button>
          </div>

          {/* Stacked Items */}
          <div className="grid grid-rows-2 gap-6 h-96 md:h-auto">
            <div className="relative group overflow-hidden rounded-xl bg-neutral-100 reveal delay-100 cursor-pointer">
              <Image
                src="/images/black-woman-2.jpg"
                alt="Ceramics"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 text-white z-10">
                <h3 className="text-xl font-medium tracking-tight">Hydration</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-xl bg-neutral-100 reveal delay-200 cursor-pointer">
              <Image
                src="/images/black-woman-3.jpg"
                alt="Seating"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 text-white z-10">
                <h3 className="text-xl font-medium tracking-tight">Acne Care</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
