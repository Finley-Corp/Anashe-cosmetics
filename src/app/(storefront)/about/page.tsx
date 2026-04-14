import Image from 'next/image';
import Link from 'next/link';
import { Truck, ShieldCheck, RefreshCw, Star, Users, Package, MapPin } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: 'Learn about Anashe — Kenya\'s premier online store for premium curated products with M-Pesa checkout.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1400&q=80" alt="About Anashe" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-green-400 mb-2">Our Story</p>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight max-w-xl font-[family-name:var(--font-display)]">
              Building Kenya&apos;s most trusted online marketplace
            </h1>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="border-b border-neutral-100 py-10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <Users className="w-5 h-5" />, value: '5,000+', label: 'Happy Customers' },
            { icon: <Package className="w-5 h-5" />, value: '500+', label: 'Products Listed' },
            { icon: <MapPin className="w-5 h-5" />, value: '47', label: 'Counties Served' },
            { icon: <Star className="w-5 h-5" />, value: '4.8/5', label: 'Average Rating' },
          ].map(({ icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-700 mx-auto mb-3">{icon}</div>
              <p className="text-2xl font-bold text-neutral-900 mb-1 font-[family-name:var(--font-display)]">{value}</p>
              <p className="text-sm text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <section className="py-20 max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-4">Why We Built Anashe</p>
            <h2 className="text-3xl font-medium tracking-tight mb-6 font-[family-name:var(--font-display)]">Shopping should be simple, safe, and local</h2>
            <div className="space-y-4 text-neutral-600 text-sm leading-relaxed">
              <p>Anashe was born out of frustration. Shopping online in Kenya shouldn&apos;t require a credit card or international payment method. Every Kenyan has M-Pesa — so why wasn&apos;t it everywhere?</p>
              <p>We built Anashe to be the platform we always wanted: genuine products, honest prices, and the payment method 95% of Kenyans already use every day.</p>
              <p>Our team is based in Nairobi, and we personally vet every seller and product on our platform. We know the Kenyan market, understand what customers need, and are committed to making online shopping as easy as buying from your local duka — but better.</p>
            </div>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" alt="Team" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-medium tracking-tight text-center mb-12 font-[family-name:var(--font-display)]">Our Commitments</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck className="w-6 h-6" />, title: 'Authentic Products', desc: 'Every product is verified genuine. Zero tolerance for counterfeits.' },
              { icon: <Truck className="w-6 h-6" />, title: 'Fast Delivery', desc: 'Nairobi same-day, upcountry 2-3 days. We deliver to all 47 counties.' },
              { icon: <RefreshCw className="w-6 h-6" />, title: 'Easy Returns', desc: '14-day hassle-free returns. No questions asked within policy.' },
              { icon: <Star className="w-6 h-6" />, title: 'Customer First', desc: 'Our support team is available Mon–Sat, 8am–8pm EAT.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white p-6 rounded-2xl border border-neutral-100">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-700 mb-4">{icon}</div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-3xl font-medium tracking-tight mb-4 font-[family-name:var(--font-display)]">Ready to start shopping?</h2>
          <p className="text-neutral-500 text-sm mb-8">Join thousands of Kenyans who shop smarter with Anashe.</p>
          <Link href="/products" className="inline-flex items-center gap-2 h-12 px-8 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-colors">
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
}
