import { TrendingUp, ShoppingCart, Users, DollarSign, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { createServiceClient } from '@/lib/supabase/service';
import { formatPrice } from '@/lib/utils';

export const metadata = { title: 'Dashboard | Anashe Admin' };

const STATUS_BADGE: Record<string, string> = {
  pending_payment: 'bg-yellow-50 text-yellow-700',
  payment_confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-indigo-50 text-indigo-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-neutral-100 text-neutral-700',
  cancelled: 'bg-red-50 text-red-600',
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
  const KPI_CARDS = [
    { label: 'Total Revenue (all)', value: formatPrice(totalRevenue), change: 'Live', up: true, icon: DollarSign, color: 'text-neutral-900 bg-neutral-100' },
    { label: 'Total Orders', value: String(totalOrders), change: 'Live', up: true, icon: ShoppingCart, color: 'text-blue-600 bg-blue-50' },
    { label: 'Customers', value: String(customerCount ?? 0), change: 'Live', up: true, icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Avg Order Value', value: formatPrice(aov), change: 'Live', up: true, icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 font-[family-name:var(--font-display)]">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">{today}</p>
        </div>
        <div className="flex gap-3">
          <select className="text-sm border border-neutral-200 rounded-xl px-4 py-2.5 bg-white outline-none focus:border-neutral-400">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>This month</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map((card) => (
          <div key={card.label} className="bg-white border border-neutral-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{card.label}</p>
              <span className={`w-9 h-9 flex items-center justify-center rounded-xl ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-bold text-neutral-900 mb-1">{card.value}</p>
            <div className={`flex items-center gap-1 text-xs font-semibold ${card.up ? 'text-neutral-600' : 'text-red-500'}`}>
              {card.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {card.change} vs last period
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-neutral-900">Revenue Overview</h2>
          <div className="flex gap-2">
            {['Daily', 'Weekly', 'Monthly'].map((t, i) => (
              <button key={t} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${i === 0 ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>{t}</button>
            ))}
          </div>
        </div>
        <RevenueChart />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-neutral-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-neutral-900">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-neutral-700 hover:text-neutral-900 font-medium">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  {['Order', 'Customer', 'Date', 'Total', 'Status'].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider first:pl-0 last:pr-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(recentOrders ?? []).map((order) => (
                  <tr key={order.order_number} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3 px-3 pl-0 font-semibold text-neutral-900">{order.order_number}</td>
                    <td className="py-3 px-3 text-neutral-700">{`Customer ${String(order.user_id).slice(0, 8)}`}</td>
                    <td className="py-3 px-3 text-neutral-500">{new Date(order.created_at).toLocaleDateString('en-KE')}</td>
                    <td className="py-3 px-3 font-semibold">{formatPrice(Number(order.total))}</td>
                    <td className="py-3 px-3 pr-0">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[order.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Status */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-neutral-700" /> Stock Status
            </h2>
            <a href="/admin/products" className="text-xs text-neutral-700 hover:text-neutral-900 font-medium">Manage</a>
          </div>
          <div className="space-y-3">
            {[
              { label: 'In Stock', value: String(inStockCount), color: 'text-emerald-700 bg-emerald-50' },
              { label: 'Out of Stock', value: String(outOfStockCount), color: 'text-red-700 bg-red-50' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-neutral-100 px-3 py-3">
                <span className="text-sm text-neutral-700">{label}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
