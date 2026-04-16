'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/shared/Toaster';

type Address = {
  id: string;
  line1: string;
  line2: string | null;
  city: string;
  county: string | null;
  country: string;
  is_default: boolean;
};

export default function AddressesPage() {
  const { add: showToast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    line1: '',
    line2: '',
    city: 'Nairobi',
    county: '',
    country: 'Kenya',
    is_default: false,
  });

  async function loadAddresses() {
    setLoading(true);
    try {
      const res = await fetch('/api/account/addresses', { cache: 'no-store' });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? 'Failed to load addresses');
      setAddresses(payload.data ?? []);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to load addresses', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAddresses();
  }, []);

  async function addAddress(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? 'Failed to add address');

      showToast('Address saved');
      setForm({ line1: '', line2: '', city: 'Nairobi', county: '', country: 'Kenya', is_default: false });
      await loadAddresses();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to add address', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold font-[family-name:var(--font-display)]">My Addresses</h1>
        <Link href="/account" className="text-sm text-[var(--primary)] hover:text-[var(--primary-hover)]">Back to Account</Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-100 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Saved Addresses</h2>
          {loading ? <p className="text-sm text-neutral-500">Loading addresses...</p> : null}
          {!loading && addresses.length === 0 ? <p className="text-sm text-neutral-500">No addresses yet.</p> : null}
          <div className="space-y-3">
            {addresses.map((address) => (
              <div key={address.id} className="p-4 border border-neutral-100 rounded-xl">
                <p className="text-sm font-medium text-neutral-900">{address.line1}</p>
                {address.line2 ? <p className="text-sm text-neutral-600">{address.line2}</p> : null}
                <p className="text-sm text-neutral-600">
                  {address.city}{address.county ? `, ${address.county}` : ''}, {address.country}
                </p>
                {address.is_default ? (
                  <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--primary)]">
                    Default
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Add New Address</h2>
          <form onSubmit={addAddress} className="space-y-3">
            <input
              required
              value={form.line1}
              onChange={(e) => setForm((s) => ({ ...s, line1: e.target.value }))}
              placeholder="Street address"
              className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            />
            <input
              value={form.line2}
              onChange={(e) => setForm((s) => ({ ...s, line2: e.target.value }))}
              placeholder="Apartment, suite, etc (optional)"
              className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                value={form.city}
                onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
                placeholder="City"
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
              />
              <input
                value={form.county}
                onChange={(e) => setForm((s) => ({ ...s, county: e.target.value }))}
                placeholder="County"
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(e) => setForm((s) => ({ ...s, is_default: e.target.checked }))}
                className="rounded border-neutral-300"
              />
              Set as default
            </label>
            <button
              type="submit"
              disabled={saving}
              className="w-full h-11 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Address'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
