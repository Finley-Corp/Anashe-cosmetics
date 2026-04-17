'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/shared/Toaster';
import { useCartStore } from '@/store/cart';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { add: showToast } = useToast();
  const { getItemCount } = useCartStore();
  const fallbackRedirect = getItemCount() > 0 ? '/checkout' : '/account';
  const redirect = searchParams.get('redirect') ?? fallbackRedirect;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showToast('Welcome back!');
      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/home" className="text-2xl font-bold tracking-tighter font-[family-name:var(--font-display)]">ANASHE</Link>
          <h1 className="text-xl font-semibold mt-6 mb-2">Welcome back</h1>
          <p className="text-sm text-neutral-500">Sign in to your account</p>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
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
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-green-700 hover:text-green-800 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-green-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href={`/auth/register${redirect !== fallbackRedirect ? `?redirect=${redirect}` : ''}`} className="text-green-700 hover:text-green-800 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-700 border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
