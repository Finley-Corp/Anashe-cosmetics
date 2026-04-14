'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-2">Get in Touch</p>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight font-[family-name:var(--font-display)]">We&apos;re here to help</h1>
          <p className="text-neutral-500 mt-3 text-sm">Our team is available Monday–Saturday, 8am–8pm EAT</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-8">
            {[
              { icon: <Phone className="w-5 h-5" />, title: 'Phone / WhatsApp', value: '+254 700 000 000', sub: 'Mon–Sat, 8am–8pm EAT' },
              { icon: <Mail className="w-5 h-5" />, title: 'Email', value: 'hello@anashe.co.ke', sub: 'We reply within 24 hours' },
              { icon: <MapPin className="w-5 h-5" />, title: 'Location', value: 'Nairobi, Kenya', sub: 'Deliveries nationwide' },
            ].map(({ icon, title, value, sub }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center text-green-700 shrink-0">{icon}</div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-0.5">{title}</p>
                  <p className="font-semibold text-neutral-900">{value}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}

            <div className="bg-green-50 rounded-2xl p-5">
              <p className="text-sm font-semibold text-green-800 mb-1">M-Pesa Payment Issues?</p>
              <p className="text-xs text-green-700 leading-relaxed">If you have a payment problem, please have your M-Pesa receipt number ready. We&apos;ll resolve it within 2 business hours.</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2 font-[family-name:var(--font-display)]">Message sent!</h3>
                <p className="text-sm text-neutral-500">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">Name *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0712 345 678" className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">Email *</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">Subject</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors bg-white">
                    <option value="">Select a topic</option>
                    <option>Order Issue</option>
                    <option>M-Pesa Payment Problem</option>
                    <option>Product Enquiry</option>
                    <option>Return / Refund</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors resize-none" />
                </div>
                <button type="submit" className="w-full h-11 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
