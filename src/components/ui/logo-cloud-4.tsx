'use client';

type LogoItem = {
  src: string;
  alt: string;
};

interface LogoCloudProps {
  logos: LogoItem[];
}

export function LogoCloud({ logos }: LogoCloudProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {logos.map((logo) => (
        <div
          key={logo.alt}
          className="h-16 rounded-xl border border-white/20 bg-white/10 px-4 backdrop-blur-sm flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={logo.alt}
            className="h-7 w-auto max-w-full object-contain opacity-85 transition-opacity duration-300 hover:opacity-100"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
