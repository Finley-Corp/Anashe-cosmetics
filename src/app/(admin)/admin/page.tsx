import Link from 'next/link';
import { TrendingUp, ShoppingCart, Users, DollarSign, Package, ArrowRight } from 'lucide-react';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { createServiceClient } from '@/lib/supabase/service';
import { formatPrice } from '@/lib/utils';

export const metadata = { title: 'Dashboard | Anashe Admin' };

const STATUS_BADGE: Record<string, string> = {
  pending_payment: 'bg-yellow-500/15 text-yellow-300',
  payment_confirmed: 'bg-sky-500/15 text-sky-300',
  processing: 'bg-indigo-500/15 text-indigo-300',
  shipped: 'bg-purple-500/15 text-purple-300',
  delivered: 'bg-emerald-500/15 text-emerald-300',
  cancelled: 'bg-red-500/15 text-red-300',
};

export default async function AdminDashboard() {
  const supabase = createServiceClient();
  const [{ data: productStockRows }, { data: recentOrders }, { data: revenueOrders }, { count: customerCount }] = await Promise.all([
    supabase
      .from('products')
      .select('stock')
      .eq('is_published', true)
      .order('stock', { ascending: true }),
    supabase
      .from('orders')
      .select('order_number,total,status,created_at,user_id')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('orders')
      .select('total,status')
      .neq('status', 'cancelled'),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'customer'),
  ]);

  const inStockCount = (productStockRows ?? []).filter((row) => (row.stock ?? 0) > 0).length;
  const outOfStockCount = (productStockRows ?? []).filter((row) => (row.stock ?? 0) <= 0).length;
  const totalOrders = revenueOrders?.length ?? 0;
  const totalRevenue = (revenueOrders ?? []).reduce((sum, row) => sum + Number(row.total ?? 0), 0);
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const today = new Date().toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const pendingPayments = (revenueOrders ?? []).filter((row) => row.status === 'pending_payment').length;
  const awaitingDispatch = (revenueOrders ?? []).filter((row) => row.status === 'payment_confirmed' || row.status === 'processing').length;
  const deliveredCount = (revenueOrders ?? []).filter((row) => row.status === 'delivered').length;

  const KPI_CARDS = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'bg-sky-400 text-black' },
    { label: 'Total Orders', value: String(totalOrders), icon: ShoppingCart, color: 'bg-[#E8E2B5] text-black' },
    { label: 'Customers', value: String(customerCount ?? 0), icon: Users, color: 'bg-fuchsia-500 text-black' },
    { label: 'Avg Order Value', value: formatPrice(aov), icon: TrendingUp, color: 'bg-[#1A1D21] text-white border border-white/10' },
  ];

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#09090b] px-4 py-3 md:px-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">Active Pipeline</h1>
          <p className="mt-0.5 text-xs text-gray-500">{today}</p>
        </div>
        <button className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-gray-200">
          New Deal
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <div key={card.label} className={`relative flex h-44 flex-col justify-between rounded-2xl p-5 transition-transform hover:scale-[1.01] ${card.color}`}>
            <div className="flex items-center justify-between opacity-70">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em]">{card.label}</p>
              <card.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs opacity-70">Live overview</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">{card.value}</p>
            </div>
            <div className="text-xs opacity-70">Updated now</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#1A1D21] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Revenue Forecast</h2>
              <p className="text-xs text-gray-500">Projected earnings</p>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-sky-300">Forecast</span>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-gray-400">Actual</span>
            </div>
          </div>
          <RevenueChart />
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#1A1D21] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Stock Status</h2>
            <Link href="/admin/products" className="text-xs text-gray-400 hover:text-white">Manage</Link>
          </div>
          <div className="space-y-3">
            {[
              { label: 'In Stock', value: String(inStockCount), color: 'bg-emerald-500/15 text-emerald-300' },
              { label: 'Out of Stock', value: String(outOfStockCount), color: 'bg-red-500/15 text-red-300' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
                <span className="text-sm text-gray-300">{label}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-white/5 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Pending Payments</span>
              <span className="font-semibold text-yellow-300">{pendingPayments}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Awaiting Dispatch</span>
              <span className="font-semibold text-sky-300">{awaitingDispatch}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Delivered</span>
              <span className="font-semibold text-emerald-300">{deliveredCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#1A1D21] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Order', 'Customer', 'Date', 'Total', 'Status'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 first:pl-0 last:pr-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(recentOrders ?? []).map((order) => (
                  <tr key={order.order_number} className="border-b border-white/5">
                    <td className="px-3 py-3 pl-0 font-semibold text-white">{order.order_number}</td>
                    <td className="px-3 py-3 text-gray-300">{`Customer ${String(order.user_id).slice(0, 8)}`}</td>
                    <td className="px-3 py-3 text-gray-500">{new Date(order.created_at).toLocaleDateString('en-KE')}</td>
                    <td className="px-3 py-3 font-semibold text-white">{formatPrice(Number(order.total))}</td>
                    <td className="px-3 py-3 pr-0">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${STATUS_BADGE[order.status] ?? 'bg-white/10 text-gray-300'}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#1A1D21] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Priority Tasks</h2>
            <button className="text-[11px] text-gray-500 hover:text-white">View all</button>
          </div>
          <div className="space-y-3">
            {[
              'Review order exceptions',
              'Approve pending product updates',
              'Check low performing SKUs',
            ].map((task, idx) => (
              <div key={task} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <p className="text-xs font-medium text-white">{task}</p>
                <p className="mt-1 text-[11px] text-gray-500">Task #{idx + 1} - Today</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
