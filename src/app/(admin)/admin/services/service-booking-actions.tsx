'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SERVICE_BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const;
type ServiceBookingStatus = (typeof SERVICE_BOOKING_STATUSES)[number];

export function ServiceBookingActions({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ServiceBookingStatus>(
    (SERVICE_BOOKING_STATUSES.includes(currentStatus as ServiceBookingStatus)
      ? currentStatus
      : 'pending') as ServiceBookingStatus
  );
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function updateStatus() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/services/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        smsSent?: boolean;
        smsSkipped?: boolean;
        smsError?: string | null;
      };
      if (!res.ok) {
        alert(payload.error ?? 'Failed to update service booking');
        return;
      }
      if (!payload.smsSent) {
        alert(
          payload.smsSkipped
            ? 'Status updated, but SMS is not configured.'
            : `Status updated, but SMS delivery failed${payload.smsError ? `: ${payload.smsError}` : '.'}`
        );
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function deleteBooking() {
    const confirmed = window.confirm('Delete this service booking? This action cannot be undone.');
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/services/${bookingId}`, {
        method: 'DELETE',
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        alert(payload.error ?? 'Failed to delete service booking');
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
        onChange={(e) => setStatus(e.target.value as ServiceBookingStatus)}
        className="h-8 rounded-lg border border-white/10 bg-[#121417] px-2 text-[11px] uppercase tracking-wide text-gray-200"
      >
        {SERVICE_BOOKING_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => void updateStatus()}
        disabled={busy || deleting || status === currentStatus}
        className="h-8 rounded-lg border border-white/10 px-3 text-xs font-semibold text-gray-200 hover:bg-white/5 disabled:opacity-50"
      >
        {busy ? 'Saving...' : 'Update'}
      </button>
      <button
        type="button"
        onClick={() => void deleteBooking()}
        disabled={busy || deleting}
        className="h-8 rounded-lg border border-red-500/30 px-3 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
