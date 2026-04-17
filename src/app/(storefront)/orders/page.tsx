import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { formatPrice } from '@/lib/utils';

export const metadata = { title: 'My Orders' };

const statusColors: Record<string, string> = {
  pending_payment: 'bg-yellow-50 text-yellow-700',
  payment_confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  refunded: 'bg-neutral-100 text-neutral-700',
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const service = createServiceClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/orders');
  }

  const { data: orders } = await service
    .from('orders')
    .select('id,order_number,status,total,created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6 font-[family-name:var(--font-display)]">My Orders</h1>
      <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
        {!orders || orders.length === 0 ? (
          <p className="p-6 text-sm text-neutral-500">You have not placed any orders yet.</p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold">{order.order_number}</p>
                  <p className="text-xs text-neutral-500">
                    {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatPrice(Number(order.total ?? 0))}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[order.status] ?? 'bg-neutral-100 text-neutral-700'}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
