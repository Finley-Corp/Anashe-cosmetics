'use client';

import { useCallback, useEffect, useState } from 'react';
import { User, Loader2 } from 'lucide-react';
import { useToast } from '@/components/shared/Toaster';

type ProfileDetailsCardProps = {
  initialFullName: string | null;
  email: string;
  initialPhone: string | null;
};

type ProfilePayload = {
  full_name: string | null;
  phone: string | null;
  email: string | null;
};

export function ProfileDetailsCard({
  initialFullName,
  email: initialEmail,
  initialPhone,
}: ProfileDetailsCardProps) {
  const { add: showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [fullName, setFullName] = useState(initialFullName ?? '');
  const [phone, setPhone] = useState(initialPhone ?? '');
  const [email, setEmail] = useState(initialEmail);

  const [baseline, setBaseline] = useState({
    fullName: initialFullName ?? '',
    phone: initialPhone ?? '',
    email: initialEmail,
  });

  const applyPayload = useCallback((data: ProfilePayload) => {
    const nextName = data.full_name ?? '';
    const nextPhone = data.phone ?? '';
    const nextEmail = data.email ?? '';
    setFullName(nextName);
    setPhone(nextPhone);
    setEmail(nextEmail);
    setBaseline({ fullName: nextName, phone: nextPhone, email: nextEmail });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/account/profile', { cache: 'no-store' });
        if (!res.ok || cancelled) return;
        const payload = (await res.json().catch(() => ({}))) as { data?: ProfilePayload };
        if (!payload.data || cancelled) return;
        applyPayload(payload.data);
      } catch {
        /* keep SSR fallbacks */
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applyPayload]);

  async function saveProfile() {
    const name = fullName.trim();
    if (name.length < 2) {
      showToast('Full name must be at least 2 characters', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name, phone }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload.error ?? 'Failed to save profile');
      }

      showToast('Profile updated successfully');
      setIsEditing(false);

      const refresh = await fetch('/api/account/profile', { cache: 'no-store' });
      if (refresh.ok) {
        const body = (await refresh.json().catch(() => ({}))) as { data?: ProfilePayload };
        if (body.data) applyPayload(body.data);
      } else {
        applyPayload({
          full_name: name,
          phone: phone.trim() || null,
          email: email || null,
        });
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to save profile', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  function cancelEdit() {
    setFullName(baseline.fullName);
    setPhone(baseline.phone);
    setEmail(baseline.email);
    setIsEditing(false);
  }

  return (
    <div className="bg-white border border-[var(--accent)] rounded-xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-medium text-[var(--text-primary)] flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--primary)]" strokeWidth={1.25} /> Profile details
        </h2>
        {!isLoading && !isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
          >
            Edit
          </button>
        ) : null}
        {!isLoading && isEditing ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs text-[var(--text-body)] hover:text-[var(--text-primary)] font-medium transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveProfile}
              className="text-xs text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold transition-colors disabled:opacity-60"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Saving
                </span>
              ) : (
                'Save'
              )}
            </button>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="space-y-3 py-2">
          <div className="h-4 w-3/4 max-w-xs animate-pulse rounded bg-[var(--accent)]" />
          <div className="h-4 w-2/3 max-w-sm animate-pulse rounded bg-[var(--accent)]" />
          <div className="h-4 w-1/2 max-w-xs animate-pulse rounded bg-[var(--accent)]" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-[var(--accent)] gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-body)]">Full name</span>
            {isEditing ? (
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-64 max-w-full border border-[var(--primary-100)] rounded-lg px-3 py-1.5 text-sm text-right outline-none focus:border-[var(--primary)] text-[var(--text-primary)] bg-white"
                placeholder="Enter full name"
              />
            ) : (
              <span className="text-sm font-medium text-[var(--text-primary)]">{fullName.trim() ? fullName : 'Not set'}</span>
            )}
          </div>

          <div className="flex justify-between items-center py-2 border-b border-[var(--accent)] gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-body)]">Email</span>
            <span className="text-sm font-medium text-[var(--text-primary)]">{email || 'Not set'}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-[var(--accent)] gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-body)]">Phone</span>
            {isEditing ? (
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-64 max-w-full border border-[var(--primary-100)] rounded-lg px-3 py-1.5 text-sm text-right outline-none focus:border-[var(--primary)] text-[var(--text-primary)] bg-white"
                placeholder="e.g. 0712 345 678"
              />
            ) : (
              <span className="text-sm font-medium text-[var(--text-primary)]">{phone.trim() ? phone : 'Not set'}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
