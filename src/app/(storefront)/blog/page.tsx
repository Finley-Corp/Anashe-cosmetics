import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'The Journal',
  description: 'Skincare routines, ingredient guides, and beauty education from the Anashe team.',
};

const POSTS = [
  { title: 'How to Build a Simple 5-Step Skincare Routine', category: 'Skincare Basics', date: 'Apr 10, 2026', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80', excerpt: 'A beginner-friendly cleanser, toner, serum, moisturiser, and SPF routine for Kenyan weather.' },
  { title: 'How Secure Ordering Makes Beauty Shopping Safer', category: 'Shopping Guide', date: 'Apr 5, 2026', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', excerpt: 'Understanding why secure online ordering is a safe and convenient way to shop for skincare and cosmetics in Kenya.' },
  { title: 'Vitamin C vs Niacinamide: Which One Is Right for You?', category: 'Ingredients', date: 'Mar 28, 2026', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80', excerpt: 'Learn the difference between two top brightening ingredients and how to use them in your routine.' },
  { title: 'Best SPF Levels for Kenya\'s Climate', category: 'Sunscreen', date: 'Mar 20, 2026', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80', excerpt: 'SPF 30 or SPF 50? Here is how to choose the right sunscreen for daily protection.' },
  { title: 'How to Match Foundation Shade Online', category: 'Makeup', date: 'Mar 15, 2026', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80', excerpt: 'Use undertone, swatch hex, and depth matching tips to confidently choose your foundation shade.' },
  { title: 'Natural & Organic Beauty: What Labels Actually Mean', category: 'Clean Beauty', date: 'Mar 8, 2026', image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80', excerpt: 'A practical guide to vegan, cruelty-free, and natural claims in skincare and cosmetics.' },
];

export default function BlogPage() {
  const featured = POSTS[0];
  const rest = POSTS.slice(1);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-2">Our Blog</p>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight font-[family-name:var(--font-display)]">The Journal</h1>
      </div>

      {/* Featured */}
      <Link href={featured.image} className="group grid md:grid-cols-2 gap-8 mb-16 bg-neutral-50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-64 md:h-auto overflow-hidden">
          <Image src={featured.image} alt={featured.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
        <div className="p-6 md:p-10 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-green-700 mb-3">{featured.category}</span>
          <h2 className="text-2xl font-medium tracking-tight mb-4 group-hover:underline font-[family-name:var(--font-display)]">{featured.title}</h2>
          <p className="text-neutral-500 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
          <span className="text-xs text-neutral-400">{featured.date}</span>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rest.map((post) => (
          <article key={post.title} className="group cursor-pointer">
            <div className="overflow-hidden rounded-xl mb-5 aspect-[16/10] bg-neutral-100">
              <Image src={post.image} alt={post.title} width={800} height={500} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 mb-2.5 uppercase tracking-wider">
              <span>{post.date}</span>
              <span className="w-1 h-1 bg-neutral-300 rounded-full" />
              <span>{post.category}</span>
            </div>
            <h3 className="text-lg font-medium tracking-tight mb-2 group-hover:underline decoration-1 underline-offset-4 font-[family-name:var(--font-display)]">{post.title}</h3>
            <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
