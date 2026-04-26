'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export type Gallery4Item = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
};

export type Gallery4Props = {
  title: string;
  description: string;
  items: Gallery4Item[];
};

export function Gallery4({ title, description, items }: Gallery4Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1200) {
        setVisibleCards(2);
      } else {
        setVisibleCards(4);
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  const maxIndex = useMemo(
    () => Math.max(0, items.length - visibleCards),
    [items.length, visibleCards]
  );

  useEffect(() => {
    if (activeIndex > maxIndex) {
      setActiveIndex(maxIndex);
    }
  }, [activeIndex, maxIndex]);

  const dots = useMemo(() => Array.from({ length: maxIndex + 1 }, (_, i) => i), [maxIndex]);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-5xl">{title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous services"
            onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeIndex === 0}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next services"
            onClick={() => setActiveIndex((prev) => Math.min(maxIndex, prev + 1))}
            disabled={activeIndex >= maxIndex}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(calc(-${activeIndex} * ((100% - ${(visibleCards - 1) * 16}px) / ${visibleCards} + 16px)))`,
          }}
        >
        {items.map((item) => (
            <article
              key={item.id}
              className="group relative min-w-0 overflow-hidden rounded-2xl"
              style={{ flex: `0 0 calc((100% - ${(visibleCards - 1) * 16}px) / ${visibleCards})` }}
            >
            <div className="relative h-[360px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h3 className="!text-white text-xl sm:text-2xl font-semibold leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                {item.title}
              </h3>
              <p className="mt-3 line-clamp-2 !text-white text-sm leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {item.description}
              </p>
            </div>
          </article>
        ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {dots.map((dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            onClick={() => setActiveIndex(dotIndex)}
            aria-label={`Go to slide ${dotIndex + 1}`}
            className={`h-2.5 rounded-full transition-all ${dotIndex === activeIndex ? 'w-6 bg-neutral-700' : 'w-2.5 bg-neutral-300'}`}
          />
        ))}
      </div>
    </section>
  );
}
