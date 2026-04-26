'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/shared/Toaster';

export default function ServicesFeedbackPage() {
  const { add: showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    rating: 5,
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/services/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(payload.error ?? 'Failed to submit feedback');
      }
      showToast('Thank you! Your feedback has been submitted.');
      setForm({
        full_name: '',
        email: '',
        rating: 5,
        message: '',
      });
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to submit feedback', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[920px] px-4 py-16 md:px-6">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to services
      </Link>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 font-[family-name:var(--font-display)]">
          Service Feedback
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Tell us how your service experience went so we can keep improving consultation quality and support.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Full Name</span>
              <input
                type="text"
                required
                value={form.full_name}
                onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                className="h-11 w-full rounded-none border border-neutral-300 px-3 text-sm outline-none transition-colors focus:border-neutral-900"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="h-11 w-full rounded-none border border-neutral-300 px-3 text-sm outline-none transition-colors focus:border-neutral-900"
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Rating</span>
            <select
              value={form.rating}
              onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
              className="h-11 w-full rounded-none border border-neutral-300 bg-white px-3 text-sm outline-none transition-colors focus:border-neutral-900"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} star{rating > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Feedback</span>
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              rows={5}
              placeholder="Share what worked well and what we should improve."
              className="w-full rounded-none border border-neutral-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center rounded-full bg-[var(--primary)] px-7 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}
