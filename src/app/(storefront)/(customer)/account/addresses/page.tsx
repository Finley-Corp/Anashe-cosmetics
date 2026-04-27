'use client';

import { useEffect, useState } from 'react';
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
    <>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[var(--text-primary)]">Addresses</h1>
        <p className="mt-2 text-sm text-[var(--text-body)] max-w-lg leading-relaxed">
          Where we ship your orders and send order updates.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[var(--accent)] rounded-xl p-5 md:p-6">
            <h2 className="font-medium text-[var(--text-primary)] mb-4">Saved addresses</h2>
            {loading ? <p className="text-sm text-[var(--text-body)]">Loading addresses...</p> : null}
            {!loading && addresses.length === 0 ? <p className="text-sm text-[var(--text-body)]">No addresses yet.</p> : null}
            <div className="space-y-3">
              {addresses.map((address) => (
                <div key={address.id} className="p-4 border border-[var(--accent)] rounded-lg bg-[var(--canvas)]">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{address.line1}</p>
                  {address.line2 ? <p className="text-sm text-[var(--text-body)]">{address.line2}</p> : null}
                  <p className="text-sm text-[var(--text-body)]">
                    {address.city}
                    {address.county ? `, ${address.county}` : ''}, {address.country}
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

          <div className="bg-white border border-[var(--accent)] rounded-xl p-5 md:p-6">
            <h2 className="font-medium text-[var(--text-primary)] mb-4">Add address</h2>
            <form onSubmit={addAddress} className="space-y-3">
              <input
                required
                value={form.line1}
                onChange={(e) => setForm((s) => ({ ...s, line1: e.target.value }))}
                placeholder="Street address"
                className="w-full border border-[var(--primary-100)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] bg-white"
              />
              <input
                value={form.line2}
                onChange={(e) => setForm((s) => ({ ...s, line2: e.target.value }))}
                placeholder="Apartment, suite, etc (optional)"
                className="w-full border border-[var(--primary-100)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] bg-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
                  placeholder="City"
                  className="w-full border border-[var(--primary-100)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] bg-white"
                />
                <input
                  value={form.county}
                  onChange={(e) => setForm((s) => ({ ...s, county: e.target.value }))}
                  placeholder="County"
                  className="w-full border border-[var(--primary-100)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] bg-white"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-[var(--text-body)]">
                <input
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(e) => setForm((s) => ({ ...s, is_default: e.target.checked }))}
                  className="rounded border-[var(--primary-100)] text-[var(--primary)]"
                />
                Set as default
              </label>
              <button
                type="submit"
                disabled={saving}
                className="w-full h-11 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save address'}
              </button>
            </form>
          </div>
        </div>
    </>
  );
}
