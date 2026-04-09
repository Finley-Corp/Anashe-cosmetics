"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

const inquiryTypes = [
  "Customer Support",
  "Design Services",
  "Wholesale",
  "Press"
];

const faqs = [
  {
    question: "What are your shipping times?",
    answer: "Our standard shipping takes 3-5 business days for domestic orders and 7-14 business days for international orders."
  },
  {
    question: "Do you offer trade discounts?",
    answer: "Yes, we offer exclusive pricing and dedicated support for architects and interior designers. Please choose 'Wholesale' in the inquiry type above for more details."
  }
];

export default function ContactPage() {
  const [activeInquiry, setActiveInquiry] = useState("Customer Support");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Title Section */}
        <section className="max-w-3xl mb-16 reveal">
          <h1 className="text-5xl lg:text-6xl font-medium tracking-tighter mb-8 text-black">Get in touch</h1>
          <p className="text-neutral-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
            Have a question about an order, our products, or just want to say hello? 
            Our team is here to assist you Mon-Fri, 9am-5pm EST.
          </p>
        </section>

        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left: Form Column */}
          <div className="flex-1 reveal">
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              {/* Inquiry Type */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Inquiry Type</label>
                <div className="flex flex-wrap gap-3">
                  {inquiryTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setActiveInquiry(type)}
                      className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border ${
                        activeInquiry === type
                          ? "bg-black text-white border-black shadow-lg shadow-black/10"
                          : "bg-white text-neutral-500 border-neutral-100 hover:border-black hover:text-black"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">First Name</label>
                  <input type="text" placeholder="Jane" className="w-full h-14 bg-neutral-50 border border-neutral-100 rounded-lg px-6 text-sm font-medium outline-none focus:border-black transition-colors" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Last Name</label>
                  <input type="text" placeholder="Doe" className="w-full h-14 bg-neutral-50 border border-neutral-100 rounded-lg px-6 text-sm font-medium outline-none focus:border-black transition-colors" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Email Address</label>
                <input type="email" placeholder="jane@example.com" className="w-full h-14 bg-neutral-50 border border-neutral-100 rounded-lg px-6 text-sm font-medium outline-none focus:border-black transition-colors" />
              </div>

              {/* Order Number (Optional) */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Order Number (Optional)</label>
                <input type="text" placeholder="#ANASHE-12345" className="w-full h-14 bg-neutral-50 border border-neutral-100 rounded-lg px-6 text-sm font-medium outline-none focus:border-black transition-colors" />
              </div>

              {/* Message */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Message</label>
                <textarea rows={6} placeholder="How can we help you today?" className="w-full bg-neutral-50 border border-neutral-100 rounded-lg p-6 text-sm font-medium outline-none focus:border-black transition-colors resize-none"></textarea>
              </div>

              <button className="h-14 bg-black text-white px-10 rounded-lg font-bold hover:bg-neutral-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group">
                Send Message <Icon icon="lucide:arrow-right" width="18" className="group-hover:translate-x-1 transition-transform"></Icon>
              </button>
            </form>
          </div>

          {/* Right: Info Column */}
          <div className="lg:w-[420px] space-y-12 reveal">
            {/* Headquarters Card */}
            <div className="p-8 md:p-10 bg-neutral-50 border border-neutral-100 rounded-3xl space-y-10">
              <h3 className="text-xl font-medium tracking-tighter text-black">Headquarters</h3>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 flex-shrink-0">
                    <Icon icon="lucide:map-pin" width="18"></Icon>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-black mb-1">ANASHE Studio</h4>
                    <p className="text-sm text-neutral-500 font-medium">109 Wooster St, SoHo<br />New York, NY 10012</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 flex-shrink-0">
                    <Icon icon="lucide:mail" width="18"></Icon>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-black mb-1">Email</h4>
                    <p className="text-sm text-neutral-500 font-medium underline">hello@anashe.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 flex-shrink-0">
                    <Icon icon="lucide:phone" width="18"></Icon>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-black mb-1">Phone</h4>
                    <p className="text-sm text-neutral-500 font-medium">+1 (212) 555-0199</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-neutral-200">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest leading-loose">
                  <span className="text-neutral-400">Mon - Fri</span>
                  <span className="text-black">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest leading-loose">
                  <span className="text-neutral-400">Sat - Sun</span>
                  <span className="text-black">11:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>

            {/* Map Placeholder Image */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden grayscale brightness-95 contrast-110 border border-neutral-100 shadow-sm group cursor-pointer hover:grayscale-0 transition-all duration-700">
              <img 
                src="https://images.unsplash.com/photo-1577086664693-894d8405334a?q=80&w=2574&auto=format&fit=crop" 
                alt="Wooster Street Location" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-2 rounded shadow-sm text-[10px] font-bold text-black tracking-widest flex items-center gap-2">
                 <Icon icon="lucide:map" width="14"></Icon> VIEW ON MAP
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-6 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6 px-1">Common Questions</h3>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white border border-neutral-100 rounded-xl overflow-hidden transition-all duration-300">
                    <button 
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 flex items-center justify-between text-[13px] font-bold text-black hover:bg-neutral-50 transition-colors"
                    >
                      {faq.question}
                      <Icon 
                        icon="lucide:chevron-down" 
                        width="18" 
                        className={`text-neutral-300 transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`}
                      ></Icon>
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-5 text-sm text-neutral-500 font-medium leading-relaxed animate-fade-in-up">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
