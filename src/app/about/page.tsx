import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import RevealObserver from "@/components/RevealObserver";

export const metadata: Metadata = {
  title: "About | Anashe",
  description: "Learn about Anashe's story, philosophy, and the team behind the collection.",
};

const VALUES = [
  {
    icon: "lucide:leaf",
    title: "Sustainability",
    description:
      "Every material is chosen with the planet in mind. We partner with certified suppliers and offset 100% of our shipping emissions.",
  },
  {
    icon: "lucide:hammer",
    title: "Craftsmanship",
    description:
      "Each piece is hand-finished by skilled artisans. We reject mass production in favour of slower, more intentional making.",
  },
  {
    icon: "lucide:infinity",
    title: "Longevity",
    description:
      "We design for decades, not seasons. Our pieces are built to age beautifully and are fully repairable through our service program.",
  },
  {
    icon: "lucide:users",
    title: "Community",
    description:
      "We reinvest 2% of every sale into design education initiatives in the communities where our craftspeople work and live.",
  },
];

const TEAM = [
  {
    name: "Sofia Andersson",
    role: "Founder & Creative Director",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
  },
  {
    name: "Marcus Chen",
    role: "Head of Design",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
  },
  {
    name: "Amara Osei",
    role: "Materials & Sustainability",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
  },
  {
    name: "Leon Kovač",
    role: "Master Craftsman",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
];

const TIMELINE = [
  { year: "2017", event: "Anashe is founded in a small Copenhagen studio with a single lounge chair." },
  { year: "2019", event: "Expanded to a full furniture collection; won the Scandinavian Design Award." },
  { year: "2021", event: "Launched our sustainability charter and carbon-neutral shipping program." },
  { year: "2023", event: "Opened our first flagship atelier in Stockholm, welcoming customers by appointment." },
  { year: "2025", event: "Global expansion — Anashe pieces now ship to over 40 countries worldwide." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Hero */}
        <div className="relative w-full h-[60vh] lg:h-[75vh] overflow-hidden bg-neutral-900">
          <Image
            src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1992&auto=format&fit=crop"
            alt="Anashe Studio"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-start justify-end max-w-[1440px] mx-auto px-6 pb-16 lg:pb-24">
            <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">
              Our Story
            </span>
            <h1 className="text-5xl lg:text-7xl font-medium tracking-tighter text-white leading-[0.95] max-w-3xl">
              Objects made to <br />
              <span className="text-neutral-400">outlast trends.</span>
            </h1>
          </div>
        </div>

        {/* Mission */}
        <section className="max-w-[1440px] mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <div className="reveal">
              <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase block mb-5">
                Why We Exist
              </span>
              <h2 className="text-3xl lg:text-5xl font-medium tracking-tighter leading-tight mb-8">
                Fewer things,<br /> made better.
              </h2>
              <p className="text-neutral-500 leading-relaxed mb-6 text-sm lg:text-base">
                Anashe was born from a frustration with throwaway culture. We
                watched beautiful objects be replaced every season—not because
                they broke, but because the industry demanded it. We set out to
                prove a different path was possible.
              </p>
              <p className="text-neutral-500 leading-relaxed text-sm lg:text-base">
                Every piece in our collection is designed to be the last one
                you&apos;ll ever buy. We use materials that develop character
                with age, and we back every product with a five-year warranty
                and a lifetime repair service.
              </p>
            </div>
            <div className="reveal delay-100 relative h-80 lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80"
                alt="Anashe atelier"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-neutral-50 border-y border-neutral-100 py-20 lg:py-32">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="text-center mb-16 reveal">
              <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase block mb-4">
                What We Stand For
              </span>
              <h2 className="text-3xl lg:text-4xl font-medium tracking-tighter">
                Our values
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {VALUES.map((v, i) => (
                <div
                  key={v.title}
                  className={`reveal bg-white rounded-2xl p-8 border border-neutral-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${i > 0 ? `delay-${i * 100}` : ""}`}
                >
                  <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center mb-5 text-neutral-700">
                    <Icon icon={v.icon} width={22} />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight mb-3">
                    {v.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="max-w-[1440px] mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="reveal">
              <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase block mb-5">
                The Journey
              </span>
              <h2 className="text-3xl lg:text-4xl font-medium tracking-tighter mb-4">
                Built slowly,<br /> on purpose.
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                We&apos;ve resisted the temptation to scale fast. Every year
                brings only a handful of new objects—each one researched,
                tested, and refined before it joins the collection.
              </p>
            </div>
            <div className="space-y-0">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.year}
                  className={`flex gap-6 group reveal ${i > 0 ? `delay-${Math.min(i * 100, 300)}` : ""}`}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-2 border-neutral-200 group-hover:border-neutral-900 bg-white flex items-center justify-center transition-colors shrink-0 z-10">
                      <span className="text-[10px] font-bold text-neutral-500 group-hover:text-neutral-900 transition-colors">
                        {item.year.slice(2)}
                      </span>
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className="w-px flex-1 bg-neutral-100 my-1" />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">
                      {item.year}
                    </p>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {item.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-neutral-50 border-y border-neutral-100 py-20 lg:py-32">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="mb-12 reveal">
              <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase block mb-4">
                The People
              </span>
              <h2 className="text-3xl lg:text-4xl font-medium tracking-tighter">
                Meet the team
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {TEAM.map((member, i) => (
                <div
                  key={member.name}
                  className={`group reveal ${i > 0 ? `delay-${Math.min(i * 100, 300)}` : ""}`}
                >
                  <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-neutral-200 mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[1440px] mx-auto px-6 py-20 lg:py-32 text-center reveal">
          <h2 className="text-3xl lg:text-5xl font-medium tracking-tighter mb-6">
            Ready to find your piece?
          </h2>
          <p className="text-neutral-500 text-sm mb-10 max-w-md mx-auto">
            Every object in our collection is waiting to become part of your story.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-12 px-10 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neutral-900/10 transition-all duration-300 gap-2"
          >
            Browse the Collection
            <Icon icon="lucide:arrow-right" width={16} />
          </Link>
        </section>

        <Newsletter />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
