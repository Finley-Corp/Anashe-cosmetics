import Link from 'next/link';
import { Package, Heart, User, LogOut, ChevronRight, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import { ProfileDetailsCard } from './ProfileDetailsCard';

export const metadata = { title: 'My Account' };

const statusColors: Record<string, string> = {
  pending_payment: 'bg-yellow-50 text-yellow-700',
  payment_confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: wishlist } = await supabase.from('wishlists').select('id').eq('user_id', user?.id ?? '').maybeSingle();

  const [{ data: profile }, { data: orders }, { count: wishlistCount }] = await Promise.all([
    supabase.from('profiles').select('full_name,phone').eq('id', user?.id ?? '').maybeSingle(),
    supabase
      .from('orders')
      .select('id,order_number,status,total,created_at,items:order_items(count)')
      .eq('user_id', user?.id ?? '')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('wishlist_items')
      .select('id', { count: 'exact', head: true })
      .eq('wishlist_id', wishlist?.id ?? ''),
  ]);

  const recentOrders =
    orders?.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      date: new Date(order.created_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: order.status,
      total: Number(order.total ?? 0),
      items: Array.isArray(order.items) ? Number(order.items[0]?.count ?? 0) : 0,
    })) ?? [];

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
          { icon: <Package className="w-5 h-5" />, label: 'My Orders', count: String(recentOrders.length), href: '/orders', color: 'text-blue-600 bg-blue-50' },
          { icon: <Heart className="w-5 h-5" />, label: 'Wishlist', count: String(wishlistCount ?? 0), href: '/wishlist', color: 'text-red-500 bg-red-50' },
          { icon: <User className="w-5 h-5" />, label: 'Addresses', count: 'Manage', href: '/account/addresses', color: 'text-green-700 bg-green-50' },
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
        <ProfileDetailsCard
          initialFullName={profile?.full_name ?? null}
          email={user?.email ?? 'Not set'}
          initialPhone={profile?.phone ?? null}
        />

        {/* Recent Orders */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Recent Orders</h2>
            <Link href="/orders" className="text-xs text-green-700 hover:text-green-800 font-medium transition-colors">View all</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-neutral-500">No recent orders yet.</p>
            ) : null}
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors group">
                <div>
                  <p className="text-sm font-semibold">{order.orderNumber}</p>
                  <p className="text-xs text-neutral-500">{order.date} · {order.items} items</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-sm font-bold">{formatPrice(order.total)}</p>
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
