type Logos3Item = {
  id: string;
  description: string;
  image: string;
  className?: string;
};

type Logos3Props = {
  heading: string;
  logos: Logos3Item[];
};

export function Logos3({ heading, logos }: Logos3Props) {
  const loopedLogos = [...logos, ...logos];

  return (
    <div className="w-full">
      <h2 className="mb-2 text-center text-3xl font-medium tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)] md:text-4xl">
        {heading}
      </h2>
      <p className="mb-8 text-center text-sm text-neutral-500">
        Premium brands our customers trust.
      </p>
      <div className="brand-marquee-mask">
        <div className="brand-marquee-track">
          {loopedLogos.map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="brand-marquee-item group flex h-20 items-center justify-center px-5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.image}
              alt={logo.description}
              className={`${logo.className ?? 'h-7 w-auto'} max-w-full object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
              loading="lazy"
            />
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}
