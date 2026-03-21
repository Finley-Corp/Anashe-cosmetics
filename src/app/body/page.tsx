"use client";

import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function BodyPage() {
  return (
    <main className="min-h-screen bg-anashe-bg font-poppins selection:bg-anashe-pink selection:text-anashe-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8 lg:px-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(241,189,200,0.05)_0%,transparent_50%)] pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 text-xs tracking-[0.3em] uppercase text-anashe-pink font-normal mb-6">
              <Icon icon="solar:double-alt-arrow-right-bold-duotone" /> Body Wellness
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tighter text-white mb-8">
              Every Inch of You <br />
              <em className="text-anashe-pink not-italic italic font-light">Deserves Care</em>
            </h1>
            <p className="text-base text-white/50 font-light max-w-2xl mx-auto leading-relaxed mb-12">
              Extend your skincare ritual beyond the face. Our body collection focuses on deep hydration, skin texture refinement, and sensory experiences that turn routine into ritual.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon / curated grid placeholder */}
      <section className="py-20 px-8 lg:px-20 relative">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-3xl overflow-hidden border border-white/5"
            >
              <img 
                src="https://imagedelivery.net/6HwnxsMACp9LGRV7S6ZRBA/luno.ao/2025/02/cuidados-do-corpo-luno-ao.jpg/w=800,q=85" 
                alt="Body Care Ritual"
                className="w-full h-full object-cover grayscale opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-anashe-bg/40 backdrop-blur-sm">
                <div className="text-center p-8">
                  <Icon icon="solar:palet-linear" className="text-4xl text-anashe-pink mb-4 mx-auto" />
                  <h3 className="text-xl font-light text-white mb-2">Coming Soon</h3>
                  <p className="text-xs text-white/40 font-light">Our exclusive body care line is arriving in Spring 2026.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              {[
                { title: "Hydration", desc: "Long-lasting moisture that absorbs instantly without residue.", icon: "solar:water-drops-linear" },
                { title: "Renewal", desc: "Exfoliating treatments that reveal smoother, brighter skin.", icon: "solar:star-linear" },
                { title: "Calm", desc: "Botanical extracts to soothe and repair the skin barrier.", icon: "solar:leaf-linear" }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-anashe-pink flex-shrink-0 group-hover:bg-anashe-pink group-hover:text-anashe-bg transition-all duration-500">
                    <Icon icon={item.icon} className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="text-white font-light text-lg mb-2">{item.title}</h4>
                    <p className="text-sm text-white/40 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Body Brands */}
      <section className="py-32 px-8 lg:px-20 bg-[#1a1b1a] border-y border-white/5">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <div className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-4 font-normal">Expert Collaborations</div>
            <h2 className="text-2xl md:text-4xl font-extralight text-white tracking-tight">Body Care Specialists</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <span className="text-2xl font-extralight tracking-widest text-white uppercase italic">Anua</span>
            <span className="text-2xl font-extralight tracking-widest text-white uppercase">Skin1004</span>
            <span className="text-2xl font-extralight tracking-widest text-white uppercase italic">Purito</span>
            <span className="text-2xl font-extralight tracking-widest text-white uppercase">Abib</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
