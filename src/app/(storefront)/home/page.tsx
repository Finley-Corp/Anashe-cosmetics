import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Star, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/storefront/ProductCard';
import type { Product } from '@/types';
import { createClient } from '@/lib/supabase/server';

// Demo products for initial render (replace with Supabase query)
const DEMO_PRODUCTS: Product[] = [
  {
    id: '1', name: 'Vitamin C Brightening Serum 30ml', slug: 'vitamin-c-brightening-serum-30ml',
    price: 2800, sale_price: 2200, stock: 24, is_published: true, is_featured: true,
    average_rating: 4.7, review_count: 128, tags: ['serum', 'brightening', 'vitamin-c'],
    category_id: null, description: null, short_description: 'Targets dark spots and uneven tone with stabilized Vitamin C.',
    sku: 'SER-001', low_stock_threshold: 5, weight_kg: null, brand: 'Anashe Skin',
    cost_price: null, meta_title: null, meta_description: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    images: [{ id: '1', product_id: '1', url: '/images/hero-1.jpg', alt: 'Vitamin C Serum', sort_order: 0, is_primary: true }]
  },
  {
    id: '2', name: 'Hyaluronic Acid Hydrating Serum 30ml', slug: 'hyaluronic-acid-hydrating-serum-30ml',
    price: 1900, sale_price: null, stock: 15, is_published: true, is_featured: false,
    average_rating: 4.5, review_count: 64, tags: ['serum', 'hydration', 'hyaluronic-acid'],
    category_id: null, description: null, short_description: 'Deep hydration serum for dry and sensitive skin.',
    sku: 'SER-002', low_stock_threshold: 3, weight_kg: null, brand: 'Anashe Skin',
    cost_price: null, meta_title: null, meta_description: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    images: [{ id: '2', product_id: '2', url: '/images/hero-2.jpg', alt: 'Hydrating Serum', sort_order: 0, is_primary: true }]
  },
  {
    id: '3', name: 'SPF 50 Daily Moisturiser 50ml', slug: 'spf-50-daily-moisturiser-50ml',
    price: 2400, sale_price: null, stock: 50, is_published: true, is_featured: false,
    average_rating: 4.9, review_count: 203, tags: ['spf', 'moisturiser', 'sunscreen'],
    category_id: null, description: null, short_description: 'Lightweight SPF 50 moisturiser for daily UV protection.',
    sku: 'SPF-003', low_stock_threshold: 10, weight_kg: 0.6, brand: 'Anashe Skin',
    cost_price: null, meta_title: null, meta_description: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    images: [{ id: '3', product_id: '3', url: '/images/hero-image.jpg', alt: 'SPF Moisturiser', sort_order: 0, is_primary: true }]
  },
  {
    id: '4', name: 'Skin Glow Liquid Foundation 30ml', slug: 'skin-glow-liquid-foundation-30ml',
    price: 3500, sale_price: 3200, stock: 8, is_published: true, is_featured: true,
    average_rating: 4.3, review_count: 41, tags: ['foundation', 'makeup', 'dewy'],
    category_id: null, description: null, short_description: 'Buildable dewy foundation with natural finish.',
    sku: 'MKU-004', low_stock_threshold: 5, weight_kg: 0.4, brand: 'Anashe Beauty',
    cost_price: null, meta_title: null, meta_description: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    images: [{ id: '4', product_id: '4', url: '/images/good-skin-club.jpg', alt: 'Liquid Foundation', sort_order: 0, is_primary: true }]
  },
];

const FALLBACK_CATEGORIES = [
  { name: 'Moisturisers & Hydration', image: '/images/black-woman.jpg', href: '/categories/moisturisers' },
  { name: 'Serums & Treatments', image: '/images/black-woman-2.jpg', href: '/categories/serums-treatments' },
  { name: 'Cleansers & Toners', image: '/images/black-woman-3.jpg', href: '/categories/cleansers-toners' },
  { name: 'Sunscreen & SPF', image: '/images/black-woman-4.jpg', href: '/categories/sunscreen-spf' },
  { name: 'Foundations & Concealer', image: '/images/good-skin-club.jpg', href: '/categories/foundations-concealer' },
  { name: 'Natural & Organic', image: '/images/orange%20(2).jpg', href: '/categories/natural-organic' },
];

