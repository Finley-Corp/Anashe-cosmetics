import * as React from 'react';
import { cn } from '@/lib/utils';

export function Sheet({ open, children }: { open?: boolean; children: React.ReactNode }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50">{children}</div>;
}

export function SheetOverlay({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('fixed inset-0 bg-black/40', className)} {...props} />;
}

export function SheetContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-neutral-200 bg-white p-6 shadow-lg',
        className
      )}
      {...props}
    />
  );
}
