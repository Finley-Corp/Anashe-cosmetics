import { AdminSidebar } from '@/components/admin/Sidebar';

export const metadata = { title: 'Admin Dashboard | Anashe' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#09090b] text-gray-300">
      <AdminSidebar />
      <main className="flex-1 min-h-screen sm:pl-16">
        <div className="max-w-[1400px] p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
