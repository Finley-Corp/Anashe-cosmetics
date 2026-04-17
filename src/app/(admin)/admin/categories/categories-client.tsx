'use client';

import { Fragment, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  sort_order: number | null;
  is_active: boolean | null;
  created_at: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

export function CategoriesClient({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const [rows, setRows] = useState<CategoryRow[]>(initialCategories);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [createName, setCreateName] = useState('');
  const [createSlug, setCreateSlug] = useState('');
  const [createSort, setCreateSort] = useState<number>(0);
  const [createActive, setCreateActive] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const editingRow = useMemo(() => rows.find((r) => r.id === editingId) ?? null, [rows, editingId]);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editSort, setEditSort] = useState<number>(0);
  const [editActive, setEditActive] = useState(true);

  function flashSuccess(message: string) {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 2500);
  }

  async function refresh() {
    const res = await fetch('/api/admin/categories', { cache: 'no-store' });
    const json = (await res.json().catch(() => ({}))) as { data?: CategoryRow[]; error?: string };
    if (!res.ok) throw new Error(json.error ?? 'Unable to load categories');
    setRows(json.data ?? []);
  }

  async function onCreate() {
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      const name = createName.trim();
      if (!name) {
        setError('Name is required');
        return;
      }
      const slug = (createSlug.trim() || slugify(name)).slice(0, 220);
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, sort_order: createSort, is_active: createActive }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Unable to create category');
      await refresh();
      setCreateName('');
      setCreateSlug('');
      setCreateSort(0);
      setCreateActive(true);
      flashSuccess('Category added');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to create category');
    } finally {
      setBusy(false);
    }
  }

  function startEdit(row: CategoryRow) {
    setError(null);
    setSuccess(null);
    setEditingId(row.id);
    setEditName(row.name);
    setEditSlug(row.slug);
    setEditSort(Number(row.sort_order ?? 0));
    setEditActive(Boolean(row.is_active ?? true));
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
      const name = editName.trim();
      if (!name) {
        setError('Name is required');
        return;
      }
      const slug = (editSlug.trim() || slugify(name)).slice(0, 220);
      const res = await fetch(`/api/admin/categories/${editingRow.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, sort_order: editSort, is_active: editActive }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Unable to update category');
      await refresh();
      setEditingId(null);
      flashSuccess('Category updated');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to update category');
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    setError(null);
    setSuccess(null);
    const ok = window.confirm('Delete this category? If it is used by products, deletion will be blocked.');
    if (!ok) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Unable to delete category');
      await refresh();
      flashSuccess('Category deleted');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to delete category');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{rows.length} total categories</p>
        </div>
      </div>

      <div className="bg-[#1A1D21] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">Add Category</p>
            <p className="text-xs text-gray-500 mt-0.5">Create a new category for products.</p>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => void onCreate()}
            className="flex items-center gap-2 h-10 px-5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Name</span>
            <input
              value={createName}
              onChange={(e) => {
                const v = e.target.value;
                setCreateName(v);
                if (!createSlug.trim()) setCreateSlug(slugify(v));
              }}
              className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
              placeholder="e.g. Serums"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Slug</span>
            <input
              value={createSlug}
              onChange={(e) => setCreateSlug(slugify(e.target.value))}
              className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
              placeholder="serums"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sort</span>
            <input
              type="number"
              min={0}
              step={1}
              value={createSort}
              onChange={(e) => setCreateSort(Number(e.target.value))}
              className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
            />
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-gray-300 md:col-span-4">
            <input
              type="checkbox"
              checked={createActive}
              onChange={(e) => setCreateActive(e.target.checked)}
              className="rounded border-white/20 bg-[#121417]"
            />
            Active
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
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Name', 'Slug', 'Sort', 'Status', 'Created', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
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
                    <tr
                      className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${
                        isEditing ? 'bg-white/[0.02]' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{row.name}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono whitespace-nowrap">{row.slug}</td>
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{Number(row.sort_order ?? 0)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            row.is_active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-gray-400'
                          }`}
                        >
                          {row.is_active ? 'Active' : 'Inactive'}
                        </span>
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
                              <p className="text-sm font-semibold text-white">Edit Category</p>
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
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Name</span>
                                <input
                                  value={editName}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    setEditName(v);
                                    if (!editSlug.trim()) setEditSlug(slugify(v));
                                  }}
                                  className="w-full h-10 rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
                                />
                              </label>
                              <label className="space-y-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Slug</span>
                                <input
                                  value={editSlug}
                                  onChange={(e) => setEditSlug(slugify(e.target.value))}
                                  className="w-full h-10 rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
                                />
                              </label>
                              <label className="space-y-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sort</span>
                                <input
                                  type="number"
                                  min={0}
                                  step={1}
                                  value={editSort}
                                  onChange={(e) => setEditSort(Number(e.target.value))}
                                  className="w-full h-10 rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
                                />
                              </label>

                              <label className="inline-flex items-center gap-2 text-sm text-gray-300 md:col-span-4">
                                <input
                                  type="checkbox"
                                  checked={editActive}
                                  onChange={(e) => setEditActive(e.target.checked)}
                                  className="rounded border-white/20 bg-black/30"
                                />
                                Active
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

