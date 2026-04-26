'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarClock, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/shared/Toaster';
import { ImageCarouselHero } from '@/components/ui/ai-image-generator-hero';
import { Gallery4, type Gallery4Props } from '@/components/blocks/gallery4';

type ServiceOption = {
  value: string;
  label: string;
  description?: string | null;
};

const SERVICE_IMAGES = [
  { id: '1', src: '/services/service-1.jpg', alt: 'Service image 1', rotation: -10 },
  { id: '2', src: '/services/service-2.jpg', alt: 'Service image 2', rotation: 8 },
  { id: '3', src: '/services/service-3.jpg', alt: 'Service image 3', rotation: -6 },
  { id: '4', src: '/services/service-4.jpg', alt: 'Service image 4', rotation: 7 },
  { id: '5', src: '/services/service-5.jpg', alt: 'Service image 5', rotation: -8 },
  { id: '6', src: '/services/service-6.jpg', alt: 'Service image 6', rotation: 6 },
  { id: '7', src: '/services/service-7.jpg', alt: 'Service image 7', rotation: -5 },
  { id: '8', src: '/services/service-8.jpg', alt: 'Service image 8', rotation: 9 },
];

const HERO_FEATURES = [
  {
    title: 'Personalized Plans',
    description: 'Every treatment path is tailored to your skin goals and routine.',
  },
  {
    title: 'Qualified Specialists',
    description: 'Experienced professionals focused on visible, safe results.',
  },
  {
    title: 'Fast Booking',
    description: 'Book your preferred date and get confirmation within 24 hours.',
  },
];

function RotatingImageSlot({
  className,
  currentImage,
  nextImage,
  isSliding,
}: {
  className: string;
  currentImage: { id: string; src: string; alt: string };
  nextImage: { id: string; src: string; alt: string };
  isSliding: boolean;
}) {
  return (
    <div className={className}>
      <div
        className="flex h-full w-[200%] transition-transform duration-700 ease-out"
        style={{ transform: isSliding ? 'translateX(-50%)' : 'translateX(0%)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={currentImage.src} alt={currentImage.alt} className="h-full w-1/2 object-cover" loading="lazy" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={nextImage.src} alt={nextImage.alt} className="h-full w-1/2 object-cover" loading="lazy" />
      </div>
    </div>
  );
}

export function ServiceBookingClient({ serviceOptions }: { serviceOptions: ServiceOption[] }) {
  const { add: showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentIndices, setCurrentIndices] = useState<number[]>(() => Array.from({ length: 8 }, (_, i) => i));
  const [nextIndices, setNextIndices] = useState<number[]>(() => Array.from({ length: 8 }, (_, i) => (i + 1) % 8));
  const [isSlidingGrid, setIsSlidingGrid] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    service_type: serviceOptions[0]?.value ?? '',
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

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIsSlidingGrid(true);

      window.setTimeout(() => {
        setCurrentIndices(nextIndices);
        setNextIndices(nextIndices.map((idx) => (idx + 1) % SERVICE_IMAGES.length));
        setIsSlidingGrid(false);
      }, 700);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [nextIndices]);

  const whatWeOfferData: Gallery4Props = {
    title: 'What we offer',
    description:
      'Explore our most-requested services and book the one that best matches your current skin goals and treatment plan.',
    items: serviceOptions.slice(0, 6).map((service, index) => ({
      id: service.value,
      title: service.label,
      description: service.description ?? 'Professional treatment designed for visible, practical results.',
      href: '#book-service',
      image: SERVICE_IMAGES[index % SERVICE_IMAGES.length].src,
    })),
  };

  return (
    <div className="bg-white text-neutral-900">
      <ImageCarouselHero
        title="Glow-ready skin services tailored to you."
        subtitle="Services"
        description="From facials and advanced skin treatments to waxing and consultations, we craft sessions built around your goals and schedule."
        ctaText="Book Your Session"
        onCtaClick={() => {
          if (typeof window !== 'undefined') {
            document.getElementById('book-service')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        images={SERVICE_IMAGES}
        features={HERO_FEATURES}
      />

      <section className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
        <div className="mb-12 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <RotatingImageSlot
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 md:col-span-2 h-52 md:h-72"
              currentImage={SERVICE_IMAGES[currentIndices[0]]}
              nextImage={SERVICE_IMAGES[nextIndices[0]]}
              isSliding={isSlidingGrid}
            />
            <RotatingImageSlot
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 h-52 md:h-72"
              currentImage={SERVICE_IMAGES[currentIndices[1]]}
              nextImage={SERVICE_IMAGES[nextIndices[1]]}
              isSliding={isSlidingGrid}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <RotatingImageSlot
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 h-52"
              currentImage={SERVICE_IMAGES[currentIndices[2]]}
              nextImage={SERVICE_IMAGES[nextIndices[2]]}
              isSliding={isSlidingGrid}
            />
            <RotatingImageSlot
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 h-52"
              currentImage={SERVICE_IMAGES[currentIndices[3]]}
              nextImage={SERVICE_IMAGES[nextIndices[3]]}
              isSliding={isSlidingGrid}
            />
            <RotatingImageSlot
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 h-52"
              currentImage={SERVICE_IMAGES[currentIndices[4]]}
              nextImage={SERVICE_IMAGES[nextIndices[4]]}
              isSliding={isSlidingGrid}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <RotatingImageSlot
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 h-52"
              currentImage={SERVICE_IMAGES[currentIndices[5]]}
              nextImage={SERVICE_IMAGES[nextIndices[5]]}
              isSliding={isSlidingGrid}
            />
            <RotatingImageSlot
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 h-52"
              currentImage={SERVICE_IMAGES[currentIndices[6]]}
              nextImage={SERVICE_IMAGES[nextIndices[6]]}
              isSliding={isSlidingGrid}
            />
            <RotatingImageSlot
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 h-52"
              currentImage={SERVICE_IMAGES[currentIndices[7]]}
              nextImage={SERVICE_IMAGES[nextIndices[7]]}
              isSliding={isSlidingGrid}
            />
          </div>
        </div>
        <Gallery4 {...whatWeOfferData} />
      </section>

      <section id="book-service" className="border-y border-neutral-200 bg-neutral-50">
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
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-sm font-semibold text-neutral-900">Share your service feedback</p>
              <p className="mt-2 text-sm text-neutral-600">
                We moved service feedback to a dedicated page for a cleaner booking flow.
              </p>
              <Link
                href="/services/feedback"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
              >
                Open feedback page <ArrowRight className="h-4 w-4" />
              </Link>
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
    </div>
  );
}
