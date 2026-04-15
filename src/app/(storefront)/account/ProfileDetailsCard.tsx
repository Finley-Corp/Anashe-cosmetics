'use client';

import { useState } from 'react';
import { User, Loader2 } from 'lucide-react';
import { useToast } from '@/components/shared/Toaster';

type ProfileDetailsCardProps = {
  initialFullName: string | null;
  email: string;
  initialPhone: string | null;
};

export function ProfileDetailsCard({
  initialFullName,
  email,
  initialPhone,
}: ProfileDetailsCardProps) {
  const { add: showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState(initialFullName ?? '');
  const [phone, setPhone] = useState(initialPhone ?? '');

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
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to save profile', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  function cancelEdit() {
    setFullName(initialFullName ?? '');
    setPhone(initialPhone ?? '');
    setIsEditing(false);
  }

  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold flex items-center gap-2">
          <User className="w-4 h-4" /> Profile Details
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors"
          >
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={cancelEdit}
              className="text-xs text-neutral-500 hover:text-neutral-700 font-medium transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
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
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-neutral-50 gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Full Name</span>
          {isEditing ? (
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-64 max-w-full border border-neutral-200 rounded-md px-3 py-1.5 text-sm text-right outline-none focus:border-[var(--primary)]"
              placeholder="Enter full name"
            />
          ) : (
            <span className="text-sm font-medium text-neutral-700">{fullName.trim() ? fullName : 'Not set'}</span>
          )}
        </div>

        <div className="flex justify-between items-center py-2 border-b border-neutral-50 gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Email</span>
          <span className="text-sm font-medium text-neutral-700">{email || 'Not set'}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-neutral-50 gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Phone</span>
          {isEditing ? (
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-64 max-w-full border border-neutral-200 rounded-md px-3 py-1.5 text-sm text-right outline-none focus:border-[var(--primary)]"
              placeholder="e.g. 0712 345 678"
            />
          ) : (
            <span className="text-sm font-medium text-neutral-700">{phone.trim() ? phone : 'Not set'}</span>
          )}
        </div>
      </div>
    </div>
  );
}
