import * as React from 'react';
import { cn } from '@/lib/utils';

export function Pagination({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <nav aria-label="pagination" className={cn('mx-auto flex w-full justify-center', className)} {...props} />;
}

export function PaginationContent({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn('flex flex-row items-center gap-1', className)} {...props} />;
}

export function PaginationItem({ ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return <li {...props} />;
}

export function PaginationLink({
  className,
  isActive,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { isActive?: boolean }) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm transition-colors',
        isActive ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100',
        className
      )}
      {...props}
    />
  );
}
