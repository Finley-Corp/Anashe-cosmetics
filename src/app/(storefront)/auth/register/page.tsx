'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/shared/Toaster';

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const { add: showToast } = useToast();
  const redirect = searchParams.get('redirect') ?? '/account';

  async function handleGoogleRegister() {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const callbackUrl = new URL('/auth/callback', window.location.origin);
      callbackUrl.searchParams.set('next', redirect);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Google sign-up failed', 'error');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/home" className="text-2xl font-bold tracking-tighter font-[family-name:var(--font-display)]">ANASHE</Link>
          <h1 className="text-xl font-semibold mt-6 mb-2">Create your account</h1>
          <p className="text-sm text-neutral-500">Customer accounts are created with Google only</p>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm">
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Continue with Google
          </button>

          <p className="text-xs text-neutral-400 mt-4">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-green-700 hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-green-700 hover:underline">Privacy Policy</Link>.
          </p>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Already use Google with Anashe?{' '}
            <Link href={`/auth/login${redirect !== '/account' ? `?redirect=${redirect}` : ''}`} className="text-green-700 hover:text-green-800 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
