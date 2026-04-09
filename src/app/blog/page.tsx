"use client";

import Link from "next/link";
import Icon from "@/components/Icon";

const posts = [
  {
    id: 1,
    title: "Minimalism in the Modern Home",
    category: "Interiors",
    date: "Oct 12, 2023",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop",
    excerpt: "Exploring the balance between functionality and aesthetic in contemporary living spaces, emphasizing clutter-free environments."
  },
  {
    id: 2,
    title: "The Art of Lighting",
    category: "Design",
    date: "Sep 28, 2023",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1987&auto=format&fit=crop",
    excerpt: "How proper lighting transforms the mood and utility of a room instantly, creating warmth and depth in any space."
  },
  {
    id: 3,
    title: "Meet the Makers",
    category: "Studio",
    date: "Sep 15, 2023",
    image: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=2070&auto=format&fit=crop",
    excerpt: "A behind-the-scenes look at the artisans crafting our ceramic collection using traditional techniques."
  },
  {
    id: 4,
    title: "Sustainable Sourcing",
    category: "Philosophy",
    date: "Aug 30, 2023",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    excerpt: "Our commitment to the planet begins with the materials we choose for every piece in the ANASHE collection."
  }
];

export default function BlogPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 reveal">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-4 block">The Journal</span>
          <h1 className="text-4xl lg:text-6xl font-medium tracking-tighter mb-6">Thoughts on Design & Living</h1>
          <p className="text-neutral-500 text-lg leading-relaxed">
            A curated space for inspiration, craftsmanship stories, and the 
            art of intentional living.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-24 reveal">
           <Link href="#" className="group grid lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-[16/10] bg-neutral-100 rounded-2xl overflow-hidden shadow-2xl">
                 <img src={posts[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt="Featured" />
              </div>
              <div>
                 <div className="flex items-center gap-3 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">
                    <span className="text-neutral-900 border-b border-black pb-1">Featured Article</span>
                    <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                    <span>12 Mins Read</span>
                 </div>
                 <h2 className="text-4xl lg:text-5xl font-medium tracking-tighter mb-6 group-hover:text-neutral-500 transition-colors">{posts[0].title}</h2>
                 <p className="text-neutral-500 text-lg leading-relaxed mb-8">{posts[0].excerpt}</p>
                 <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-neutral-500 hover:border-neutral-300 transition-all">
                    Read Article <Icon icon="lucide:arrow-right" width="16"></Icon>
                 </span>
              </div>
           </Link>
        </div>

        {/* Categories Nav */}
        <div className="flex justify-center gap-8 border-y border-neutral-100 py-6 mb-20 reveal">
           {["All Stories", "Design", "Interiors", "Studio", "Philosophy"].map((cat, i) => (
             <button key={cat} className={`text-xs font-bold uppercase tracking-widest transition-colors ${i === 0 ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-900"}`}>
               {cat}
             </button>
           ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {posts.slice(1).map((post, idx) => (
            <article key={post.id} className="group reveal" style={{ transitionDelay: `${idx * 100}ms` }}>
              <Link href="#" className="block">
                <div className="aspect-[16/10] bg-neutral-100 rounded-xl overflow-hidden mb-6">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={post.title} />
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                  <span className="text-neutral-900">{post.category}</span>
                </div>
                <h3 className="text-2xl font-medium tracking-tight mb-4 group-hover:text-neutral-500 transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-opacity group-hover:opacity-60">
                  Read More <Icon icon="lucide:plus" width="14"></Icon>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Newsletter In-feed */}
        <div className="mt-32 p-12 lg:p-20 bg-neutral-50 rounded-3xl text-center reveal">
           <h3 className="text-3xl font-medium tracking-tighter mb-4">Inbox Inspiration</h3>
           <p className="text-neutral-500 mb-10 max-w-sm mx-auto text-sm">Join 12,000+ readers who receive our weekly curation of design and craftsmanship.</p>
           <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="email@address.com" 
                className="flex-1 bg-white border border-neutral-200 px-6 py-4 rounded-xl text-sm outline-none focus:border-neutral-900 transition-colors"
              />
              <button className="bg-neutral-900 text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all">
                Join Us
              </button>
           </form>
        </div>
      </div>
    </div>
  );
}
