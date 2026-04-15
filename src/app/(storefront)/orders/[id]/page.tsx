import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';

export const metadata = { title: 'Order Details' };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/orders/${id}`);
  }

  const { data: order } = await supabase
    .from('orders')
    .select('id,order_number,status,total,shipping_address,mpesa_receipt,created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!order) {
    notFound();
  }

  const { data: items } = await supabase
    .from('order_items')
    .select('id,product_name,variant_name,quantity,unit_price')
    .eq('order_id', order.id);

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-10">
      <h1 className="text-2xl font-semibold font-[family-name:var(--font-display)] mb-2">Order {order.order_number}</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Placed on {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-neutral-100 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Items</h2>
          <div className="space-y-3">
            {(items ?? []).map((item) => (
              <div key={item.id} className="flex justify-between items-start border-b border-neutral-100 pb-3 last:border-none">
                <div>
                  <p className="text-sm font-medium">{item.product_name}</p>
                  {item.variant_name ? <p className="text-xs text-neutral-500">{item.variant_name}</p> : null}
                  <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(Number(item.unit_price) * Number(item.quantity))}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold">Summary</h2>
          <p className="text-sm">Status: <span className="font-medium capitalize">{order.status.replace('_', ' ')}</span></p>
          <p className="text-sm">Total: <span className="font-semibold">{formatPrice(Number(order.total ?? 0))}</span></p>
          <p className="text-sm">M-Pesa Receipt: <span className="font-medium">{order.mpesa_receipt ?? 'Pending'}</span></p>
        </div>
      </div>
    </div>
  );
}
