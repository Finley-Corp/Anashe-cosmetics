"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const SUBJECTS = [
  "General Inquiry",
  "Order Support",
  "Trade & Designer Program",
  "Press & Media",
  "Careers",
  "Other",
];

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-neutral-900 flex items-center justify-center">
          <Icon icon="lucide:check" width={24} className="text-white" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight">Message sent!</h3>
        <p className="text-sm text-neutral-500 max-w-xs">
          Thank you for reaching out. We&apos;ll get back to you within one business day.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
          className="mt-4 text-xs font-semibold underline underline-offset-2 text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all bg-neutral-50/50";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Sofia Andersson"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="sofia@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
          Subject
        </label>
        <select
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className={`${inputClass} appearance-none cursor-pointer`}
        >
          <option value="" disabled>Select a topic…</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us how we can help…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 disabled:opacity-60 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neutral-900/10 active:translate-y-0 duration-200"
      >
        {loading ? (
          <>
            <Icon icon="lucide:loader-2" width={16} className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <Icon icon="lucide:send" width={15} />
          </>
        )}
      </button>
    </form>
  );
}
