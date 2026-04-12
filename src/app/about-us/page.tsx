"use client";

import Link from "next/link";
import Icon from "@/components/Icon";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-6 mb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center reveal">
           <div className="max-w-xl">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-6 block">Our Story</span>
              <h1 className="text-4xl lg:text-7xl font-medium tracking-tighter mb-8 leading-[0.95]">Beauty that <br/><span className="italic text-neutral-400">cares for your skin.</span></h1>
              <p className="text-neutral-500 text-lg leading-relaxed mb-8">
                ANASHE was born from a simple belief: skincare and makeup should be
                honest, effective, and a pleasure to use every day. What began as a
                small formulation lab has grown into a community that values
                transparency, quality ingredients, and results you can see.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-neutral-100">
                 <div>
                    <h4 className="text-3xl font-medium tracking-tighter mb-1">2014</h4>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Founded</p>
                 </div>
                 <div>
                    <h4 className="text-3xl font-medium tracking-tighter mb-1">40+</h4>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Formulas</p>
                 </div>
              </div>
           </div>
           <div className="aspect-square bg-neutral-100 rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4e571?q=80&w=1992&auto=format&fit=crop" className="w-full h-full object-cover grayscale" alt="Our Studio" />
           </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="w-full py-32 bg-neutral-50 border-y border-neutral-100 mb-32">
         <div className="max-w-[1440px] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20 reveal">
               <h2 className="text-4xl font-medium tracking-tighter mb-6">Our Philosophy</h2>
               <p className="text-neutral-500 leading-relaxed">
                  We reject unnecessary fillers and hype. Our formulation approach is
                  rooted in three pillars that guide every product we launch.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
               {[
                 { title: "Efficacy", desc: "Every active is chosen for a reason—at levels that matter, with textures you will actually want to use.", icon: "lucide:flask-conical" },
                 { title: "Sourcing", desc: "We partner with trusted suppliers for botanicals, minerals, and lab-made actives held to high purity standards.", icon: "lucide:leaf" },
                 { title: "Skin first", desc: "Barrier-friendly bases, clear labeling, and options for sensitive skin—because comfort and results go together.", icon: "lucide:heart-pulse" }
               ].map((item, i) => (
                 <div key={i} className="bg-white p-10 rounded-2xl shadow-sm border border-neutral-100 reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-900 mb-6">
                       <Icon icon={item.icon} width="24"></Icon>
                    </div>
                    <h3 className="text-xl font-medium tracking-tight mb-4">{item.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* The Makers */}
      <section className="max-w-[1440px] mx-auto px-6 mb-32">
         <div className="flex flex-col lg:flex-row gap-16 items-center reveal">
            <div className="lg:w-1/2">
               <div className="aspect-[4/5] bg-neutral-100 rounded-3xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1621345100084-5f16e45f9acc?w=800&q=80" className="w-full h-full object-cover" alt="Makers" />
               </div>
            </div>
            <div className="lg:w-1/2 max-w-xl">
               <h2 className="text-4xl lg:text-5xl font-medium tracking-tighter mb-8 leading-tight">Formulated with <br/><span className="text-neutral-400">care and rigor.</span></h2>
               <p className="text-neutral-500 text-lg leading-relaxed mb-8">
                  Our chemists and product developers work with dermatologists and
                  makeup artists to balance performance, safety, and sensorial
                  experience—so your routine feels as good as it looks.
               </p>
               <p className="text-neutral-500 text-lg leading-relaxed mb-10">
                  Small-batch production and strict stability testing mean you get
                  consistent quality in every bottle, compact, and tube we ship.
               </p>
               <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-neutral-500 transition-colors">
                  Read the journal <Icon icon="lucide:arrow-right" width="16"></Icon>
               </Link>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1440px] mx-auto px-6 pb-24 text-center reveal">
         <div className="bg-neutral-900 text-white p-20 rounded-3xl overflow-hidden relative isolate">
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-transparent opacity-20 -z-10"></div>
            <h2 className="text-4xl lg:text-5xl font-medium tracking-tighter mb-8">Ready to elevate your routine?</h2>
            <Link href="/product-listing-page" className="bg-white text-neutral-900 px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-neutral-100 transition-all inline-block">
               Explore the Collection
            </Link>
         </div>
      </section>
    </div>
  );
}
