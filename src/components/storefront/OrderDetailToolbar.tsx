'use client';

import { useState } from 'react';
import { Copy, Check, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/shared/Toaster';

type Props = {
  orderNumber: string;
};

export function OrderDetailToolbar({ orderNumber }: Props) {
  const { add: showToast } = useToast();
  const [copied, setCopied] = useState(false);

  async function copyOrderNumber() {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      showToast('Order number copied', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy — copy manually', 'error');
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      <button
        type="button"
        onClick={() => void copyOrderNumber()}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent)] bg-white px-3 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--primary-100)] hover:bg-[var(--accent)]/40"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-[var(--primary)]" /> : <Copy className="h-3.5 w-3.5" />}
        Copy order #
      </button>
      <a
        href={`https://wa.me/254111330585?text=${encodeURIComponent(`Hi — question about order ${orderNumber}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent)] bg-white px-3 py-2 text-xs font-medium text-[var(--primary)] transition-colors hover:border-[var(--primary-100)] hover:bg-[var(--accent)]/40"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        Help with this order
      </a>
    </div>
  );
}
