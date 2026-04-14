import { AdminSidebar } from '@/components/admin/Sidebar';

export const metadata = { title: 'Admin Dashboard | Anashe' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar />
      <main className="flex-1 pl-64 min-h-screen">
        <div className="p-6 md:p-8 max-w-[1400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
