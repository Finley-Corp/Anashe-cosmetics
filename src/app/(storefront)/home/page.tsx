import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Star, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Logos3 } from '@/components/blocks/logos3';
import { TestimonialsSection } from '@/components/storefront/TestimonialsSection';
import type { Product } from '@/types';
import { createClient } from '@/lib/supabase/server';

const FALLBACK_CATEGORIES = [
  { name: 'Moisturisers & Hydration', image: '/images/moisturizer%20and%20hydration.jpg', href: '/categories/moisturisers' },
  { name: 'Serums & Treatments', image: '/images/serum%20%26%20treatment.jpg', href: '/categories/serums-treatments' },
  { name: 'Cleansers & Toners', image: '/images/cleanser.jpg', href: '/categories/cleansers-toners' },
  { name: 'Sunscreen & SPF', image: '/images/susnscreen.jpg', href: '/categories/sunscreen-spf' },
  { name: 'Foundations & Concealer', image: '/images/foundation%20%26%20concealers.jpg', href: '/categories/foundations-concealer' },
  { name: 'Natural & Organic', image: '/images/orange%20(2).jpg', href: '/categories/natural-organic' },
];

const CATEGORY_IMAGE_OVERRIDES = [
  '/images/moisturizer%20and%20hydration.jpg',
  '/images/serum%20%26%20treatment.jpg',
  '/images/cleanser.jpg',
  '/images/susnscreen.jpg',
  '/images/foundation%20%26%20concealers.jpg',
];

const demoData = {
  heading: 'Featured Brands',
  logos: [
    { id: 'logo-1', description: 'CeraVe', image: '/logos/cerave.png', className: 'h-[4.4rem] w-auto' },
    { id: 'logo-2', description: 'Cetaphil', image: '/logos/cetaphil.png', className: 'h-[4.4rem] w-auto' },
    { id: 'logo-3', description: 'COSRX', image: '/logos/cosrx.png', className: 'h-[4.4rem] w-auto' },
    { id: 'logo-4', description: 'Eucirin', image: '/logos/eucirin.jpg', className: 'h-[4.4rem] w-auto' },
    { id: 'logo-5', description: 'LA Girl', image: '/logos/la%20girl.webp', className: 'h-[4.4rem] w-auto' },
    { id: 'logo-6', description: 'La Roche-Posay', image: '/logos/La-Roche-Posay-Logo.png', className: 'h-[4.4rem] w-auto' },
    { id: 'logo-7', description: 'Neutrogena', image: '/logos/neutrogena.png', className: 'h-[4.4rem] w-auto scale-110 mix-blend-multiply contrast-125' },
    { id: 'logo-8', description: 'The Oridinary', image: '/logos/the%20oridinary.jpg', className: 'h-[4.4rem] w-auto' },
  ],
};

type JournalPost = {
  id: string;
  title: string;
  category: string;
  image_url: string | null;
  published_at: string | null;
  created_at: string | null;
};

type HomeTestimonialRow = {
  full_name: string;
  role: string | null;
  message: string;
  avatar_url: string | null;
};

type HomeTestimonialItem = NonNullable<
  Parameters<typeof TestimonialsSection>[0]['testimonials']
>[number];

