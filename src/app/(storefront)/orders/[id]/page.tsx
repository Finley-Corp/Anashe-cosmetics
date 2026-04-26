import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { formatPrice } from '@/lib/utils';

export const metadata = { title: 'Order Details' };

const TRACKING_STEPS = [
  { key: 'pending_payment', label: 'Order placed' },
  { key: 'payment_confirmed', label: 'Payment confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
] as const;

const STATUS_TO_STEP_INDEX: Record<string, number> = {
  pending_payment: 0,
  payment_confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
};

const STATUS_TONE: Record<string, string> = {
  pending_payment: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  payment_confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  refunded: 'bg-neutral-100 text-neutral-700 border-neutral-200',
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const service = createServiceClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/orders/${id}`);
  }

  const { data: order } = await service
    .from('orders')
    .select('id,order_number,status,total,shipping_address,created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!order) {
    redirect('/orders');
  }

  const { data: items } = await service
    .from('order_items')
    .select('id,product_name,variant_name,quantity,unit_price')
    .eq('order_id', order.id);

  const isTerminalStatus = order.status === 'cancelled' || order.status === 'refunded';
  const activeStepIndex = STATUS_TO_STEP_INDEX[order.status] ?? 0;

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-10">
      <h1 className="text-2xl font-semibold font-[family-name:var(--font-display)] mb-2">Order {order.order_number}</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Placed on {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>

      <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-700">Tracking</h2>
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_TONE[order.status] ?? 'bg-neutral-100 text-neutral-700 border-neutral-200'}`}>
            {order.status.replace('_', ' ')}
          </span>
        </div>

        {isTerminalStatus ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            This order is {order.status}. Contact support if you need help.
          </div>
        ) : (
          <div>
            <div className="mb-4 hidden items-center px-1 md:flex">
              {TRACKING_STEPS.map((step, index) => {
                const isComplete = index <= activeStepIndex;
                const isCurrent = index === activeStepIndex;
                return (
                  <div key={step.key} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                          isComplete
                            ? 'border-pink-600 bg-pink-600 text-white'
                            : 'border-neutral-300 bg-white text-neutral-400'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <p className={`mt-2 text-xs ${isCurrent ? 'font-semibold text-neutral-900' : 'text-neutral-500'}`}>{step.label}</p>
                    </div>
                    {index < TRACKING_STEPS.length - 1 ? (
                      <div className={`mx-2 h-[2px] flex-1 ${index < activeStepIndex ? 'bg-pink-600' : 'bg-neutral-200'}`} />
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 md:hidden">
              {TRACKING_STEPS.map((step, index) => {
                const isComplete = index <= activeStepIndex;
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        isComplete ? 'bg-pink-600' : 'bg-neutral-300'
                      }`}
                    />
                    <p className={`text-sm ${index === activeStepIndex ? 'font-semibold text-neutral-900' : 'text-neutral-500'}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

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
        </div>
      </div>
    </div>
  );
}
