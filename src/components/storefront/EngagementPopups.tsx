'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

const COOKIE_KEY = 'anashe_cookie_consent';
const DISCOUNT_KEY = 'anashe_discount_popup_dismissed_at';
const DISCOUNT_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export function EngagementPopups() {
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cookieDecision = window.localStorage.getItem(COOKIE_KEY);
    if (!cookieDecision) {
      setShowCookieBanner(true);
    }

    const dismissedAtRaw = window.localStorage.getItem(DISCOUNT_KEY);
    const dismissedAt = dismissedAtRaw ? Number(dismissedAtRaw) : 0;
    const canShowDiscount = !dismissedAt || Date.now() - dismissedAt > DISCOUNT_COOLDOWN_MS;

    if (canShowDiscount) {
      const timer = window.setTimeout(() => setShowDiscountPopup(true), 2500);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const discountCode = useMemo(() => 'WELCOME10', []);

  function handleCookieChoice(choice: 'accepted' | 'declined') {
    window.localStorage.setItem(COOKIE_KEY, choice);
    setShowCookieBanner(false);
  }

  function handleCloseDiscount() {
    window.localStorage.setItem(DISCOUNT_KEY, String(Date.now()));
    setShowDiscountPopup(false);
  }

  async function handleCopyDiscountCode() {
    try {
      await navigator.clipboard.writeText(discountCode);
      setCodeCopied(true);
      window.setTimeout(() => setCodeCopied(false), 1500);
    } catch {
      // Ignore clipboard errors silently.
    }
  }

  return (
    <>
      {showDiscountPopup ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/45 p-4">
          <div className="h-[90vw] w-[90vw] max-h-[560px] max-w-[560px] overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="relative h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-image-pro-2.jpg"
                alt="Anashe beauty hero"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35" />
              <div className="absolute right-4 top-4">
                <button
                  type="button"
                  onClick={handleCloseDiscount}
                  aria-label="Close discount popup"
                  className="rounded-full bg-white/85 p-1.5 text-neutral-700 transition-colors hover:bg-white hover:text-neutral-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                <p className="!text-white text-xs font-semibold uppercase tracking-[0.2em] drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]">Limited Offer</p>
                <h3 className="mt-2 !text-white text-3xl font-semibold leading-tight font-[family-name:var(--font-display)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  Get 10% off your first order
                </h3>
                <p className="mt-3 max-w-md !text-white text-sm leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                  Use this promo code at checkout and enjoy your first Anashe order for less.
                </p>
                <button
                  type="button"
                  onClick={handleCopyDiscountCode}
                  className="mt-4 inline-flex items-center rounded-full border border-white/45 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                  aria-label="Copy discount code"
                >
                  {codeCopied ? 'Copied' : 'Code:'} <span className="ml-1">{discountCode}</span>
                </button>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    onClick={handleCloseDiscount}
                    className="inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
                  >
                    Shop now
                  </Link>
                  <button
                    type="button"
                    onClick={handleCloseDiscount}
                    className="inline-flex h-10 items-center rounded-full border border-white/50 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                  >
                    Maybe later
                  </button>
                </div>
                <p className="mt-2 text-xs text-white/70">Valid for first-time orders only.</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showCookieBanner ? (
        <div className="fixed inset-x-0 bottom-0 z-[94] border-t border-neutral-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
            <p className="text-sm text-neutral-700">
              We use cookies to improve site experience, analytics, and checkout performance.
              <Link href="/privacy" className="ml-1 font-semibold text-neutral-900 underline underline-offset-2">
                Learn more
              </Link>
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => handleCookieChoice('declined')}
                className="inline-flex h-9 items-center rounded-full border border-neutral-300 px-4 text-xs font-semibold uppercase tracking-wide text-neutral-600 transition-colors hover:bg-neutral-50"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => handleCookieChoice('accepted')}
                className="inline-flex h-9 items-center rounded-full bg-[var(--primary)] px-4 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[var(--primary-hover)]"
              >
                Accept Cookies
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
