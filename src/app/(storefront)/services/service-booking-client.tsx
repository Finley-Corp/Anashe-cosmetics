'use client';

import { useState } from 'react';
import { ArrowRight, CalendarClock, CheckCircle2, Sparkles } from 'lucide-react';
import { useToast } from '@/components/shared/Toaster';

type ServiceOption = {
  value: string;
  label: string;
  description?: string | null;
};

const SERVICE_IMAGES = [
  {
    src: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/78b8ccf4-c71d-492e-899e-a07e5abe80af_1600w.webp',
    alt: 'Beauty consultation setup',
  },
  {
    src: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/60c16a86-4fb2-407f-8613-cd6e54d56279_800w.jpg',
    alt: 'Skincare products and routine planning',
  },
  {
    src: 'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/d0d56af9-392a-423a-8b47-6e0510422d1d_800w.webp',
    alt: 'Client beauty session in progress',
  },
];

export function ServiceBookingClient({ serviceOptions }: { serviceOptions: ServiceOption[] }) {
  const { add: showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    service_type: serviceOptions[0]?.value ?? '',
    preferred_date: '',
    preferred_time: '',
    notes: '',
  });
  const [feedbackForm, setFeedbackForm] = useState({
    full_name: '',
    email: '',
    rating: 5,
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/services/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        smsSent?: boolean;
        smsSkipped?: boolean;
        smsError?: string | null;
      };
      if (!res.ok) {
        throw new Error(payload.error ?? 'Failed to submit booking request');
      }
      showToast('Booking request submitted. We will contact you shortly.');
      if (!payload.smsSent) {
        showToast(
          payload.smsSkipped
            ? 'Booking saved, but SMS is not configured yet.'
            : `Booking saved, but SMS delivery failed${payload.smsError ? `: ${payload.smsError}` : '.'}`,
          'info'
        );
      }
      setForm({
        full_name: '',
        email: '',
        phone: '',
        service_type: serviceOptions[0]?.value ?? '',
        preferred_date: '',
        preferred_time: '',
        notes: '',
      });
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to submit booking request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    try {
      const res = await fetch('/api/services/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackForm),
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(payload.error ?? 'Failed to submit feedback');
      }
      showToast('Thank you! Your feedback has been submitted.');
      setFeedbackForm({
        full_name: '',
        email: '',
        rating: 5,
        message: '',
      });
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to submit feedback', 'error');
    } finally {
      setIsSubmittingFeedback(false);
    }
  }

  return (
    <div className="bg-white text-neutral-900">
      <section className="border-b border-neutral-200 bg-gradient-to-b from-white to-[var(--accent)]/35">
        <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
            Services
          </span>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-tight text-neutral-900 md:text-7xl">
            Personal beauty services built around your routine.
          </h1>
          <div className="mt-10 flex flex-col gap-5 border-t border-neutral-200 pt-8 text-sm text-neutral-600 md:flex-row md:items-end md:justify-between">
            <p className="max-w-2xl leading-relaxed">
              From skincare diagnostics to event-ready planning, our sessions are designed to give you practical
              guidance you can use immediately.
            </p>
            <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">Mon - Sat · 8:00am - 8:00pm EAT</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {SERVICE_IMAGES.map((image, idx) => (
            <div
              key={image.src}
              className={`overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 ${
                idx === 0 ? 'md:col-span-2' : 'md:col-span-1'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                className="h-64 w-full object-cover md:h-72"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className="mb-10 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-5xl">What we offer</h2>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-neutral-200 md:grid-cols-2">
          {serviceOptions.map((service) => (
            <article key={service.value} className="group bg-white p-8 md:p-10">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold text-neutral-900">{service.label}</h3>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-500">
                {service.description ?? 'Personalized beauty guidance tailored to your goals and routine.'}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-16 md:px-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">How it works</h2>
              <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--primary)]" />
                  Submit your preferred service and ideal schedule.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--primary)]" />
                  We confirm availability and session format within 24 hours.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--primary)]" />
                  You get a personalized prep brief before your appointment.
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                <CalendarClock className="h-4 w-4 text-[var(--primary)]" />
                Support Hours
              </p>
              <p className="mt-2 text-sm text-neutral-600">Monday - Saturday, 8:00am to 8:00pm (EAT)</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 lg:col-span-2">
            <h3 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900">Book your session</h3>
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
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Phone</span>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="h-11 w-full rounded-none border border-neutral-300 px-3 text-sm outline-none transition-colors focus:border-neutral-900"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Service</span>
                <select
                  value={form.service_type}
                  onChange={(e) => setForm((prev) => ({ ...prev, service_type: e.target.value }))}
                  className="h-11 w-full rounded-none border border-neutral-300 bg-white px-3 text-sm outline-none transition-colors focus:border-neutral-900"
                >
                  {serviceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Preferred Date</span>
                <input
                  type="date"
                  required
                  value={form.preferred_date}
                  onChange={(e) => setForm((prev) => ({ ...prev, preferred_date: e.target.value }))}
                  className="h-11 w-full rounded-none border border-neutral-300 px-3 text-sm outline-none transition-colors focus:border-neutral-900"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Preferred Time</span>
                <input
                  type="time"
                  required
                  value={form.preferred_time}
                  onChange={(e) => setForm((prev) => ({ ...prev, preferred_time: e.target.value }))}
                  className="h-11 w-full rounded-none border border-neutral-300 px-3 text-sm outline-none transition-colors focus:border-neutral-900"
                />
              </label>
            </div>
            <label className="mt-4 block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Notes (Optional)</span>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                rows={4}
                placeholder="Share your goals, concerns, or preferred consultation format."
                className="w-full rounded-none border border-neutral-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900"
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex h-11 items-center rounded-full bg-[var(--primary)] px-7 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Book Service'}
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">Service Feedback</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
              Tell us how your service experience went so we can keep improving consultation quality and support.
            </p>
          </div>
          <form onSubmit={handleFeedbackSubmit} className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Full Name</span>
                <input
                  type="text"
                  required
                  value={feedbackForm.full_name}
                  onChange={(e) => setFeedbackForm((prev) => ({ ...prev, full_name: e.target.value }))}
                  className="h-11 w-full rounded-none border border-neutral-300 px-3 text-sm outline-none transition-colors focus:border-neutral-900"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Email</span>
                <input
                  type="email"
                  required
                  value={feedbackForm.email}
                  onChange={(e) => setFeedbackForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="h-11 w-full rounded-none border border-neutral-300 px-3 text-sm outline-none transition-colors focus:border-neutral-900"
                />
              </label>
            </div>
            <label className="mt-4 block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Rating</span>
              <select
                value={feedbackForm.rating}
                onChange={(e) => setFeedbackForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                className="h-11 w-full rounded-none border border-neutral-300 bg-white px-3 text-sm outline-none transition-colors focus:border-neutral-900"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} star{rating > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Feedback</span>
              <textarea
                required
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm((prev) => ({ ...prev, message: e.target.value }))}
                rows={4}
                placeholder="Share what worked well and what we should improve."
                className="w-full rounded-none border border-neutral-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-neutral-900"
              />
            </label>
            <button
              type="submit"
              disabled={isSubmittingFeedback}
              className="mt-6 inline-flex h-11 items-center rounded-full bg-[var(--primary)] px-7 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
