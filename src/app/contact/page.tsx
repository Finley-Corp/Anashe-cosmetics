import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import ContactForm from "./ContactForm";
import { Icon } from "@iconify/react";

export const metadata: Metadata = {
  title: "Contact | Anashe",
  description: "Get in touch with the Anashe team — we'd love to hear from you.",
};

const INFO = [
  {
    icon: "lucide:map-pin",
    title: "Our Atelier",
    lines: ["Strandvägen 14", "114 56 Stockholm, Sweden"],
  },
  {
    icon: "lucide:mail",
    title: "Email Us",
    lines: ["hello@anashe.studio", "press@anashe.studio"],
  },
  {
    icon: "lucide:phone",
    title: "Call Us",
    lines: ["+46 8 123 456 78", "Mon – Fri, 9am – 6pm CET"],
  },
  {
    icon: "lucide:clock",
    title: "Atelier Hours",
    lines: ["Tue – Sat: 10am – 7pm", "By appointment on Sundays"],
  },
];

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 5–10 business days. Furniture items are shipped via white-glove delivery and typically arrive within 2–4 weeks.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes — we ship to over 40 countries. Shipping rates and timelines are calculated at checkout based on your location.",
  },
  {
    q: "What is your return policy?",
    a: "We accept returns within 30 days of delivery for unused items in original packaging. Custom orders are non-refundable.",
  },
  {
    q: "Do you offer trade or designer pricing?",
    a: "Yes. We have a dedicated trade program for interior designers and architects. Apply through our trade portal or email trade@anashe.studio.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* Page Header */}
        <div className="max-w-[1440px] mx-auto px-6 pt-16 pb-12 border-b border-neutral-100">
          <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase block mb-4">
            Get In Touch
          </span>
          <h1 className="text-5xl lg:text-6xl font-medium tracking-tighter leading-[0.95]">
            We&apos;d love to hear<br />
            <span className="text-neutral-400">from you.</span>
          </h1>
        </div>

        {/* Main Grid */}
        <div className="max-w-[1440px] mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-5 gap-16 lg:gap-24">

            {/* Left: Info */}
            <div className="lg:col-span-2 space-y-10">
              {INFO.map((item) => (
                <div key={item.title} className="reveal">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <Icon icon={item.icon} width={18} />
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-900">{item.title}</h3>
                  </div>
                  <div className="pl-12 space-y-0.5">
                    {item.lines.map((line) => (
                      <p key={line} className="text-sm text-neutral-500">{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div className="reveal mt-8">
                <div className="w-full h-52 rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden relative">
                  {/* Stylised map placeholder */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-400">
                    <Icon icon="lucide:map" width={32} />
                    <p className="text-xs font-medium">Stockholm, Sweden</p>
                    <a
                      href="https://maps.google.com/?q=Strandvägen+14,+Stockholm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                  {/* Decorative grid */}
                  <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#000" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3 reveal delay-100">
              <div className="bg-white border border-neutral-100 rounded-2xl p-8 lg:p-12 shadow-sm">
                <h2 className="text-2xl font-medium tracking-tight mb-2">Send a message</h2>
                <p className="text-sm text-neutral-500 mb-8">
                  We typically respond within one business day.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-neutral-50 border-t border-neutral-100 py-20 lg:py-32">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-14 reveal">
                <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase block mb-4">
                  Quick Answers
                </span>
                <h2 className="text-3xl font-medium tracking-tighter">
                  Frequently asked questions
                </h2>
              </div>
              <div className="space-y-4">
                {FAQS.map((faq, i) => (
                  <div
                    key={faq.q}
                    className={`bg-white border border-neutral-100 rounded-xl p-6 reveal ${i > 0 ? `delay-${Math.min(i * 100, 300)}` : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon icon="lucide:help-circle" width={13} className="text-neutral-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900 mb-2">{faq.q}</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
