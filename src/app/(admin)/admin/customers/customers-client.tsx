'use client';

import { Fragment, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

type CustomerRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export function CustomersClient({ initialCustomers }: { initialCustomers: CustomerRow[] }) {
  const [rows, setRows] = useState<CustomerRow[]>(initialCustomers);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createNotes, setCreateNotes] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const editingRow = useMemo(() => rows.find((r) => r.id === editingId) ?? null, [rows, editingId]);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editNotes, setEditNotes] = useState('');

  function flashSuccess(message: string) {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 2500);
  }

  async function refresh() {
    const res = await fetch('/api/admin/customers', { cache: 'no-store' });
    const json = (await res.json().catch(() => ({}))) as { data?: CustomerRow[]; error?: string };
    if (!res.ok) throw new Error(json.error ?? 'Unable to load customers');
    setRows(json.data ?? []);
  }

  async function onCreate() {
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      const full_name = createName.trim();
      const email = createEmail.trim();
      const phone = createPhone.trim();
      const notes = createNotes.trim() || null;

      if (!full_name || !email || !phone) {
        setError('Name, email, and contact are required');
        return;
      }

      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, phone, notes }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Unable to save customer');

      await refresh();
      setCreateName('');
      setCreateEmail('');
      setCreatePhone('');
      setCreateNotes('');
      flashSuccess('Customer saved');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to save customer');
    } finally {
      setBusy(false);
    }
  }

  function startEdit(row: CustomerRow) {
    setError(null);
    setSuccess(null);
    setEditingId(row.id);
    setEditName(row.full_name);
    setEditEmail(row.email);
    setEditPhone(row.phone);
    setEditNotes(row.notes ?? '');
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
      const full_name = editName.trim();
      const email = editEmail.trim();
      const phone = editPhone.trim();
      const notes = editNotes.trim() || null;

      if (!full_name || !email || !phone) {
        setError('Name, email, and contact are required');
        return;
      }

      const res = await fetch(`/api/admin/customers/${editingRow.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, phone, notes }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Unable to update customer');

      await refresh();
      setEditingId(null);
      flashSuccess('Customer updated');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to update customer');
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    setError(null);
    setSuccess(null);
    const ok = window.confirm('Delete this customer record?');
    if (!ok) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Unable to delete customer');
      await refresh();
      flashSuccess('Customer deleted');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to delete customer');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Customers</h1>
        <p className="text-sm text-gray-500 mt-1">{rows.length} saved records</p>
      </div>

      <div className="bg-[#1A1D21] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">Add Customer</p>
            <p className="text-xs text-gray-500 mt-0.5">Store customer name, email, and contact details.</p>
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

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Name</span>
            <input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
              placeholder="Customer full name"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email</span>
            <input
              type="email"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
              className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
              placeholder="email@example.com"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Contact</span>
            <input
              value={createPhone}
              onChange={(e) => setCreatePhone(e.target.value)}
              className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
              placeholder="+254..."
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Notes (optional)</span>
            <input
              value={createNotes}
              onChange={(e) => setCreateNotes(e.target.value)}
              className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
              placeholder="Extra context"
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
                {['Name', 'Email', 'Contact', 'Notes', 'Created', 'Actions'].map((h) => (
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
                      <td className="px-4 py-3 text-white font-medium">{row.full_name}</td>
                      <td className="px-4 py-3 text-gray-300">{row.email}</td>
                      <td className="px-4 py-3 text-gray-300">{row.phone}</td>
                      <td className="px-4 py-3 text-gray-400 max-w-[280px] truncate">{row.notes ?? '-'}</td>
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
                              <p className="text-sm font-semibold text-white">Edit Customer</p>
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

                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              <label className="space-y-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Name</span>
                                <input
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="w-full h-10 rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
                                />
                              </label>
                              <label className="space-y-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email</span>
                                <input
                                  type="email"
                                  value={editEmail}
                                  onChange={(e) => setEditEmail(e.target.value)}
                                  className="w-full h-10 rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
                                />
                              </label>
                              <label className="space-y-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Contact</span>
                                <input
                                  value={editPhone}
                                  onChange={(e) => setEditPhone(e.target.value)}
                                  className="w-full h-10 rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
                                />
                              </label>
                              <label className="space-y-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Notes</span>
                                <input
                                  value={editNotes}
                                  onChange={(e) => setEditNotes(e.target.value)}
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

