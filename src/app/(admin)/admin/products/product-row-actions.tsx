'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export function ProductRowActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm('Delete this product? This cannot be undone.');
    if (!confirmed) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        alert(payload.error ?? 'Failed to delete product');
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/products/${productId}/edit`}
        className="h-8 px-3 rounded-lg border border-neutral-200 text-neutral-700 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-neutral-50"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit
      </Link>
      <button
        type="button"
        onClick={() => void handleDelete()}
        disabled={busy}
        className="h-8 px-3 rounded-lg border border-red-200 text-red-600 text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-60"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete
      </button>
    </div>
  );
}
