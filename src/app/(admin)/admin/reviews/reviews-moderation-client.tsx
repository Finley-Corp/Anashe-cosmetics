'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, X, Star, Loader2 } from 'lucide-react';

type AdminReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
  is_approved: boolean;
  product: { id: string; name: string; slug: string }[] | { id: string; name: string; slug: string } | null;
  profile: { id: string; full_name: string | null }[] | { id: string; full_name: string | null } | null;
};

export function ReviewsModerationClient({ initialReviews }: { initialReviews: AdminReview[] }) {
  const [reviews, setReviews] = useState<AdminReview[]>(initialReviews);
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reviewList = useMemo(() => reviews, [reviews]);

  async function refresh(status: 'pending' | 'approved') {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?status=${status}`, { cache: 'no-store' });
      const payload = await res.json();
      if (res.ok) {
        setReviews(payload.data ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function moderate(reviewId: string, action: 'approve' | 'reject') {
    setBusyId(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Review Moderation</h1>
          <p className="text-sm text-gray-500 mt-1">Approve or reject customer reviews before publishing.</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setTab('pending');
            void refresh('pending');
          }}
          className={`px-4 py-2 rounded-full text-xs font-semibold ${tab === 'pending' ? 'bg-white text-black' : 'bg-transparent border border-white/10 text-gray-400'}`}
        >
          Pending
        </button>
        <button
          onClick={() => {
            setTab('approved');
            void refresh('approved');
          }}
          className={`px-4 py-2 rounded-full text-xs font-semibold ${tab === 'approved' ? 'bg-white text-black' : 'bg-transparent border border-white/10 text-gray-400'}`}
        >
          Approved
        </button>
      </div>

      <div className="bg-[#1A1D21] border border-white/5 rounded-2xl overflow-hidden">
        {loading && (
          <div className="p-6 text-sm text-gray-500">Loading reviews...</div>
        )}
        {!loading && reviewList.length === 0 && (
          <div className="p-6 text-sm text-gray-500">No reviews in this state.</div>
        )}

        {!loading && reviewList.length > 0 && (
          <div className="divide-y divide-white/5">
            {reviewList.map((review) => {
              const product = Array.isArray(review.product) ? review.product[0] : review.product;
              const profile = Array.isArray(review.profile) ? review.profile[0] : review.profile;
              return (
                <div key={review.id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">{profile?.full_name ?? 'Customer'}</span>
                        <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString('en-KE')}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} />
                        ))}
                      </div>
                      {review.title && <p className="text-sm font-semibold text-white">{review.title}</p>}
                      {review.body && <p className="text-sm text-gray-300 mt-1">{review.body}</p>}
                      {product && (
                        <Link href={`/products/${product.slug}`} className="text-xs text-gray-400 hover:text-white hover:underline mt-2 inline-block">
                          View product: {product.name}
                        </Link>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {tab === 'pending' && (
                        <>
                          <button
                            onClick={() => void moderate(review.id, 'approve')}
                            disabled={busyId === review.id}
                            className="h-9 px-3 rounded-lg bg-white text-black text-xs font-semibold disabled:opacity-60 inline-flex items-center gap-1.5"
                          >
                            {busyId === review.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            Approve
                          </button>
                          <button
                            onClick={() => void moderate(review.id, 'reject')}
                            disabled={busyId === review.id}
                            className="h-9 px-3 rounded-lg border border-red-500/30 text-red-300 text-xs font-semibold disabled:opacity-60 inline-flex items-center gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

