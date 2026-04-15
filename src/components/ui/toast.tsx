import * as React from 'react';
import { cn } from '@/lib/utils';

export function ToastViewport({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('fixed right-4 top-4 z-50 flex max-w-sm flex-col gap-2', className)} {...props} />;
}

export function Toast({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-lg border border-neutral-200 bg-white p-3 shadow', className)} {...props} />;
}

export function ToastTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn('text-sm font-semibold', className)} {...props} />;
}

export function ToastDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs text-neutral-600', className)} {...props} />;
}
