'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Star, LogOut, Store
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/auth/login');
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-100 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-neutral-100">
        <Link href="/home" className="flex items-center gap-2 text-lg font-bold tracking-tighter font-[family-name:var(--font-display)]">
          <span className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">A</span>
          ANASHE
        </Link>
        <p className="text-[10px] text-neutral-400 mt-0.5 ml-10">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-neutral-100 space-y-1">
        <Link href="/home" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
          <Store className="w-4 h-4 text-neutral-400" />
          View Storefront
        </Link>
        <button
          onClick={() => void handleSignOut()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4 text-neutral-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
