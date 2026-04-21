type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

type TestimonialsColumnProps = {
  testimonials: Testimonial[];
  duration?: number;
  className?: string;
  reverse?: boolean;
};

export function TestimonialsColumn({
  testimonials,
  duration = 16,
  className = '',
  reverse = false,
}: TestimonialsColumnProps) {
  const loopedTestimonials = [...testimonials, ...testimonials];

  return (
    <div
      className={`w-full max-w-sm shrink-0 ${className}`}
      style={{
        animationDuration: `${duration}s`,
      }}
    >
      <div
        className={`testimonials-column-track ${reverse ? 'testimonials-column-track-reverse' : ''}`}
        style={{
          animationDuration: `${duration}s`,
        }}
      >
        {loopedTestimonials.map((testimonial, index) => (
          <article
            key={`${testimonial.name}-${index}`}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm leading-relaxed text-neutral-600">{testimonial.text}</p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="h-10 w-10 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="text-sm font-semibold text-neutral-900">{testimonial.name}</p>
                <p className="text-xs text-neutral-500">{testimonial.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
