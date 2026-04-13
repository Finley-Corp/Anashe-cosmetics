import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import RevealObserver from "@/components/RevealObserver";

export const metadata: Metadata = {
  title: "Journal | LUMA",
  description: "Stories, ideas, and perspectives on design and intentional living.",
};

const FEATURED = {
  slug: "minimalism-modern-home",
  category: "Interiors",
  date: "Apr 8, 2026",
  readTime: "6 min read",
  title: "The Case for Radical Minimalism in the Modern Home",
  excerpt:
    "We live in an age of abundance, yet more and more designers are making the case for less. We explore why the 'one in, one out' philosophy isn't just an aesthetic choice — it's a way of life.",
  image:
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop",
  author: { name: "Sofia Andersson", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&q=80" },
};

const ARTICLES = [
  {
    slug: "art-of-lighting",
    category: "Design",
    date: "Mar 22, 2026",
    readTime: "4 min read",
    title: "The Art of Lighting: How One Change Transforms a Room",
    excerpt: "How proper lighting transforms the mood and utility of a room instantly, creating warmth and depth in any space.",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1987&auto=format&fit=crop",
    author: { name: "Marcus Chen", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&q=80" },
  },
  {
    slug: "meet-the-makers",
    category: "Studio",
    date: "Mar 5, 2026",
    readTime: "8 min read",
    title: "Meet the Makers: Inside Our Ceramic Studio",
    excerpt: "A behind-the-scenes look at the artisans crafting our ceramic collection using techniques passed down through generations.",
    image: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=2070&auto=format&fit=crop",
    author: { name: "Amara Osei", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=64&q=80" },
  },
  {
    slug: "material-honesty",
    category: "Materials",
    date: "Feb 18, 2026",
    readTime: "5 min read",
    title: "Material Honesty: Why We Let Our Wood Stay Wood",
    excerpt: "We talk to our head of materials about why concealing the natural character of wood is the design choice we'll never make.",
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=1780&auto=format&fit=crop",
    author: { name: "Leon Kovač", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&q=80" },
  },
  {
    slug: "small-space-thinking",
    category: "Interiors",
    date: "Feb 1, 2026",
    readTime: "5 min read",
    title: "Small Space Thinking: 6 Rules for the Compact Home",
    excerpt: "The best ideas in design often come from constraints. We share six principles for living beautifully in a smaller space.",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop",
    author: { name: "Sofia Andersson", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&q=80" },
  },
  {
    slug: "colour-2026",
    category: "Trend",
    date: "Jan 14, 2026",
    readTime: "3 min read",
    title: "The Colours Defining Interiors in 2026",
    excerpt: "Warm clay tones, deep slate blues, and the return of off-white — we look at the palette shaping homes this year.",
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2070&auto=format&fit=crop",
    author: { name: "Marcus Chen", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&q=80" },
  },
];

const CATEGORIES = ["All", "Interiors", "Design", "Studio", "Materials", "Trend"];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Page Header */}
        <div className="max-w-[1440px] mx-auto px-6 pt-16 pb-12 border-b border-neutral-100">
          <div className="max-w-xl">
            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase block mb-4">
              Stories & Ideas
            </span>
            <h1 className="text-5xl lg:text-6xl font-medium tracking-tighter leading-[0.95] mb-4">
              The Journal
            </h1>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Perspectives on design, craft, and the art of intentional living —
              written by our team and the makers we work with.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="sticky top-16 z-40 bg-white border-b border-neutral-100">
          <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center gap-3 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href="#"
                className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors bg-neutral-100 text-neutral-600 hover:bg-neutral-200 first:bg-neutral-900 first:text-white"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 py-16 lg:py-24">

          {/* Featured Article */}
          <div className="mb-20 reveal">
            <Link href={`/blog/${FEATURED.slug}`} className="group block">
              <div className="grid lg:grid-cols-2 gap-10 items-center bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 hover:shadow-xl transition-shadow duration-500">
                <div className="relative h-64 lg:h-[480px] overflow-hidden">
                  <Image
                    src={FEATURED.image}
                    alt={FEATURED.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>
                <div className="px-8 py-10 lg:pr-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-neutral-900 text-white px-2.5 py-1 rounded-sm">
                      Featured
                    </span>
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                      {FEATURED.category}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-medium tracking-tight leading-snug mb-4 group-hover:underline decoration-1 underline-offset-4">
                    {FEATURED.title}
                  </h2>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-8">
                    {FEATURED.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={FEATURED.author.avatar}
                        alt={FEATURED.author.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-semibold text-neutral-900">{FEATURED.author.name}</p>
                        <p className="text-[10px] text-neutral-400">{FEATURED.date} · {FEATURED.readTime}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <Icon icon="lucide:arrow-right" width={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Article Grid */}
          <div className="mb-6 flex items-center justify-between reveal">
            <h2 className="text-xl font-medium tracking-tight">Latest Articles</h2>
            <span className="text-xs text-neutral-400">{ARTICLES.length} articles</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {ARTICLES.map((article, i) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className={`group block reveal ${i > 0 ? `delay-${Math.min(i * 100, 300)}` : ""}`}
              >
                <div className="overflow-hidden rounded-xl mb-5 aspect-[16/10] bg-neutral-100 relative">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 mb-2.5 uppercase tracking-widest">
                  <span>{article.category}</span>
                  <span className="w-1 h-1 bg-neutral-200 rounded-full" />
                  <span>{article.date}</span>
                  <span className="w-1 h-1 bg-neutral-200 rounded-full" />
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-base lg:text-lg font-medium tracking-tight mb-2 leading-snug group-hover:underline decoration-1 underline-offset-4">
                  {article.title}
                </h3>
                <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                  <span className="text-xs font-medium text-neutral-600">{article.author.name}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-16 text-center reveal">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 border border-neutral-200 text-sm font-semibold rounded-full hover:bg-neutral-50 hover:border-neutral-400 transition-colors">
              Load more articles
              <Icon icon="lucide:chevron-down" width={16} />
            </button>
          </div>
        </div>

        <Newsletter />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
