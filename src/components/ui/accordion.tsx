import * as React from 'react';
import { cn } from '@/lib/utils';

export function Accordion({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full space-y-2', className)} {...props} />;
}

export function AccordionItem({ className, ...props }: React.HTMLAttributes<HTMLDetailsElement>) {
  return <details className={cn('rounded-md border border-neutral-200', className)} {...props} />;
}

export function AccordionTrigger({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <summary
      className={cn('cursor-pointer list-none select-none px-4 py-3 text-sm font-medium hover:bg-neutral-50', className)}
      {...props}
    />
  );
}

export function AccordionContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-4 pb-4 text-sm text-neutral-600', className)} {...props} />;
}