const JOURNAL_POSTS = [
  {
    title: 'How to Build a Simple 5-Step Skincare Routine',
    category: 'Skincare',
    date: 'Apr 10, 2026',
    image: '/images/hero-1.jpg',
    href: '/blog',
  },
  {
    title: 'Best SPF Products for Kenya\'s Sunny Climate',
    category: 'Sunscreen',
    date: 'Apr 5, 2026',
    image: '/images/hero-2.jpg',
    href: '/blog',
  },
  {
    title: 'How to Choose the Right Foundation Shade Online',
    category: 'Makeup',
    date: 'Mar 28, 2026',
    image: '/images/good-skin-club.jpg',
    href: '/blog',
  },
];

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: featuredProducts }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*, images:product_images(*)')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('categories')
      .select('name, slug, image_url')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(6),
  ]);

  const products = (featuredProducts as Product[] | null) ?? DEMO_PRODUCTS;
  const categoryTiles = categories && categories.length > 0
    ? categories.map((c) => ({
        name: c.name,
        image: c.image_url ?? FALLBACK_CATEGORIES[0].image,
        href: `/categories/${c.slug}`,
      }))
    : FALLBACK_CATEGORIES;

  return (
    <>
      {/* HERO */}
      <section className="relative w-full h-[85vh] overflow-hidden flex items-end justify-start" id="hero">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-image-pro-2.jpg"
            alt="Anashe beauty hero"
            fill
            priority
            className="w-full h-full object-cover object-center brightness-[0.82]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 pb-16 md:pb-24">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium text-white mb-6">
              Skincare & Cosmetics / 2026
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-white mb-6 leading-[0.95] font-[family-name:var(--font-display)]">
              Your skincare routine,
              <br />
              Kenyan prices.
            </h1>
            <p className="text-zinc-200 text-sm md:text-base font-normal max-w-md mb-8 leading-relaxed">
              Shop skincare and cosmetics formulated for your skin goals with easy M-Pesa checkout and fast delivery across Kenya.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products?sort=newest" className="bg-white text-zinc-950 px-8 py-3 rounded text-sm font-medium hover:bg-zinc-100 transition-all flex items-center gap-2">
                Shop New Arrivals <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/products?sort=popular" className="border border-white/30 text-white px-8 py-3 rounded text-sm font-medium hover:bg-white/10 transition-colors backdrop-blur-sm">
                View Best Sellers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="border-y border-neutral-100 bg-neutral-50/60 py-5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
            {[
              { icon: <Truck className="w-3.5 h-3.5" />, text: 'Free Delivery Over KES 2,000' },
              { icon: <ShieldCheck className="w-3.5 h-3.5" />, text: 'M-Pesa Secure Checkout' },
              { icon: <RefreshCw className="w-3.5 h-3.5" />, text: '14-Day Easy Returns' },
              { icon: <Star className="w-3.5 h-3.5" />, text: '5,000+ Happy Customers' },
            ].map(({ icon, text }) => (
              <span key={text} className="flex items-center gap-2 hover:text-neutral-600 transition-colors">
                {icon} {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-10 reveal">
            <h2 className="text-3xl lg:text-4xl font-medium tracking-tight font-[family-name:var(--font-display)]">Shop by Category</h2>
            <Link href="/products" className="hidden md:flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors group border-b border-transparent hover:border-neutral-900 pb-0.5">
              All Categories <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryTiles.map((cat, i) => (
              <Link
                key={cat.name}
                href={cat.href}
                className={`reveal group relative overflow-hidden rounded-xl aspect-square bg-neutral-100 ${i < 2 ? '' : `delay-${Math.min(i, 3) * 100}`}`}
              >
                <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="text-white text-sm font-semibold">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-20 lg:py-24 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-10 reveal">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-1">Just Landed</p>
              <h2 className="text-3xl lg:text-4xl font-medium tracking-tight font-[family-name:var(--font-display)]">New Arrivals</h2>
            </div>
            <Link href="/products?sort=newest" className="hidden md:flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors group border-b border-transparent hover:border-neutral-900 pb-0.5">
              Browse All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[580px]">
            <div className="md:col-span-2 relative group overflow-hidden rounded-2xl bg-neutral-100 h-72 md:h-auto reveal cursor-pointer">
              <Image
                src="/images/black-woman.jpg"
                alt="Skincare collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <span className="text-xs font-bold uppercase tracking-wider mb-2 block opacity-80">Featured Collection</span>
                <h3 className="text-3xl font-medium tracking-tight mb-2 font-[family-name:var(--font-display)]">Glow Essentials</h3>
                <p className="text-white/80 text-sm max-w-sm">Hydration, brightening, and SPF must-haves for everyday routines.</p>
              </div>
              <Link href="/products?sort=newest" className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl text-neutral-900">
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-rows-2 gap-6 h-72 md:h-auto">
              {[
                { title: 'Makeup Must-Haves', img: '/images/black-woman-3.jpg' },
                { title: 'Natural Skincare', img: '/images/orange%20(2).jpg' },
              ].map((item, i) => (
                <div key={item.title} className={`relative group overflow-hidden rounded-xl bg-neutral-100 reveal delay-${(i + 1) * 100}`}>
                  <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 text-white">
                    <h3 className="text-lg font-medium font-[family-name:var(--font-display)]">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4 reveal">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">Handpicked for You</p>
              <h2 className="text-3xl font-medium tracking-tight font-[family-name:var(--font-display)]">Featured Products</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Skincare', 'Makeup', 'Body Care', 'Natural'].map((f, i) => (
                <button
                  key={f}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${i === 0 ? 'bg-neutral-900 text-white shadow-lg' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, i) => (
              <div key={product.id} className={`reveal delay-${Math.min(i, 3) * 75}`}>
                <ProductCard product={product} priority={i < 2} />
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 h-12 px-8 border border-neutral-300 text-neutral-900 text-sm font-semibold rounded-full hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300 group"
            >
              View All Products
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* SPLIT SECTION — Value Prop */}
      <section className="grid lg:grid-cols-2 min-h-[560px] border-y border-neutral-100">
        <div className="relative bg-neutral-100 h-72 lg:h-auto overflow-hidden group">
          <Image
            src="/images/black-woman-4.jpg"
            alt="Quality products"
            fill
            className="object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-16 lg:px-20 bg-white">
          <div className="reveal max-w-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-4">Why Anashe</p>
            <h2 className="text-3xl lg:text-4xl font-medium tracking-tight mb-6 leading-snug font-[family-name:var(--font-display)]">
              Quality products,<br />Kenyan convenience.
            </h2>
            <p className="text-neutral-500 leading-relaxed mb-8 text-sm">
              We partner with trusted skincare and cosmetic brands to bring you authentic products at fair Kenyan prices. With M-Pesa as our primary payment method, beauty shopping online has never been this easy.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                'M-Pesa STK Push — pay straight from your phone',
                'Authentic skincare and cosmetic products only',
                'Fast delivery across all 47 counties in Kenya',
                '14-day hassle-free returns policy',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-neutral-800">
                  <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-green-700" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/about" className="inline-flex items-center text-sm font-semibold border border-neutral-200 px-6 py-3 rounded-lg hover:bg-neutral-50 transition-colors gap-2 group">
              Our Story <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12 reveal">
            <h2 className="text-3xl font-medium tracking-tight font-[family-name:var(--font-display)]">The Journal</h2>
            <Link href="/blog" className="hidden md:flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors border-b border-transparent hover:border-neutral-900 pb-0.5 group">
              All Articles <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {JOURNAL_POSTS.map((post, i) => (
              <article key={post.title} className={`group cursor-pointer reveal delay-${i * 100}`}>
                <div className="overflow-hidden rounded-xl mb-5 aspect-[16/10] bg-neutral-100">
                  <Image src={post.image} alt={post.title} width={800} height={500} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 mb-2.5 uppercase tracking-wider">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                  <span>{post.category}</span>
                </div>
                <h3 className="text-lg font-medium tracking-tight mb-2 group-hover:underline decoration-1 underline-offset-4 font-[family-name:var(--font-display)]">{post.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="max-w-screen-md mx-auto px-4 md:px-6 text-center reveal">
          <div className="w-12 h-12 bg-green-700/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-medium tracking-tight mb-4 font-[family-name:var(--font-display)]">Get skincare tips and exclusive deals first</h2>
          <p className="text-neutral-400 mb-10 max-w-sm mx-auto text-sm leading-relaxed">
            Join 5,000+ Kenyans getting weekly skincare routines, new beauty drops, and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-green-500 transition-colors placeholder:text-neutral-500"
            />
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-600 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="text-neutral-600 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}
