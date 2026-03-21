"use client";

import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const SERVICES = [
  {
    title: "Skin Analysis",
    desc: "A personalized evaluation of your skin type and concerns using professional diagnostic tools.",
    duration: "30 min",
    icon: "solar:scanning-linear",
    color: "bg-anashe-mint"
  },
  {
    title: "Ritual Design",
    desc: "We build a bespoke 10-step or simplified Korean skincare routine tailored to your goals.",
    duration: "45 min",
    icon: "solar:magic-stick-linear",
    color: "bg-anashe-lila"
  },
  {
    title: "Product Concierge",
    desc: "Exclusive access to rare K-Beauty launches and early bird pre-orders for our VIP members.",
    duration: "Ongoing",
    icon: "solar:crown-linear",
    color: "bg-anashe-peach"
  },
  {
    title: "Facial Therapy",
    desc: "Guided virtual or in-person sessions focused on facial massage and lymphatic drainage.",
    duration: "60 min",
    icon: "solar:cosmetic-linear",
    color: "bg-anashe-pink"
  }
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-anashe-bg font-poppins selection:bg-anashe-mint selection:text-anashe-bg">
      <Navbar />
      
      {/* Hero Header */}
      <section className="pt-40 pb-24 px-8 lg:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-anashe-mint/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 text-xs tracking-[0.3em] uppercase text-anashe-mint font-normal mb-8">
              <Icon icon="solar:medal-ribbon-bold-duotone" /> Concierge & Services
            </div>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white mb-8">
              Expert Guidance for <br />
              <em className="text-anashe-mint not-italic font-light italic">Your Journey</em>
            </h1>
            <p className="text-sm md:text-base text-white/50 font-light max-w-2xl mx-auto leading-relaxed mb-12">
              Beyond products, we offer personalized expertise to ensure your skincare journey is as effective as it is enjoyable. Discover our range of specialized services.
            </p>
            
            <button className="px-10 py-4 bg-white text-anashe-bg text-[10px] font-normal tracking-[0.2em] uppercase rounded-full hover:bg-anashe-mint transition-all duration-300 shadow-xl shadow-anashe-mint/10">
              Book a Consultation
            </button>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-32 px-8 lg:px-20 relative">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-[#252726]/40 backdrop-blur-md border border-white/5 rounded-3xl p-10 hover:bg-[#252726]/80 hover:border-anashe-mint/30 transition-all duration-500 flex items-start gap-8 shadow-2xl"
            >
              <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center text-anashe-bg text-3xl transition-transform duration-500 group-hover:scale-110 shadow-lg`}>
                <Icon icon={service.icon} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-light text-white group-hover:text-anashe-mint transition-colors">
                    {service.title}
                  </h3>
                  <span className="text-[10px] tracking-widest uppercase text-white/20 font-normal py-1 px-3 border border-white/5 rounded-full">
                    {service.duration}
                  </span>
                </div>
                
                <p className="text-sm text-white/40 font-light leading-relaxed mb-8">
                  {service.desc}
                </p>
                
                <button className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/50 hover:text-white transition-colors group/btn">
                  Learn more <Icon icon="solar:arrow-right-linear" className="transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-24 px-8 lg:px-20 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto bg-gradient-to-br from-[#2a2c2b] to-[#1e201f] rounded-[40px] p-12 lg:p-20 text-center border border-white/5 relative z-10">
          <Icon icon="solar:heart-bold-duotone" className="text-5xl text-anashe-pink mb-8 mx-auto opacity-50" />
          <h2 className="text-3xl md:text-5xl font-extralight text-white mb-8 tracking-tight">Need a Personalized <br /> <em className="text-anashe-mint not-italic italic font-light">Skin Experience?</em></h2>
          <p className="text-white/40 font-light max-w-xl mx-auto mb-12">Our specialists are available for virtual consultations to help you navigate through the vast world of Korean Skincare.</p>
          <button className="flex items-center gap-4 mx-auto px-8 py-4 rounded-full border border-anashe-mint/30 text-anashe-mint text-[10px] tracking-widest uppercase hover:bg-anashe-mint hover:text-anashe-bg transition-all duration-500">
            <Icon icon="logos:whatsapp-icon" className="text-xl" /> Chat with an Expert
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
