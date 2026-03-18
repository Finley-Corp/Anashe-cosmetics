import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JOURNAL_POSTS } from "@/lib/journal";

export function generateStaticParams() {
  return JOURNAL_POSTS.map((post) => ({ slug: post.slug }));
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = JOURNAL_POSTS.find((entry) => entry.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-neutral-950 text-white">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/10 via-neutral-950/0 to-transparent" />
      </div>

      <section className="relative border-b border-white/10">
        <Header />
      </section>

      <article className="mx-auto max-w-4xl px-6 lg:px-10 pt-10 pb-16 sm:pt-14 sm:pb-20">
        <Link href="/journal" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition font-sans">
          <ArrowLeft className="h-4 w-4" />
          Back to Journal
        </Link>

        <p className="mt-6 text-xs uppercase tracking-[0.14em] text-emerald-200 font-sans">{post.category}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bricolage font-semibold tracking-tighter leading-[1.08]">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/65 font-sans">
          <span>{post.author}</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>{post.publishedAt}</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>

        <div className="mt-8 rounded-3xl overflow-hidden border border-white/10">
          <img src={post.image} alt={post.title} className="w-full h-[340px] sm:h-[460px] object-cover" />
        </div>

        <p className="mt-8 text-lg text-white/80 leading-relaxed font-sans">{post.excerpt}</p>

        <div className="mt-8 space-y-5">
          {post.content.map((paragraph) => (
            <p key={paragraph} className="text-white/80 leading-relaxed font-sans">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      <Footer />
    </main>
  );
}
