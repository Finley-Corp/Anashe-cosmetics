'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/shared/Toaster';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const { add: showToast } = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/login`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      showToast('Password reset email sent. Check your inbox.');
      setEmail('');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Unable to send reset email', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/home" className="text-2xl font-bold tracking-tighter font-[family-name:var(--font-display)]">
            ANASHE
          </Link>
          <h1 className="text-xl font-semibold mt-6 mb-2">Forgot password</h1>
          <p className="text-sm text-neutral-500">We&apos;ll email you a reset link.</p>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              Send reset link
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Remembered your password?{' '}
            <Link href="/auth/login" className="text-green-700 hover:text-green-800 font-semibold transition-colors">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

