'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';

export function DeleteAllProductsButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDeleteAll() {
    const confirmed = window.confirm(
      'Delete all products? Products tied to existing orders will be skipped.'
    );
    if (!confirmed) return;

    setBusy(true);
    try {
      const res = await fetch('/api/admin/products', { method: 'DELETE' });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(payload.error ?? 'Failed to delete all products');
        return;
      }
      const deleted = Number(payload.deletedCount ?? 0);
      const skipped = Number(payload.skippedCount ?? 0);
      alert(`Deleted ${deleted} product(s).${skipped > 0 ? ` Skipped ${skipped} with order history.` : ''}`);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleDeleteAll()}
      disabled={busy}
      className="flex items-center gap-2 h-10 px-4 border border-red-500/30 text-red-300 text-sm font-semibold rounded-xl hover:bg-red-500/10 transition-colors disabled:opacity-60"
    >
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      Delete All
    </button>
  );
}
