import * as React from 'react';
import { cn } from '@/lib/utils';

export function RadioGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="radiogroup" className={cn('grid gap-2', className)} {...props} />;
}

export type RadioGroupItemProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="radio"
      className={cn('h-4 w-4 border-neutral-300 accent-neutral-900', className)}
      {...props}
    />
  )
);

RadioGroupItem.displayName = 'RadioGroupItem';
