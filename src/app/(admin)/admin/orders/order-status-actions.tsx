'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ORDER_STATUSES = [
  'pending_payment',
  'payment_confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

export function OrderStatusActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(
    (ORDER_STATUSES.includes(currentStatus as OrderStatus)
      ? currentStatus
      : 'processing') as OrderStatus
  );
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function updateStatus() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          note: `Status updated to ${status.replace(/_/g, ' ')}`,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        alert(payload.error ?? 'Failed to update order');
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function deleteOrder() {
    const confirmed = window.confirm('Delete this order? This action cannot be undone.');
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        alert(payload.error ?? 'Failed to delete order');
        return;
      }
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
        className="h-8 rounded-lg border border-white/10 bg-[#121417] px-2 text-[11px] uppercase tracking-wide text-gray-200"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => void updateStatus()}
        disabled={busy || deleting || status === currentStatus}
        className="h-8 px-3 rounded-lg border border-white/10 text-xs font-semibold text-gray-200 hover:bg-white/5 disabled:opacity-50"
      >
        {busy ? 'Saving...' : 'Update'}
      </button>
      <button
        type="button"
        onClick={() => void deleteOrder()}
        disabled={busy || deleting}
        className="h-8 px-3 rounded-lg border border-red-500/30 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}

