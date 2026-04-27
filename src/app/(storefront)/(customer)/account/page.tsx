import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Package, Heart, User, ChevronRight, ShoppingBag, IdCard } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { formatPrice } from '@/lib/utils';
export const metadata = { title: 'My Account' };

const statusColors: Record<string, string> = {
  pending_payment: 'bg-[var(--accent)] text-[var(--primary)]',
  payment_confirmed: 'bg-[var(--primary-100)] text-[var(--primary-hover)]',
  processing: 'bg-[var(--primary-100)] text-[var(--primary-hover)]',
  shipped: 'bg-[var(--accent)] text-[var(--primary)]',
  delivered: 'bg-[var(--primary-100)] text-[var(--primary-hover)]',
  cancelled: 'bg-red-50 text-red-700',
};

export default async function AccountPage() {
  const supabase = await createClient();
  const service = createServiceClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/account');
  }

  const { data: wishlist } = await supabase.from('wishlists').select('id').eq('user_id', user.id).maybeSingle();

  const [{ data: profileOverview }, { data: orders }, { count: wishlistCount }, { count: orderCount }] =
    await Promise.all([
    service.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
    service
      .from('orders')
      .select('id,order_number,status,total,created_at,items:order_items(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('wishlist_items')
      .select('id', { count: 'exact', head: true })
      .eq('wishlist_id', wishlist?.id ?? ''),
      service.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
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
    <>
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[var(--text-primary)]">Overview</h1>
        <p className="mt-2 text-sm text-[var(--text-body)] max-w-lg leading-relaxed">
          {profileOverview?.full_name?.trim() ? (
            <>
              Signed in as{' '}
              <span className="font-medium text-[var(--text-primary)]">{profileOverview.full_name.trim()}</span>
              {' — '}
            </>
          ) : null}
          Orders, wishlist, and profile — everything in one place.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-10">
          {[
            {
              icon: <IdCard className="w-5 h-5" strokeWidth={1.25} />,
              label: 'Profile',
              sub: 'Name & contact',
              href: '/account/profile',
            },
            {
              icon: <Package className="w-5 h-5" strokeWidth={1.25} />,
              label: 'My orders',
              sub: `${orderCount ?? 0} total`,
              href: '/orders',
            },
            {
              icon: <Heart className="w-5 h-5" strokeWidth={1.25} />,
              label: 'Wishlist',
              sub: `${wishlistCount ?? 0} saved`,
              href: '/wishlist',
            },
            {
              icon: <User className="w-5 h-5" strokeWidth={1.25} />,
              label: 'Addresses',
              sub: 'Delivery & billing',
              href: '/account/addresses',
            },
          ].map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white border border-[var(--accent)] rounded-xl p-5 md:p-6 hover:border-[var(--primary-100)] hover:shadow-sm transition-all group flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-11 h-11 flex shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--primary)]">
                  {card.icon}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-[var(--text-primary)] truncate">{card.label}</p>
                  <p className="text-sm text-[var(--text-body)] truncate">{card.sub}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--primary-100)] group-hover:text-[var(--primary)] shrink-0 transition-colors" />
            </Link>
          ))}
        </div>

        <div className="max-w-3xl">
          <div className="bg-white border border-[var(--accent)] rounded-xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[var(--primary)]" strokeWidth={1.25} /> Recent orders
              </h2>
              <Link
                href="/orders"
                className="text-xs font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-[var(--text-body)]">No orders yet — when you shop, they will appear here.</p>
              ) : null}
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-[var(--accent)] hover:bg-[var(--accent)]/30 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{order.orderNumber}</p>
                    <p className="text-xs text-[var(--text-body)]">
                      {order.date} · {order.items} items
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{formatPrice(order.total)}</p>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[order.status] ?? 'bg-[var(--accent)] text-[var(--primary)]'}`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--primary-100)] group-hover:text-[var(--primary)] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
    </>
  );
}
