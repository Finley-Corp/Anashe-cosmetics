'use client';

import { Fragment, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

type DiscountRow = {
  id: string;
  code: string;
  description: string | null;
  type: 'percentage' | 'fixed' | 'free_shipping' | string;
  value: number;
  is_active: boolean;
  used_count: number;
  max_uses: number | null;
  created_at: string | null;
  expires_at: string | null;
};

export function DiscountsClient({ initialDiscounts }: { initialDiscounts: DiscountRow[] }) {
  const [rows, setRows] = useState<DiscountRow[]>(initialDiscounts);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [createCode, setCreateCode] = useState('');
  const [createPercent, setCreatePercent] = useState<number>(10);
  const [createDescription, setCreateDescription] = useState('');
  const [createActive, setCreateActive] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const editingRow = useMemo(() => rows.find((r) => r.id === editingId) ?? null, [rows, editingId]);
  const [editCode, setEditCode] = useState('');
  const [editPercent, setEditPercent] = useState<number>(10);
  const [editDescription, setEditDescription] = useState('');
  const [editActive, setEditActive] = useState(true);

  function flashSuccess(message: string) {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 2500);
  }

  async function refresh() {
    const res = await fetch('/api/admin/discounts', { cache: 'no-store' });
    const json = (await res.json().catch(() => ({}))) as { data?: DiscountRow[]; error?: string };
    if (!res.ok) throw new Error(json.error ?? 'Unable to load discounts');
    setRows(json.data ?? []);
  }

  function normalizeCode(value: string) {
    return value.toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9_-]/g, '');
  }

  async function onCreate() {
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      const code = normalizeCode(createCode.trim());
      const percent_off = Number(createPercent);
      const description = createDescription.trim() || null;
      const is_active = createActive;

      if (!code) {
        setError('Code is required');
        return;
      }

      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, percent_off, description, is_active }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Unable to create discount');

      await refresh();
      setCreateCode('');
      setCreatePercent(10);
      setCreateDescription('');
      setCreateActive(true);
      flashSuccess('Discount code created');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to create discount');
    } finally {
      setBusy(false);
    }
  }

  function startEdit(row: DiscountRow) {
    setError(null);
    setSuccess(null);
    setEditingId(row.id);
    setEditCode(row.code);
    setEditPercent(Number(row.value ?? 0));
    setEditDescription(row.description ?? '');
    setEditActive(Boolean(row.is_active));
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function onSaveEdit() {
    if (!editingRow) return;
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      const code = normalizeCode(editCode.trim());
      const percent_off = Number(editPercent);
      const description = editDescription.trim() || null;
      const is_active = editActive;

      if (!code) {
        setError('Code is required');
        return;
      }

      const res = await fetch(`/api/admin/discounts/${editingRow.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, percent_off, description, is_active }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Unable to update discount');

      await refresh();
      setEditingId(null);
      flashSuccess('Discount code updated');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to update discount');
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    setError(null);
    setSuccess(null);
    const ok = window.confirm('Delete this discount code?');
    if (!ok) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/admin/discounts/${id}`, { method: 'DELETE' });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Unable to delete discount');

      await refresh();
      flashSuccess('Discount code deleted');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to delete discount');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Discount Codes</h1>
        <p className="text-sm text-gray-500 mt-1">{rows.length} codes</p>
      </div>

      <div className="bg-[#1A1D21] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">Create Discount</p>
            <p className="text-xs text-gray-500 mt-0.5">Create a percentage-off code for customers.</p>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => void onCreate()}
            className="flex items-center gap-2 h-10 px-5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> Create
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Code</span>
            <input
              value={createCode}
              onChange={(e) => setCreateCode(normalizeCode(e.target.value))}
              className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
              placeholder="WELCOME10"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">% Off</span>
            <input
              type="number"
              min={1}
              max={95}
              step={1}
              value={createPercent}
              onChange={(e) => setCreatePercent(Number(e.target.value))}
              className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
            />
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-300 md:col-span-1 md:self-end">
            <input
              type="checkbox"
              checked={createActive}
              onChange={(e) => setCreateActive(e.target.checked)}
              className="rounded border-white/20 bg-[#121417]"
            />
            Active
          </label>
          <label className="space-y-1.5 md:col-span-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description (optional)</span>
            <input
              value={createDescription}
              onChange={(e) => setCreateDescription(e.target.value)}
              className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
              placeholder="10% off your first order"
            />
          </label>
        </div>

        {(error || success) && (
          <div className="mt-4">
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-300">{success}</p> : null}
          </div>
        )}
      </div>

      <div className="bg-[#1A1D21] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Code', '% Off', 'Status', 'Used', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isEditing = row.id === editingId;
                return (
                  <Fragment key={row.id}>
                    <tr className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${isEditing ? 'bg-white/[0.02]' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="text-white font-semibold">{row.code}</p>
                        {row.description ? <p className="text-xs text-gray-500 mt-1">{row.description}</p> : null}
                      </td>
                      <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{Number(row.value)}%</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          row.is_active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-gray-400'
                        }`}>
                          {row.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                        {row.used_count}{row.max_uses ? ` / ${row.max_uses}` : ''}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {row.created_at ? new Date(row.created_at).toLocaleDateString('en-KE') : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => (isEditing ? cancelEdit() : startEdit(row))}
                            className="h-9 px-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 disabled:opacity-60 inline-flex items-center gap-2"
                          >
                            <Pencil className="h-4 w-4" /> {isEditing ? 'Close' : 'Edit'}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void onDelete(row.id)}
                            className="h-9 px-3 rounded-lg border border-red-500/20 text-red-300 hover:bg-red-500/10 disabled:opacity-60 inline-flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isEditing ? (
                      <tr className="border-b border-white/5">
                        <td colSpan={6} className="px-4 pb-4">
                          <div className="mt-3 rounded-xl border border-white/10 bg-[#121417] p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-white">Edit Discount</p>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => void onSaveEdit()}
                                  className="h-9 px-4 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 disabled:opacity-60"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => cancelEdit()}
                                  className="h-9 px-4 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 disabled:opacity-60"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-4">
                              <label className="space-y-1.5 md:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Code</span>
                                <input
                                  value={editCode}
                                  onChange={(e) => setEditCode(normalizeCode(e.target.value))}
                                  className="w-full h-10 rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
                                />
                              </label>
                              <label className="space-y-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">% Off</span>
                                <input
                                  type="number"
                                  min={1}
                                  max={95}
                                  step={1}
                                  value={editPercent}
                                  onChange={(e) => setEditPercent(Number(e.target.value))}
                                  className="w-full h-10 rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
                                />
                              </label>
                              <label className="inline-flex items-center gap-2 text-sm text-gray-300 md:self-end">
                                <input
                                  type="checkbox"
                                  checked={editActive}
                                  onChange={(e) => setEditActive(e.target.checked)}
                                  className="rounded border-white/20 bg-black/30"
                                />
                                Active
                              </label>
                              <label className="space-y-1.5 md:col-span-4">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description (optional)</span>
                                <input
                                  value={editDescription}
                                  onChange={(e) => setEditDescription(e.target.value)}
                                  className="w-full h-10 rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
                                />
                              </label>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

