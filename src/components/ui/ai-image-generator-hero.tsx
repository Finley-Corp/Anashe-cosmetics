'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type ImageCard = {
  id: string;
  src: string;
  alt: string;
  rotation: number;
};

type ImageCarouselHeroProps = {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  onCtaClick?: () => void;
  images: ImageCard[];
  features?: Array<{
    title: string;
    description: string;
  }>;
};

export function ImageCarouselHero({
  title,
  subtitle,
  description,
  ctaText,
  onCtaClick,
  images,
  features = [
    {
      title: 'Realistic Results',
      description: 'Realistic Results Photos that look professionally crafted',
    },
    {
      title: 'Fast Generation',
      description: 'Turn ideas into images in seconds.',
    },
    {
      title: 'Diverse Styles',
      description: 'Choose from a wide range of artistic options.',
    },
  ],
}: ImageCarouselHeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotatingCards, setRotatingCards] = useState<number[]>([]);

  useEffect(() => {
    setRotatingCards(images.map((_, i) => i * (360 / Math.max(images.length, 1))));
  }, [images.length]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRotatingCards((prev) => prev.map((value) => (value + 0.5) % 360));
    }, 50);

    return () => window.clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <section className="relative w-full overflow-hidden border-b border-neutral-200 bg-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-[var(--primary)]/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-gradient-to-tr from-[var(--primary)]/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-[1400px] flex-col items-center justify-center px-4 py-14 sm:px-6 md:px-8 lg:py-16">
        <div
          className="relative mb-12 h-96 w-full max-w-6xl sm:mb-16 sm:h-[500px]"
          onMouseMove={handleMouseMove}
          style={{ perspective: '1000px' }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {images.map((image, index) => {
              const angle = (rotatingCards[index] ?? 0) * (Math.PI / 180);
              const radius = 180;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const perspectiveX = (mousePosition.x - 0.5) * 20;
              const perspectiveY = (mousePosition.y - 0.5) * 20;

              return (
                <div
                  key={image.id}
                  className="absolute h-40 w-32 transition-all duration-300 sm:h-48 sm:w-40"
                  style={{
                    transform: `
                      translate(${x}px, ${y}px)
                      rotateX(${perspectiveY}deg)
                      rotateY(${perspectiveX}deg)
                      rotateZ(${image.rotation}deg)
                    `,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div
                    className={cn(
                      'group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl shadow-2xl transition-all duration-300',
                      'hover:scale-110 hover:shadow-[0_24px_45px_-18px_rgba(0,0,0,0.45)]'
                    )}
                  >
                    <Image
                      src={image.src || '/placeholder.svg'}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-20 mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
            {subtitle}
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-neutral-900 sm:text-5xl lg:text-6xl font-[family-name:var(--font-display)]">
            {title}
          </h1>
          <p className="mt-5 text-lg text-neutral-600 sm:text-xl">{description}</p>
          <button
            type="button"
            onClick={onCtaClick}
            className={cn(
              'group mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-8 py-3 font-medium text-white',
              'transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95'
            )}
          >
            {ctaText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="relative z-20 mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-3 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={`${feature.title}-${index}`}
              className={cn(
                'group rounded-xl border border-neutral-200 bg-white/80 p-6 text-center backdrop-blur-sm transition-all duration-300',
                'hover:border-neutral-300 hover:bg-white'
              )}
            >
              <h3 className="text-lg font-semibold text-neutral-900 transition-colors group-hover:text-[var(--primary)] sm:text-xl">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
