'use client';

import { create } from 'zustand';
import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { formatPrice, resolveProductImageUrl } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';
type ToastKind = 'default' | 'cart';

interface CartToastPayload {
  productName: string;
  image?: string;
  quantity: number;
  variantName?: string;
  unitPrice: number;
}

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  kind: ToastKind;
  cart?: CartToastPayload;
}

interface ToastStore {
  toasts: Toast[];
  add: (message: string, type?: ToastType, options?: { kind?: ToastKind; cart?: CartToastPayload }) => void;
  remove: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = 'success', options) => {
    const id = Math.random().toString(36).substring(2);
    const kind = options?.kind ?? 'default';
    set((s) => ({
      toasts: [...s.toasts, { id, message, type, kind, cart: options?.cart }],
    }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

const icons = {
  success: <CheckCircle className="w-4 h-4 text-green-600" />,
  error: <XCircle className="w-4 h-4 text-red-500" />,
  info: <AlertCircle className="w-4 h-4 text-blue-500" />,
};

export function Toaster() {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed inset-x-3 bottom-3 z-[200] flex flex-col gap-2 md:inset-x-auto md:bottom-6 md:right-6 md:w-80">
      {toasts.map((toast) => (
        toast.kind === 'cart' && toast.cart ? (
          <div
            key={toast.id}
            className="toast-enter overflow-hidden rounded-2xl border border-neutral-200 bg-white text-neutral-900 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Added to bag</p>
              <button
                onClick={() => remove(toast.id)}
                className="text-neutral-400 transition-colors hover:text-neutral-700"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-3 px-4 py-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                {resolveProductImageUrl(toast.cart.image) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveProductImageUrl(toast.cart.image) ?? ''}
                    alt={toast.cart.productName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-neutral-800" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold uppercase tracking-[0.04em] text-neutral-900">{toast.cart.productName}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.1em] text-neutral-500">
                  {toast.cart.variantName ? `Size: ${toast.cart.variantName} | ` : ''}
                  Qty: {toast.cart.quantity}
                </p>
                <p className="mt-2 text-xl font-semibold text-neutral-900">{formatPrice(toast.cart.unitPrice * toast.cart.quantity)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 px-4 pb-4">
              <button
                onClick={() => remove(toast.id)}
                className="h-11 rounded-xl border border-neutral-300 bg-white text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-800 transition-colors hover:bg-neutral-100"
              >
                Continue
              </button>
              <Link
                href="/cart"
                onClick={() => remove(toast.id)}
                className="flex h-11 items-center justify-center rounded-xl bg-neutral-900 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-neutral-800"
              >
                View bag
              </Link>
            </div>
          </div>
        ) : (
          <div
            key={toast.id}
            className="toast-enter flex items-start gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-xl"
          >
            {icons[toast.type]}
            <p className="flex-1 text-sm font-medium text-neutral-800">{toast.message}</p>
            <button
              onClick={() => remove(toast.id)}
              className="text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      ))}
    </div>
  );
}
