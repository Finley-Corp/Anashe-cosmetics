import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, MapPin, Package, ShieldCheck, Sparkles, Star, Truck, Users } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: 'Learn about Anashe — Kenya\'s premier online store for premium curated products with M-Pesa checkout.',
};

export default function AboutPage() {
  return (
    <div className="bg-[var(--canvas)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--primary-100)] bg-white pt-20">
        <div className="absolute right-0 top-0 h-[40vw] w-[40vw] max-h-[520px] max-w-[520px] rounded-full bg-[var(--accent)] blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-14 sm:px-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary-100)] bg-[var(--accent)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--primary)]">
              About Anashe
            </span>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl font-medium leading-[0.95] tracking-tight text-[var(--text-primary)] sm:text-6xl lg:text-8xl">
              Beauty built for
              <br />
              Kenya&apos;s everyday life
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-body)]">
              We make premium beauty shopping simple, local, and trusted. Authentic products, transparent prices, and
              checkout that works the way Kenyans already pay.
            </p>
          </div>
          <div className="flex items-end lg:col-span-4">
            <div className="w-full rounded-3xl border border-[var(--primary-100)] bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Since</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--text-primary)]">2024</p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-body)]">
                Nairobi-based team, curated catalogue, and customer support focused on speed, safety, and consistency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-[var(--primary-100)] bg-[var(--accent)] py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4">
          {[
            { icon: <Users className="w-5 h-5" />, value: '5,000+', label: 'Happy Customers' },
            { icon: <Package className="w-5 h-5" />, value: '500+', label: 'Products Listed' },
            { icon: <MapPin className="w-5 h-5" />, value: '47', label: 'Counties Served' },
            { icon: <Star className="w-5 h-5" />, value: '4.8/5', label: 'Average Rating' },
          ].map(({ icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--primary)]">{icon}</div>
              <p className="mb-1 font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--text-primary)]">{value}</p>
              <p className="text-sm text-[var(--text-body)]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">Our Story</p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Shopping should feel effortless, safe, and local.
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--text-body)]">
              <p>
                Anashe started with one simple question: why should getting genuine beauty products in Kenya feel so hard?
                We saw customers forced to choose between trust, convenience, and payment options.
              </p>
              <p>
                So we built the experience ourselves. Curated catalogues, product verification, and M-Pesa-first checkout
                that fits real daily shopping behavior.
              </p>
              <p>
                Our team works from Nairobi and partners with verified suppliers so every order feels premium from browse
                to doorstep.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="relative h-80 overflow-hidden rounded-3xl border border-[var(--primary-100)] sm:h-[460px]">
              <Image src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1400&q=80" alt="Anashe team" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-white/80">Nairobi, Kenya</p>
                <p className="mt-2 text-lg font-semibold">Built by people who understand local beauty shoppers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="border-y border-[var(--primary-100)] bg-[var(--accent)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex items-end justify-between gap-6">
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-[var(--text-primary)] sm:text-5xl">
              What we stand for
            </h2>
            <span className="hidden rounded-full border border-[var(--primary-100)] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-body)] md:inline-flex">
              Trust, speed, quality
            </span>
          </div>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--primary-100)] bg-[var(--primary-100)] md:grid-cols-2">
            {[
              { icon: <ShieldCheck className="w-6 h-6" />, title: 'Authentic Products', desc: 'Every product is verified genuine. Zero tolerance for counterfeits.' },
              { icon: <Truck className="w-6 h-6" />, title: 'Fast Delivery', desc: 'Nairobi same-day, upcountry 2-3 days. We deliver to all 47 counties.' },
              { icon: <CheckCircle2 className="w-6 h-6" />, title: 'Easy Returns', desc: '14-day hassle-free returns. No questions asked within policy.' },
              { icon: <Star className="w-6 h-6" />, title: 'Customer First', desc: 'Our support team is available Mon–Sat, 8am–8pm EAT.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="group bg-white p-8 transition-colors hover:bg-[var(--accent)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--primary)]">{icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
                <p className="text-sm leading-relaxed text-[var(--text-body)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">Journey</p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-[var(--text-primary)]">
              How Anashe keeps getting better
            </h2>
          </div>
          <div className="md:col-span-7">
            <div className="divide-y divide-[var(--primary-100)] border-y border-[var(--primary-100)]">
              {[
                { period: '2024', title: 'Platform launch', detail: 'Started with curated categories and local payments.' },
                { period: '2025', title: 'Supplier verification', detail: 'Expanded trusted supplier and inventory checks.' },
                { period: 'Now', title: 'Nationwide scale', detail: 'Serving customers across all 47 counties with faster delivery.' },
              ].map((item) => (
                <div key={item.period} className="flex items-center justify-between gap-6 py-6">
                  <div>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">{item.title}</p>
                    <p className="mt-1 text-sm text-[var(--text-body)]">{item.detail}</p>
                  </div>
                  <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--primary)]">{item.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="border-t border-[var(--primary-100)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Built around real routines
            </h2>
            <span className="hidden items-center gap-2 text-sm text-[var(--text-body)] md:inline-flex">
              <Sparkles className="h-4 w-4 text-[var(--primary)]" />
              Curated, practical, consistent
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
              'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
              'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80',
            ].map((src, index) => (
              <div key={src} className="group relative overflow-hidden rounded-3xl border border-[var(--primary-100)] bg-white">
                <div className="relative h-72">
                  <Image src={src} alt={`Anashe showcase ${index + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="border-t border-[var(--primary-100)] p-4">
                  <p className="text-sm text-[var(--text-body)]">Beauty selection, curated for quality and everyday use.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--text-primary)] py-20 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Let&apos;s get started</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight sm:text-5xl">Ready to shop with confidence?</h2>
            <p className="mt-4 max-w-lg text-sm text-white/70">
              Explore authenticated products, trusted brands, and fast delivery designed for Kenyan shoppers.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-8 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
          >
            Browse Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
