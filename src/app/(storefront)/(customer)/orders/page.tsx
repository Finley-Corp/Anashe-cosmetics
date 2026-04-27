import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { formatPrice } from '@/lib/utils';

export const metadata = { title: 'My Orders' };

const statusColors: Record<string, string> = {
  pending_payment: 'bg-[var(--accent)] text-[var(--primary)]',
  payment_confirmed: 'bg-[var(--primary-100)] text-[var(--primary-hover)]',
  processing: 'bg-[var(--primary-100)] text-[var(--primary-hover)]',
  shipped: 'bg-[var(--accent)] text-[var(--primary)]',
  delivered: 'bg-[var(--primary-100)] text-[var(--primary-hover)]',
  cancelled: 'bg-red-50 text-red-700',
  refunded: 'bg-[var(--accent)] text-[var(--text-body)]',
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
    <>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[var(--text-primary)] mb-2">Orders</h1>
        <p className="text-sm text-[var(--text-body)] max-w-xl leading-relaxed">
          Track shipments and open any order for full details.
        </p>
      </div>

      <div className="bg-white border border-[var(--accent)] rounded-xl overflow-hidden">
        {!orders || orders.length === 0 ? (
          <p className="p-6 text-sm text-[var(--text-body)]">You have not placed any orders yet.</p>
        ) : (
          <div className="divide-y divide-[var(--accent)]">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between p-4 sm:p-5 hover:bg-[var(--accent)]/40 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{order.order_number}</p>
                  <p className="text-xs text-[var(--text-body)]">
                    {new Date(order.created_at).toLocaleDateString('en-KE', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{formatPrice(Number(order.total ?? 0))}</p>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize inline-block mt-1 ${statusColors[order.status] ?? 'bg-[var(--accent)] text-[var(--primary)]'}`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--primary-100)] group-hover:text-[var(--primary)] shrink-0 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
