import Link from 'next/link';
import { Package, Heart, MapPin, User, LogOut, ChevronRight, ShoppingBag } from 'lucide-react';

export const metadata = { title: 'My Account' };

const DEMO_ORDERS = [
  { id: 'ANS-001', date: 'Apr 10, 2026', status: 'delivered', total: 8300, items: 3 },
  { id: 'ANS-002', date: 'Apr 3, 2026', status: 'processing', total: 4500, items: 1 },
  { id: 'ANS-003', date: 'Mar 25, 2026', status: 'shipped', total: 12600, items: 4 },
];

const statusColors: Record<string, string> = {
  pending_payment: 'bg-yellow-50 text-yellow-700',
  payment_confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

export default function AccountPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold font-[family-name:var(--font-display)]">My Account</h1>
        <form action="/api/auth/logout" method="POST">
          <button className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: <Package className="w-5 h-5" />, label: 'My Orders', count: '3', href: '/orders', color: 'text-blue-600 bg-blue-50' },
          { icon: <Heart className="w-5 h-5" />, label: 'Wishlist', count: '7', href: '/wishlist', color: 'text-red-500 bg-red-50' },
          { icon: <MapPin className="w-5 h-5" />, label: 'Addresses', count: '2', href: '/account/addresses', color: 'text-green-700 bg-green-50' },
        ].map((card) => (
          <Link key={card.label} href={card.href} className="bg-white border border-neutral-100 rounded-2xl p-6 hover:border-neutral-300 hover:shadow-sm transition-all group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-10 h-10 flex items-center justify-center rounded-xl ${card.color}`}>{card.icon}</span>
              <div>
                <p className="font-semibold">{card.label}</p>
                <p className="text-sm text-neutral-500">{card.count} items</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Profile */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white border border-neutral-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold flex items-center gap-2"><User className="w-4 h-4" /> Profile Details</h2>
            <button className="text-xs text-green-700 hover:text-green-800 font-medium transition-colors">Edit</button>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Full Name', value: 'Wanjiku Kamau' },
              { label: 'Email', value: 'wanjiku@example.com' },
              { label: 'Phone', value: '0712 345 678' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-neutral-50">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{label}</span>
                <span className="text-sm font-medium text-neutral-700">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Recent Orders</h2>
            <Link href="/orders" className="text-xs text-green-700 hover:text-green-800 font-medium transition-colors">View all</Link>
          </div>
          <div className="space-y-3">
            {DEMO_ORDERS.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group">
                <div>
                  <p className="text-sm font-semibold">{order.id}</p>
                  <p className="text-xs text-neutral-500">{order.date} · {order.items} items</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-sm font-bold">KES {order.total.toLocaleString()}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[order.status] ?? 'bg-neutral-100 text-neutral-600'}`}>
                      {order.status}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
