'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, LayoutDashboard, LogOut, MapPin, Package, User } from 'lucide-react';

const nav = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard },
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/orders', label: 'Orders', icon: Package },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === '/account') return pathname === '/account';
  if (href === '/account/profile') return pathname === '/account/profile';
  if (href === '/wishlist') return pathname === '/wishlist';
  if (href === '/orders') return pathname.startsWith('/orders');
  if (href === '/account/addresses') return pathname.startsWith('/account/addresses');
  return false;
}

function linkClasses(active: boolean, variant: 'mobile' | 'desktop') {
  if (variant === 'mobile') {
    return active
      ? 'shrink-0 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white shadow-sm'
      : 'shrink-0 rounded-full border border-[var(--accent)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-body)] hover:border-[var(--primary-100)] hover:text-[var(--text-primary)]';
  }
  return active
    ? 'flex items-center gap-3 rounded-xl bg-[var(--accent)] px-3 py-2.5 text-sm font-semibold text-[var(--primary)] ring-1 ring-[var(--primary-100)]/60'
    : 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-body)] hover:bg-[var(--accent)]/50 hover:text-[var(--text-primary)]';
}

export function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col">
      {/* Mobile: compact pill strip — no nested “dashboard card” */}
      <div className="lg:hidden">
        <p className="mb-3 text-xs font-medium text-[var(--text-body)]">Your account</p>
        <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link key={href} href={href} className={`inline-flex items-center gap-2 ${linkClasses(active, 'mobile')}`}>
                <Icon className="h-4 w-4 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop: flat rail — reads as part of the page, not a floating widget */}
      <div className="hidden lg:flex lg:flex-col lg:gap-1">
        <p className="mb-4 px-3 text-xs font-medium tracking-wide text-[var(--text-body)]">Your account</p>
        <nav className="flex flex-col gap-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link key={href} href={href} className={linkClasses(active, 'desktop')}>
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.25 : 2} aria-hidden />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <form action="/api/auth/logout" method="POST" className="mt-10 border-t border-[var(--accent)] pt-6">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-body)] transition-colors hover:bg-[var(--accent)]/40 hover:text-[var(--primary)]"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden />
            Sign out
          </button>
        </form>
      </div>

      {/* Mobile sign out */}
      <form action="/api/auth/logout" method="POST" className="mt-8 border-t border-[var(--accent)] pt-6 lg:hidden">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--accent)] bg-white px-4 py-3 text-sm font-medium text-[var(--text-body)] transition-colors hover:border-[var(--primary-100)] hover:text-[var(--primary)]"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </button>
      </form>
    </div>
  );
}
