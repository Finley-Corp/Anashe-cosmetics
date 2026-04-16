'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Star, LogOut, Store, Command,
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
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-16 flex-col items-center border-r border-white/5 bg-[#0c0c0e] py-6 sm:flex">
      <div className="mb-2 text-white">
        <Link
          href="/admin"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
          title="Admin home"
        >
          <Command className="h-4.5 w-4.5" />
        </Link>
      </div>

      <nav className="mt-4 flex flex-1 flex-col items-center gap-4">
        {NAV.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`rounded-lg p-2.5 transition-all duration-300 ${
                isActive
                  ? 'bg-white/10 text-white ring-1 ring-white/10'
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-3">
        <Link
          href="/home"
          title="View storefront"
          className="rounded-lg p-2.5 text-gray-500 transition-all duration-300 hover:bg-white/5 hover:text-white"
        >
          <Store className="h-5 w-5" />
        </Link>
        <button
          onClick={() => void handleSignOut()}
          title="Sign out"
          className="rounded-lg p-2.5 text-gray-500 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}
