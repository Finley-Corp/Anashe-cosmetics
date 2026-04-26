'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquareQuote } from 'lucide-react';
import { useToast } from '@/components/shared/Toaster';

type FeedbackFormState = {
  full_name: string;
  role: string;
  message: string;
};

const INITIAL_FORM: FeedbackFormState = {
  full_name: '',
  role: '',
  message: '',
};

export function FeedbackForm() {
  const router = useRouter();
  const { add: showToast } = useToast();
  const [form, setForm] = useState<FeedbackFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/testimonials/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? 'Failed to submit feedback');
      }

      showToast('Thanks for sharing. Your testimonial has been added.');
      setForm(INITIAL_FORM);
      router.push('/home#testimonials');
      router.refresh();
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : 'Failed to submit feedback', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Customer Feedback</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">Tell us about your experience</h1>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">
        Your testimonial helps other clients trust our products and service. It will appear in the homepage testimonials section.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Full Name</span>
          <input
            type="text"
            required
            value={form.full_name}
            onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
            className="h-11 w-full rounded-none border border-neutral-300 px-3 text-sm outline-none transition-colors focus:border-neutral-900"
            placeholder="Jane Wanjiku"
          />
        </label>
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Role / Context</span>
          <input
            type="text"
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
            className="h-11 w-full rounded-none border border-neutral-300 px-3 text-sm outline-none transition-colors focus:border-neutral-900"
            placeholder="Returning Customer"
          />
        </label>
      </div>

      <label className="mt-4 block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Feedback</span>
        <textarea
          required
          minLength={20}
          maxLength={1000}
          value={form.message}
          onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
          rows={6}
          placeholder="Share what you liked and what made your experience great."
          className="w-full rounded-none border border-neutral-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-7 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <MessageSquareQuote className="h-4 w-4" />
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
