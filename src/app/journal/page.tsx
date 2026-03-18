import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JOURNAL_POSTS } from "@/lib/journal";

export default function JournalPage() {
  const [featured, ...posts] = JOURNAL_POSTS;

  return (
    <main className="min-h-screen relative overflow-hidden bg-neutral-950 text-white">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/10 via-neutral-950/0 to-transparent" />
      </div>

      <section className="relative border-b border-white/10">
        <Header />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pb-12 pt-6 sm:pb-16 sm:pt-10">
          <p className="uppercase tracking-[0.18em] text-xs text-white/60 font-sans">ANASHE Journal</p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bricolage font-semibold tracking-tighter leading-[1.05] max-w-3xl">
            Notes on skin science, rituals, and ingredient intelligence.
          </h1>
          <p className="mt-4 max-w-2xl text-white/80 font-sans text-base sm:text-lg">
            Curated reads to help you build better routines with confidence.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-10 sm:py-14">
        <article className="rounded-3xl overflow-hidden border-gradient before:rounded-3xl bg-white/[0.03]" style={{ backdropFilter: "blur(6px) saturate(1.1)" }}>
          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-7 h-72 sm:h-96">
              <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
            </div>
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-emerald-200 font-sans">{featured.category}</p>
                <h2 className="mt-3 text-3xl font-bricolage font-semibold tracking-tight leading-tight">{featured.title}</h2>
                <p className="mt-3 text-white/75 text-sm sm:text-base font-sans">{featured.excerpt}</p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 text-xs text-white/60 font-sans">
                  <Clock3 className="h-3.5 w-3.5" />
                  {featured.readTime}
                </span>
                <Link href={`/journal/${featured.slug}`} className="inline-flex items-center gap-2 rounded-2xl bg-white text-neutral-900 px-4 py-2.5 text-sm font-medium hover:bg-white/90 transition font-sans">
                  Read Article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 pb-12 sm:pb-16">
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {posts.map((post) => (
            <article
              key={post.title}
              className="rounded-3xl overflow-hidden border-gradient before:rounded-3xl bg-white/[0.03]"
              style={{ backdropFilter: "blur(6px) saturate(1.1)" }}
            >
              <div className="h-56 overflow-hidden border-b border-white/10">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-emerald-200 font-sans">{post.category}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/60 font-sans">
                    <Clock3 className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-bricolage font-semibold tracking-tight leading-tight">{post.title}</h3>

                <Link href={`/journal/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition font-sans">
                  Continue Reading
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}