import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';

export type TestimonialItem = {
  text: string;
  image: string;
  name: string;
  role: string;
};

const fallbackTestimonials: TestimonialItem[] = [
  {
    text: 'I found genuine CeraVe and La Roche-Posay in one checkout. My order arrived quickly in Nairobi and the products were exactly as listed.',
    image: 'https://randomuser.me/api/portraits/women/11.jpg',
    name: 'Mercy Wanjiru',
    role: 'Skincare Customer',
  },
  {
    text: 'The category filters made it easy to build a complete routine. I moved from random shopping to a consistent regimen in minutes.',
    image: 'https://randomuser.me/api/portraits/men/12.jpg',
    name: 'Brian Otieno',
    role: 'First-time Buyer',
  },
  {
    text: 'I love the quality of makeup shades and the packaging on delivery. Everything was authentic and well protected.',
    image: 'https://randomuser.me/api/portraits/women/13.jpg',
    name: 'Aisha Njeri',
    role: 'Makeup Enthusiast',
  },
  {
    text: 'Customer support on WhatsApp was responsive and helped me choose products for sensitive skin. The guidance was practical and honest.',
    image: 'https://randomuser.me/api/portraits/men/14.jpg',
    name: 'Kevin Maina',
    role: 'Returning Customer',
  },
  {
    text: 'Anashe makes premium skincare feel accessible with Kenyan pricing and clear product details. Reordering is now part of my monthly routine.',
    image: 'https://randomuser.me/api/portraits/women/15.jpg',
    name: 'Faith Atieno',
    role: 'Routine Builder',
  },
  {
    text: 'Delivery to Mombasa was faster than expected, and the SPF options were exactly what I needed for daily use.',
    image: 'https://randomuser.me/api/portraits/men/16.jpg',
    name: 'Yusuf Ali',
    role: 'Coastal Customer',
  },
  {
    text: 'I appreciate the mix of trusted global brands and practical local support. Shopping online feels reliable and straightforward.',
    image: 'https://randomuser.me/api/portraits/women/17.jpg',
    name: 'Lydia Cherono',
    role: 'Working Professional',
  },
  {
    text: 'The site is smooth on mobile and checkout is simple. I can reorder my essentials in under five minutes.',
    image: 'https://randomuser.me/api/portraits/men/18.jpg',
    name: 'Daniel Mwangi',
    role: 'Busy Parent',
  },
  {
    text: 'Great product range for acne care and hydration. I finally found a store that balances authenticity, speed, and value.',
    image: 'https://randomuser.me/api/portraits/women/19.jpg',
    name: 'Sharon Jepkoech',
    role: 'University Student',
  },
];

export function TestimonialsSection({ testimonials = fallbackTestimonials }: { testimonials?: TestimonialItem[] }) {
  const source = testimonials.length > 0 ? testimonials : fallbackTestimonials;
  const firstColumn = source.slice(0, 3);
  const secondColumn = source.slice(3, 6);
  const thirdColumn = source.slice(6, 9);
  return (
    <section id="testimonials" className="bg-white py-20 lg:py-24 border-t border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center max-w-[640px] mx-auto reveal">
          <div className="flex justify-center">
            <div className="border border-neutral-200 bg-neutral-50 py-1 px-4 rounded-full text-xs font-semibold uppercase tracking-wider text-neutral-600">
              Testimonials
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mt-5 text-center font-[family-name:var(--font-display)]">
            Real feedback from our community
          </h2>
          <p className="text-center mt-4 text-neutral-500 text-sm md:text-base">
            Customers across Kenya trust Anashe for authentic skincare and cosmetics, helpful support, and reliable delivery.
          </p>
        </div>

        <div className="mt-12 max-h-[720px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialsColumn testimonials={firstColumn} duration={16} />
            <TestimonialsColumn testimonials={secondColumn} duration={20} className="hidden md:block" reverse />
            <TestimonialsColumn testimonials={thirdColumn} duration={18} className="hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
