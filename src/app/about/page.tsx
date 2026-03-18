import Link from "next/link";
import { Leaf, FlaskConical, HeartHandshake, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const pillars = [
  {
    title: "Botanical Intelligence",
    description:
      "We source resilient plant actives from climates that demand adaptation, then preserve their integrity through low-heat extraction.",
    icon: Leaf,
  },
  {
    title: "Clinical Precision",
    description:
      "Every formula is benchmarked for tolerance and visible performance, balancing efficacy with skin-barrier respect.",
    icon: FlaskConical,
  },
  {
    title: "Human Ritual",
    description:
      "Skincare should fit real lives. We design routines that are clear, calming, and sustainable over time.",
    icon: HeartHandshake,
  },
];

const milestones = [
  {
    year: "2021",
    title: "The First Lab Notes",
    detail: "ANASHE began as a small formulation notebook focused on repairing stressed, urban skin.",
  },
  {
    year: "2023",
    title: "Pilot Community Trials",
    detail: "A tight community of early adopters helped refine textures, absorption, and routine simplicity.",
  },
  {
    year: "2025",
    title: "Clinical Validation",
    detail: "Independent panel testing confirmed measurable improvements in hydration and barrier resilience.",
  },
  {
    year: "2026",
    title: "ANASHE Today",
    detail: "A full ritual collection crafted for people who want results without compromising skin comfort.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-neutral-950 text-white">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-300/10 via-transparent to-transparent" />
      </div>

      <section className="relative border-b border-white/10">
        <Header />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-8 pb-14 sm:pt-12 sm:pb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans">About ANASHE</p>
          <h1 className="mt-4 max-w-4xl text-4xl sm:text-5xl lg:text-7xl leading-[1.02] font-bricolage font-semibold tracking-tighter">
            We build skincare that feels like a quiet luxury and performs like a clinical tool.
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-white/80 font-sans leading-relaxed">
            ANASHE was created for people who want proven results without aggressive routines. Our formulas pair potent botanical systems with dermal science to support stronger, calmer skin over time.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                className="rounded-3xl border-gradient before:rounded-3xl bg-white/[0.03] p-6"
                style={{ backdropFilter: "blur(6px) saturate(1.15)" }}
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 border-gradient before:rounded-2xl">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h2 className="mt-4 text-2xl font-bricolage font-semibold tracking-tight">{pillar.title}</h2>
                <p className="mt-3 text-sm text-white/75 leading-relaxed font-sans">{pillar.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-4 sm:py-8">
        <div className="rounded-3xl overflow-hidden border-gradient before:rounded-3xl bg-white/[0.03]" style={{ backdropFilter: "blur(6px) saturate(1.15)" }}>
          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-5 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans">Our Process</p>
              <h3 className="mt-4 text-3xl sm:text-4xl font-bricolage font-semibold tracking-tight leading-tight">
                From raw ingredient to finished ritual.
              </h3>
              <p className="mt-4 text-sm sm:text-base text-white/75 font-sans leading-relaxed">
                We evaluate ingredients for bioavailability, combine them in stability-tested concentrations, and calibrate sensorial feel so every product is both effective and enjoyable to use daily.
              </p>
            </div>

            <div className="lg:col-span-7 p-8 sm:p-10">
              <ul className="space-y-5">
                {milestones.map((item) => (
                  <li key={item.year} className="grid grid-cols-[70px_1fr] gap-4 sm:gap-6 items-start">
                    <span className="text-sm text-white/50 font-sans mt-1">{item.year}</span>
                    <div>
                      <p className="text-xl font-bricolage font-medium tracking-tight">{item.title}</p>
                      <p className="mt-1.5 text-sm text-white/75 font-sans leading-relaxed">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 pt-8 pb-12 sm:pb-16">
        <div className="rounded-3xl border-gradient before:rounded-3xl bg-white/[0.03] p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans">Start Your Ritual</p>
            <h4 className="mt-2 text-3xl sm:text-4xl font-bricolage font-semibold tracking-tight">Explore the collection built on this philosophy.</h4>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-neutral-900 px-6 py-3 text-sm font-medium hover:bg-white/90 transition font-sans"
          >
            Shop Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}