function formatJournalDate(value: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: featuredProducts }, { data: categories }, { data: journalPostsData }, { data: testimonialsData }] = await Promise.all([
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
    supabase
      .from('blog_posts')
      .select('id,title,category,image_url,published_at,created_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('testimonials_feedback')
      .select('full_name,role,message,avatar_url')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(9),
  ]);

  const products = (featuredProducts as Product[] | null) ?? [];
  const categoryTiles = categories && categories.length > 0
    ? categories.map((c) => ({
        name: c.name,
        image: c.image_url ?? FALLBACK_CATEGORIES[0].image,
        href: `/categories/${c.slug}`,
      })).map((tile, index) => ({
        ...tile,
        image: CATEGORY_IMAGE_OVERRIDES[index] ?? tile.image,
      }))
    : FALLBACK_CATEGORIES;
  const journalPosts = (journalPostsData ?? []) as JournalPost[];
  const homepageTestimonials: HomeTestimonialItem[] = ((testimonialsData ?? []) as HomeTestimonialRow[]).map((item) => ({
    text: item.message,
    image: item.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(item.full_name)}&background=16a34a&color=fff`,
    name: item.full_name,
    role: item.role ?? 'Anashe Customer',
  }));
  const trustItems = [
    { icon: <Truck className="w-3.5 h-3.5" />, text: 'Free Delivery Over KES 2,000' },
    { icon: <ShieldCheck className="w-3.5 h-3.5" />, text: 'Secure Order Checkout' },
    { icon: <RefreshCw className="w-3.5 h-3.5" />, text: '14-Day Easy Returns' },
    { icon: <Star className="w-3.5 h-3.5" />, text: '5,000+ Happy Customers' },
  ];

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
            fetchPriority="high"
            quality={86}
            sizes="100vw"
            className="w-full h-full object-cover object-center brightness-[0.82]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 pb-16 md:pb-24">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium text-white mb-6">
              Skincare & Cosmetics / 2026
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter !text-white mb-6 leading-[0.95] font-[family-name:var(--font-display)]">
              Your skincare routine,
              <br />
              Kenyan prices.
            </h1>
            <p className="text-zinc-200 text-sm md:text-base font-normal max-w-md mb-8 leading-relaxed">
              Shop skincare and cosmetics formulated for your skin goals with easy ordering and fast delivery across Kenya.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products?sort=newest" className="bg-[var(--primary)] text-white px-8 py-3 rounded text-sm font-medium hover:bg-[var(--primary-hover)] transition-all flex items-center gap-2">
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
      <div className="border-y border-neutral-100 bg-[var(--accent)] py-5 overflow-hidden">
        <div className="trust-marquee-track text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          {[...trustItems, ...trustItems].map(({ icon, text }, index) => (
            <span key={`${text}-${index}`} className="trust-marquee-item hover:text-neutral-600 transition-colors">
              {icon} {text}
            </span>
          ))}
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
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  quality={82}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
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
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] mb-1">Just Landed</p>
              <h2 className="text-3xl lg:text-4xl font-medium tracking-tight font-[family-name:var(--font-display)]">New Arrivals</h2>
            </div>
            <Link href="/products?sort=newest" className="hidden md:flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors group border-b border-transparent hover:border-neutral-900 pb-0.5">
              Browse All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[580px]">
            <div className="md:col-span-2 relative group overflow-hidden rounded-2xl bg-neutral-100 aspect-[4/3] md:aspect-auto h-auto md:h-auto reveal cursor-pointer">
              <Image
                src="/images/black-woman.jpg"
                alt="Skincare collection"
                fill
                quality={84}
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <span className="text-xs font-bold uppercase tracking-wider mb-2 block opacity-80 !text-white">Featured Collection</span>
                <h3 className="text-3xl font-medium tracking-tight mb-2 font-[family-name:var(--font-display)] !text-white">Glow Essentials</h3>
                <p className="text-sm max-w-sm !text-white">Hydration, brightening, and SPF must-haves for everyday routines.</p>
              </div>
              <Link href="/products?sort=newest" className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl text-neutral-900">
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-rows-2 gap-6 h-auto md:h-auto">
              {[
                { title: 'Makeup Must-Haves', img: '/images/black-woman-3.jpg' },
                { title: 'Natural Skincare', img: '/images/orange%20(2).jpg' },
              ].map((item, i) => (
                <div key={item.title} className={`relative group overflow-hidden rounded-xl bg-neutral-100 aspect-[16/9] md:aspect-auto reveal delay-${(i + 1) * 100}`}>
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    quality={82}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5">
                    <h3 className="text-lg font-medium font-[family-name:var(--font-display)] !text-white">{item.title}</h3>
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
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${i === 0 ? 'bg-[var(--primary)] text-white shadow-lg' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-[var(--primary)] hover:text-[var(--primary)]'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, i) => (
                <div key={product.id} className={`reveal delay-${Math.min(i, 3) * 75}`}>
                  <ProductCard product={product} priority={i < 2} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
              <p className="text-sm text-neutral-500">No featured products available yet.</p>
            </div>
          )}

          <div className="text-center mt-14">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 h-12 px-8 border border-[var(--primary)] text-[var(--primary)] text-sm font-semibold rounded-full hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all duration-300 group"
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
            quality={84}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-16 lg:px-20 bg-white">
          <div className="reveal max-w-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] mb-4">Why Anashe</p>
            <h2 className="text-3xl lg:text-4xl font-medium tracking-tight mb-6 leading-snug font-[family-name:var(--font-display)]">
              Quality products,<br />Kenyan convenience.
            </h2>
            <p className="text-neutral-500 leading-relaxed mb-8 text-sm">
              We partner with trusted skincare and cosmetic brands to bring you authentic products at fair Kenyan prices. With a simple order flow and quick confirmation, beauty shopping online has never been this easy.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                'Simple online ordering with fast confirmation',
                'Authentic skincare and cosmetic products only',
                'Fast delivery across all 47 counties in Kenya',
                '14-day hassle-free returns policy',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-neutral-800">
                  <span className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-[var(--primary)]" />
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
            {journalPosts.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.id}`} className={`group reveal delay-${i * 100}`}>
                <article className="cursor-pointer">
                  <div className="overflow-hidden rounded-xl mb-5 aspect-[16/10] bg-neutral-100">
                    <Image
                      src={post.image_url ?? '/images/hero-1.jpg'}
                      alt={post.title}
                      width={800}
                      height={500}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 mb-2.5 uppercase tracking-wider">
                    <span>{formatJournalDate(post.published_at ?? post.created_at)}</span>
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    <span>{post.category}</span>
                  </div>
                  <h3 className="text-lg font-medium tracking-tight mb-2 group-hover:underline decoration-1 underline-offset-4 font-[family-name:var(--font-display)]">{post.title}</h3>
                </article>
              </Link>
            ))}
          </div>
          {journalPosts.length === 0 ? (
            <p className="text-sm text-neutral-500 mt-6">No journal posts yet.</p>
          ) : null}
        </div>
      </section>

      <TestimonialsSection testimonials={homepageTestimonials} />

      {/* FEATURED BRANDS */}
      <section className="py-16 lg:py-20 border-y border-neutral-100 bg-gradient-to-b from-white to-neutral-50/60">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 reveal">
          <Logos3 {...demoData} />
        </div>
      </section>

    </>
  );
}
