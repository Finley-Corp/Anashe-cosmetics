'use client';

import { useState } from 'react';
import { CalendarClock, CheckCircle2, Sparkles } from 'lucide-react';
import { useToast } from '@/components/shared/Toaster';

const SERVICE_OPTIONS = [
  { value: 'skin-consultation', label: 'Skin Consultation' },
  { value: 'routine-planning', label: 'Routine Planning Session' },
  { value: 'product-matching', label: 'Product Matching Session' },
  { value: 'bridal-beauty-consult', label: 'Bridal Beauty Consultation' },
];

export function ServiceBookingClient() {
  const { add: showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    service_type: SERVICE_OPTIONS[0].value,
    preferred_date: '',
    preferred_time: '',
    notes: '',
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
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? 'Failed to submit booking request');
      }
      showToast('Booking request submitted. We will contact you shortly.');
      setForm({
        full_name: '',
        email: '',
        phone: '',
        service_type: SERVICE_OPTIONS[0].value,
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

  return (
    <div className="bg-white">
      <section className="border-b border-[var(--primary-100)] bg-[var(--accent)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary-100)] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            <Sparkles className="h-3.5 w-3.5" />
            Services
          </span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Book a service session with Anashe
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-body)]">
            Schedule a one-on-one session for skincare guidance, product matching, or personalized beauty planning.
            Share your preferred date and we will confirm by call or email.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-2xl border border-[var(--primary-100)] bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]">How it works</h2>
            <ul className="mt-4 space-y-3 text-sm text-[var(--text-body)]">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--primary)]" /> Submit your preferred service and timing.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--primary)]" /> Our team confirms availability within 24 hours.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--primary)]" /> Receive your session details and prep notes.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--primary-100)] bg-[var(--accent)] p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <CalendarClock className="h-4 w-4 text-[var(--primary)]" />
              Support Hours
            </p>
            <p className="mt-2 text-sm text-[var(--text-body)]">Monday - Saturday, 8:00am to 8:00pm (EAT)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--primary-100)] bg-white p-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-body)]">Full Name</span>
              <input
                type="text"
                required
                value={form.full_name}
                onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                className="h-11 w-full rounded-lg border border-[var(--primary-100)] px-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-body)]">Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="h-11 w-full rounded-lg border border-[var(--primary-100)] px-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-body)]">Phone</span>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="h-11 w-full rounded-lg border border-[var(--primary-100)] px-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-body)]">Service</span>
              <select
                value={form.service_type}
                onChange={(e) => setForm((prev) => ({ ...prev, service_type: e.target.value }))}
                className="h-11 w-full rounded-lg border border-[var(--primary-100)] bg-white px-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
              >
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-body)]">Preferred Date</span>
              <input
                type="date"
                required
                value={form.preferred_date}
                onChange={(e) => setForm((prev) => ({ ...prev, preferred_date: e.target.value }))}
                className="h-11 w-full rounded-lg border border-[var(--primary-100)] px-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-body)]">Preferred Time</span>
              <input
                type="time"
                required
                value={form.preferred_time}
                onChange={(e) => setForm((prev) => ({ ...prev, preferred_time: e.target.value }))}
                className="h-11 w-full rounded-lg border border-[var(--primary-100)] px-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
              />
            </label>
          </div>
          <label className="mt-4 block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-body)]">Notes (Optional)</span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              rows={4}
              placeholder="Share your goals, concerns, or preferred consultation format."
              className="w-full rounded-lg border border-[var(--primary-100)] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--primary)]"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 inline-flex h-11 items-center rounded-full bg-[var(--primary)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Submitting...' : 'Book Service'}
          </button>
        </form>
      </section>
    </div>
  );
}
