import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

const FEATURES = [
  "Ethically sourced materials",
  "Carbon neutral shipping",
  "Artisan craftsmanship",
];

export default function Collections() {
  return (
    <section
      className="w-full grid lg:grid-cols-2 min-h-[600px] border-b border-neutral-100 scroll-mt-20"
      id="collections"
    >
      <div className="relative bg-neutral-100 h-96 lg:h-auto overflow-hidden group">
        <Image
          src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1992&auto=format&fit=crop"
          alt="Craftsmanship"
          fill
          className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col justify-center px-6 py-20 lg:px-24 bg-white">
        <div className="reveal max-w-lg">
          <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase mb-4 block">
            Our Philosophy
          </span>
          <h2 className="text-3xl lg:text-4xl font-medium tracking-tighter mb-6 leading-tight">
            Designed to endure,
            <br />
            crafted to inspire.
          </h2>
          <p className="text-neutral-500 leading-relaxed mb-8 text-sm">
            We believe in fewer, better things. Each piece in our collection is
            thoughtfully designed with sustainability and longevity in mind,
            using materials that age gracefully over time.
          </p>

          <ul className="space-y-4 mb-10">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 text-sm font-medium text-neutral-800"
              >
                <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
                  <Icon icon="lucide:check" width={12} />
                </div>
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/about"
            className="inline-flex items-center text-sm font-semibold border border-neutral-200 px-6 py-3.5 rounded hover:bg-neutral-50 transition-colors"
          >
            Read our story
          </Link>
        </div>
      </div>
    </section>
  );
}
