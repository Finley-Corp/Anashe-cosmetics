"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

const posts = [
  {
    id: 1,
    title: "Building a barrier-friendly routine",
    category: "Skincare",
    date: "Oct 12, 2023",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2070&auto=format&fit=crop",
    excerpt: "How to layer serums, moisturizers, and SPF without overwhelming your skin—especially when you are prone to sensitivity."
  },
  {
    id: 2,
    title: "Makeup that lets skin breathe",
    category: "Beauty",
    date: "Sep 28, 2023",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1987&auto=format&fit=crop",
    excerpt: "Choosing finishes and coverage levels that complement your skincare, from sheer tint to full glam."
  },
  {
    id: 3,
    title: "Inside our lab",
    category: "Studio",
    date: "Sep 15, 2023",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4e571?q=80&w=2070&auto=format&fit=crop",
    excerpt: "A look at how we stability-test formulas and why small batches help us keep quality consistent."
  },
  {
    id: 4,
    title: "Conscious packaging",
    category: "Philosophy",
    date: "Aug 30, 2023",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    excerpt: "Our approach to refills, recyclability, and reducing waste across the ANASHE line."
  }
];

export default function BlogPage() {
  const [blogNewsletterDone, setBlogNewsletterDone] = useState(false);

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 reveal">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-4 block">The Journal</span>
          <h1 className="text-4xl lg:text-6xl font-medium tracking-tighter mb-6">Skincare, makeup & ritual</h1>
          <p className="text-neutral-500 text-lg leading-relaxed">
            Guides, ingredient explainers, and stories from the people who formulate
            and wear ANASHE every day.
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
           {["All Stories", "Skincare", "Beauty", "Studio", "Philosophy"].map((cat, i) => (
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
           <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                if (String(fd.get("email") ?? "").trim()) setBlogNewsletterDone(true);
              }}
            >
              <input
                name="email"
                type="email"
                required
                disabled={blogNewsletterDone}
                placeholder="email@address.com"
                className="flex-1 bg-white border border-neutral-200 px-6 py-4 rounded-xl text-sm outline-none focus:border-neutral-900 transition-colors disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={blogNewsletterDone}
                className="bg-neutral-900 text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:opacity-60"
              >
                {blogNewsletterDone ? "You’re in" : "Join Us"}
              </button>
           </form>
        </div>
      </div>
    </div>
  );
}
