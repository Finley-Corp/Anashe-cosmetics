import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, MapPin, Package, ShieldCheck, Star, Truck, Users } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: "Learn about Anashe - Kenya's premier online store for premium curated products with secure order checkout.",
};

export default function AboutPage() {
  return (
    <div className="bg-white text-neutral-900">
      <section className="relative min-h-[86vh] overflow-hidden border-b border-neutral-200 pt-16">
        <div className="absolute inset-0 opacity-[0.06]">
          <Image
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=2000&q=80"
            alt="Beauty textures background"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-14 sm:px-6">
          <div className="mb-8 inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.22em] text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
            About Anashe
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(3.4rem,11vw,9rem)] leading-[0.9] tracking-[-0.03em] text-neutral-900">
            Beauty.
            <br />
            Built for Kenya.
          </h1>
          <div className="mt-10 grid gap-6 border-t border-neutral-200 pt-8 md:grid-cols-2">
            <p className="max-w-xl text-sm leading-relaxed text-neutral-500">
              We curate authentic beauty products, pair them with transparent pricing, and make checkout simple with
              Customer-first ordering designed for real Kenyan shoppers.
            </p>
            <div className="grid grid-cols-3 gap-5 text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-400">Based in</p>
                <p className="mt-2 font-medium text-neutral-900">Nairobi</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-400">Since</p>
                <p className="mt-2 font-medium text-neutral-900">2024</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-400">Coverage</p>
                <p className="mt-2 font-medium text-neutral-900">47 Counties</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 py-12">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-8 px-4 sm:px-6 lg:grid-cols-4">
          {[
            { icon: <Users className="w-5 h-5" />, value: '5,000+', label: 'Happy Customers' },
            { icon: <Package className="w-5 h-5" />, value: '500+', label: 'Products Listed' },
            { icon: <MapPin className="w-5 h-5" />, value: '47', label: 'Counties Served' },
            { icon: <Star className="w-5 h-5" />, value: '4.8/5', label: 'Average Rating' },
          ].map(({ icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-700">
                {icon}
              </div>
              <p className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-neutral-900">{value}</p>
              <p className="mt-2 text-sm text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6">
        <div className="grid items-start gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Our Story</p>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.2rem,6vw,4.7rem)] leading-[0.98] tracking-[-0.02em] text-neutral-900">
              Shopping should feel effortless, safe, and local.
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <div className="space-y-4 text-sm leading-relaxed text-neutral-500">
              <p>
                Anashe started with one simple question: why should getting genuine beauty products in Kenya feel so hard?
                We saw customers forced to choose between trust, convenience, and payment options.
              </p>
              <p>
                So we built the experience ourselves. Curated catalogues, product verification, and streamlined ordering
                that fits real daily shopping behavior.
              </p>
              <p>
                Our team works from Nairobi and partners with verified suppliers so every order feels premium from browse
                to doorstep.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="relative h-[420px] overflow-hidden rounded-3xl bg-neutral-100">
            <Image
              src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1400&q=80"
              alt="Anashe team"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-[420px] overflow-hidden rounded-3xl bg-neutral-100">
            <Image
              src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1400&q=80"
              alt="Skincare products"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.2rem,6vw,4.7rem)] leading-[0.98] tracking-[-0.02em] text-neutral-900">
              What we bring
            </h2>
          </div>
          <div className="grid gap-px rounded-3xl border border-neutral-200 bg-neutral-200 md:grid-cols-2">
            {[
              { icon: <ShieldCheck className="h-6 w-6" />, title: 'Authentic Products', desc: 'Every product is verified genuine. Zero tolerance for counterfeits.' },
              { icon: <Truck className="h-6 w-6" />, title: 'Fast Delivery', desc: 'Nairobi same-day, upcountry 2-3 days. We deliver to all 47 counties.' },
              { icon: <CheckCircle2 className="h-6 w-6" />, title: 'Easy Returns', desc: '14-day hassle-free returns. No questions asked within policy.' },
              { icon: <Star className="h-6 w-6" />, title: 'Customer First', desc: 'Our support team is available Mon-Sat, 8am-8pm EAT.' },
            ].map(({ icon, title, desc }, idx) => (
              <div key={title} className={`${idx === 2 ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900'} p-10`}>
                <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-full ${idx === 2 ? 'bg-white/10' : 'bg-neutral-100'}`}>
                  {icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className={`text-sm leading-relaxed ${idx === 2 ? 'text-neutral-400' : 'text-neutral-500'}`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Journey</p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.2rem,6vw,4.7rem)] leading-[0.98] tracking-[-0.02em] text-neutral-900">
              How Anashe keeps getting better
            </h2>
          </div>
          <div className="md:col-span-7">
            <div className="divide-y divide-neutral-200 border-y border-neutral-200">
              {[
                { period: '2024', title: 'Platform launch', detail: 'Started with curated categories and local payments.' },
                { period: '2025', title: 'Supplier verification', detail: 'Expanded trusted supplier and inventory checks.' },
                { period: 'Now', title: 'Nationwide scale', detail: 'Serving customers across all 47 counties with faster delivery.' },
              ].map((item) => (
                <div key={item.period} className="flex items-center justify-between gap-6 py-6">
                  <div>
                    <p className="text-lg font-semibold text-neutral-900">{item.title}</p>
                    <p className="mt-1 text-sm text-neutral-500">{item.detail}</p>
                  </div>
                  <p className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-neutral-300">{item.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.2rem,6vw,4.7rem)] leading-[0.98] tracking-[-0.02em] text-neutral-900">
              Built around real routines
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
              'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
              'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80',
            ].map((src, index) => (
              <div key={src} className="group relative overflow-hidden rounded-3xl bg-neutral-100">
                <div className="relative h-72">
                  <Image
                    src={src}
                    alt={`Anashe showcase ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 py-24 text-white">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Lets get started</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.3rem,6vw,5.8rem)] leading-[0.92] tracking-[-0.03em]">
              Ready to shop with confidence?
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/70">
              Explore authenticated products, trusted brands, and fast delivery designed for Kenyan shoppers.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex h-[74px] w-[220px] items-center gap-3 rounded-full bg-white px-6 text-neutral-900 transition-colors hover:bg-neutral-100"
          >
            <ArrowRight className="h-6 w-6 rotate-[-45deg] shrink-0" />
            <span className="text-left text-[20px] font-semibold leading-[1.05] tracking-tight">
              Browse
              <br />
              Products
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
