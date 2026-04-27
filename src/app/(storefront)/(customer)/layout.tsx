import { CustomerSidebar } from '@/components/storefront/CustomerSidebar';

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--canvas)] text-[var(--text-primary)] min-h-[calc(100vh-5rem)]">
      <div className="mx-auto max-w-[1440px] px-4 pt-8 pb-16 sm:px-6 lg:flex lg:px-8 lg:pt-12 lg:pb-20">
        <aside className="mb-10 shrink-0 lg:sticky lg:top-24 lg:mb-0 lg:w-[220px] lg:border-r lg:border-[var(--accent)] lg:pr-8 xl:w-[240px]">
          <CustomerSidebar />
        </aside>
        <div className="min-w-0 flex-1 lg:pl-10 xl:pl-12">{children}</div>
      </div>
    </div>
  );
}
