import * as React from 'react';
import { cn } from '@/lib/utils';

export function Drawer({ open, children }: { open?: boolean; children: React.ReactNode }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50">{children}</div>;
}

export function DrawerOverlay({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('fixed inset-0 bg-black/40', className)} {...props} />;
}

export function DrawerContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 rounded-t-xl border border-neutral-200 bg-white p-6 shadow-lg',
        className
      )}
      {...props}
    />
  );
}
