'use client';

import { create } from 'zustand';
import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  add: (message: string, type?: ToastType) => void;
  remove: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2);
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
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
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-enter flex items-start gap-3 bg-white border border-neutral-200 rounded-xl shadow-xl px-4 py-3"
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
      ))}
    </div>
  );
}
