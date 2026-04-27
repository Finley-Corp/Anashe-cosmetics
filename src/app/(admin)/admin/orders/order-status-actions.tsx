'use client';

import { useEffect, useState } from 'react';
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
  mpesaReceipt,
  shippingRiderName,
  shippingRiderPhone,
}: {
  orderId: string;
  currentStatus: string;
  mpesaReceipt?: string | null;
  shippingRiderName?: string | null;
  shippingRiderPhone?: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(
    (ORDER_STATUSES.includes(currentStatus as OrderStatus) ? currentStatus : 'pending_payment') as OrderStatus
  );
  const [mpesaInput, setMpesaInput] = useState(mpesaReceipt?.trim() ?? '');
  const [riderName, setRiderName] = useState(shippingRiderName?.trim() ?? '');
  const [riderPhone, setRiderPhone] = useState(shippingRiderPhone?.trim() ?? '');
  const [resendShippedSms, setResendShippedSms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const next = ORDER_STATUSES.includes(currentStatus as OrderStatus)
      ? currentStatus
      : 'pending_payment';
    setStatus(next as OrderStatus);
  }, [currentStatus]);

  useEffect(() => {
    setMpesaInput(mpesaReceipt?.trim() ?? '');
  }, [mpesaReceipt]);

  useEffect(() => {
    setRiderName(shippingRiderName?.trim() ?? '');
    setRiderPhone(shippingRiderPhone?.trim() ?? '');
    setResendShippedSms(false);
  }, [shippingRiderName, shippingRiderPhone]);

  const showShippedSection = status === 'shipped' || currentStatus === 'shipped';

  const riderDirty =
    riderName.trim() !== (shippingRiderName?.trim() ?? '') ||
    riderPhone.trim() !== (shippingRiderPhone?.trim() ?? '');

  const canUpdate =
    status !== currentStatus ||
    (currentStatus === 'shipped' && status === 'shipped' && (riderDirty || resendShippedSms));

  async function confirmPayment() {
    setBusy(true);
    try {
      const code = mpesaInput.trim();
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'payment_confirmed',
          mpesa_receipt: code || undefined,
          note: code ? `Payment confirmed (M-Pesa ${code})` : 'Payment confirmed',
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        alert(payload.error ?? 'Failed to confirm payment');
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus() {
    setBusy(true);
    try {
      const body: Record<string, unknown> = {
        status,
        note: `Status updated to ${status.replace(/_/g, ' ')}`,
      };
      if (status === 'payment_confirmed' && mpesaInput.trim()) {
        body.mpesa_receipt = mpesaInput.trim();
      }
      if (showShippedSection) {
        body.shipping_rider_name = riderName.trim() || null;
        body.shipping_rider_phone = riderPhone.trim() || null;
      }
      if (currentStatus === 'shipped' && status === 'shipped' && resendShippedSms) {
        body.resend_shipped_sms = true;
      }
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        smsDispatched?: boolean;
      };
      if (!res.ok) {
        alert(payload.error ?? 'Failed to update order');
        return;
      }
      if (status === 'shipped' && (currentStatus !== 'shipped' || resendShippedSms)) {
        if (payload.smsDispatched) {
          alert('Saved. Customer SMS was sent (Tilil).');
        } else {
          alert('Saved. SMS was not sent—check order has a payment phone and SMS is configured.');
        }
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
    <div className="flex flex-col items-end gap-2">
      {currentStatus === 'pending_payment' ? (
        <div className="flex w-full max-w-[260px] flex-col gap-1.5">
          <input
            type="text"
            value={mpesaInput}
            onChange={(e) => setMpesaInput(e.target.value)}
            placeholder="M-Pesa confirmation code"
            autoComplete="off"
            className="h-8 rounded-lg border border-white/10 bg-[#121417] px-2 text-[11px] text-gray-200 placeholder:text-gray-600"
          />
          <button
            type="button"
            onClick={() => void confirmPayment()}
            disabled={busy || deleting}
            className="h-8 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/25 disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Confirm payment'}
          </button>
        </div>
      ) : null}

      {showShippedSection ? (
        <div className="flex w-full max-w-[280px] flex-col gap-2 rounded-lg border border-violet-500/30 bg-violet-500/5 p-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-200/90">Delivery / rider (SMS)</p>
          <input
            type="text"
            value={riderName}
            onChange={(e) => setRiderName(e.target.value)}
            placeholder="Rider name"
            autoComplete="off"
            className="h-8 rounded-lg border border-white/10 bg-[#121417] px-2 text-[11px] text-gray-200 placeholder:text-gray-600"
          />
          <input
            type="text"
            value={riderPhone}
            onChange={(e) => setRiderPhone(e.target.value)}
            placeholder="Rider phone (e.g. 0712…)"
            autoComplete="off"
            className="h-8 rounded-lg border border-white/10 bg-[#121417] px-2 text-[11px] text-gray-200 placeholder:text-gray-600"
          />
          <p className="text-[10px] leading-snug text-gray-500">
            Required when you first set status to Shipped—customer gets an SMS with these details.
          </p>
          {currentStatus === 'shipped' && status === 'shipped' ? (
            <label className="flex cursor-pointer items-center gap-2 text-[11px] text-gray-400">
              <input
                type="checkbox"
                checked={resendShippedSms}
                onChange={(e) => setResendShippedSms(e.target.checked)}
                className="rounded border-white/20 bg-[#121417]"
              />
              Send SMS to customer again
            </label>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-2">
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
          disabled={busy || deleting || !canUpdate}
          className="h-8 rounded-lg border border-white/10 px-3 text-xs font-semibold text-gray-200 hover:bg-white/5 disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Update'}
        </button>
        <button
          type="button"
          onClick={() => void deleteOrder()}
          disabled={busy || deleting}
          className="h-8 rounded-lg border border-red-500/30 px-3 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-50"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
