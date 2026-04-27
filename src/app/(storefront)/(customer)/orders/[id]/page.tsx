import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { formatPrice } from '@/lib/utils';
import { OrderDetailToolbar } from '@/components/storefront/OrderDetailToolbar';

export const metadata = { title: 'Order Details' };

type ShippingAddressJson = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  county?: string | null;
  country?: string | null;
};

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
  pending_payment: 'bg-[var(--accent)] text-[var(--primary)] border-[var(--primary-100)]',
  payment_confirmed: 'bg-[var(--primary-100)] text-[var(--primary-hover)] border-[var(--primary-100)]',
  processing: 'bg-[var(--primary-100)] text-[var(--primary-hover)] border-[var(--primary-100)]',
  shipped: 'bg-[var(--accent)] text-[var(--primary)] border-[var(--primary-100)]',
  delivered: 'bg-[var(--primary-100)] text-[var(--primary-hover)] border-[var(--primary-100)]',
  cancelled: 'bg-red-50 text-red-700 border-red-100',
  refunded: 'bg-[var(--accent)] text-[var(--text-body)] border-[var(--accent)]',
};

function formatShipping(addr: unknown): ShippingAddressJson | null {
  if (!addr || typeof addr !== 'object') return null;
  return addr as ShippingAddressJson;
}

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
    .select(
      'id,order_number,status,total,subtotal,discount_amount,shipping_amount,shipping_address,created_at,updated_at,payment_phone,mpesa_receipt,shipping_rider_name,shipping_rider_phone'
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!order) {
    redirect('/orders');
  }

  const { data: items } = await service
    .from('order_items')
    .select('id,product_id,product_name,variant_name,quantity,unit_price,product_image')
    .eq('order_id', order.id);

  const productIds = [...new Set((items ?? []).map((row) => row.product_id).filter(Boolean))];
  let slugByProductId: Record<string, string> = {};
  if (productIds.length > 0) {
    const { data: slugRows } = await service.from('products').select('id,slug').in('id', productIds as string[]);
    slugByProductId = Object.fromEntries((slugRows ?? []).map((row) => [row.id as string, row.slug as string]));
  }

  const shipping = formatShipping(order.shipping_address);

  const isTerminalStatus = order.status === 'cancelled' || order.status === 'refunded';
  const activeStepIndex = STATUS_TO_STEP_INDEX[order.status] ?? 0;

  const discount = Number(order.discount_amount ?? 0);
  const shippingAmt = Number(order.shipping_amount ?? 0);

  return (
    <>
      <Link
        href="/orders"
        className="inline-flex text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] mb-4 transition-colors"
      >
        ← Back to orders
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6 mb-2">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[var(--text-primary)] break-words">
            Order {order.order_number}
          </h1>
          <p className="text-sm text-[var(--text-body)] mt-2">
            Placed on{' '}
            {new Date(order.created_at).toLocaleDateString('en-KE', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <OrderDetailToolbar orderNumber={order.order_number} />

      <div className="mb-6 rounded-xl border border-[var(--accent)] bg-white p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-body)]">Tracking</h2>
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_TONE[order.status] ?? 'bg-[var(--accent)] text-[var(--primary)] border-[var(--accent)]'}`}
          >
            {order.status.replace('_', ' ')}
          </span>
        </div>

        <p className="mb-4 text-xs text-[var(--text-body)] lg:hidden">
          Progress updates when your order moves — current step is highlighted below.
        </p>

        {isTerminalStatus ? (
          <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent)]/50 px-4 py-3 text-sm text-[var(--text-body)]">
            This order is {order.status.replace('_', ' ')}. Use &quot;Help with this order&quot; if you need support.
          </div>
        ) : (
          <div>
            <div className="mb-2 hidden items-center px-1 md:flex">
              {TRACKING_STEPS.map((step, index) => {
                const isPast = index < activeStepIndex;
                const isCurrent = index === activeStepIndex;
                return (
                  <div key={step.key} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                          isPast
                            ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                            : isCurrent
                              ? 'border-[var(--primary)] bg-white text-[var(--primary)] ring-2 ring-[var(--primary)] ring-offset-2'
                              : 'border-neutral-300 bg-white text-neutral-400'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <p
                        className={`mt-2 max-w-[88px] text-xs leading-tight ${isCurrent ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-body)]'}`}
                      >
                        {step.label}
                      </p>
                    </div>
                    {index < TRACKING_STEPS.length - 1 ? (
                      <div
                        className={`mx-1 h-[2px] min-w-[8px] flex-1 ${index < activeStepIndex ? 'bg-[var(--primary)]' : 'bg-neutral-200'}`}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 md:hidden">
              {TRACKING_STEPS.map((step, index) => {
                const isPast = index < activeStepIndex;
                const isCurrent = index === activeStepIndex;
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${
                        isPast
                          ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                          : isCurrent
                            ? 'border-[var(--primary)] bg-white text-[var(--primary)] ring-2 ring-[var(--primary)]'
                            : 'border-neutral-300 bg-white text-neutral-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <p className={`text-sm ${isCurrent ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-body)]'}`}>
                      {step.label}
                      {isCurrent ? <span className="ml-2 text-xs font-normal text-[var(--primary)]">(current)</span> : null}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-white border border-[var(--accent)] rounded-xl p-5 md:p-6">
            <h2 className="font-medium text-[var(--text-primary)] mb-4">Items</h2>
            <div className="space-y-4">
              {(items ?? []).map((item) => {
                const slug = slugByProductId[item.product_id];
                const lineTotal = Number(item.unit_price) * Number(item.quantity);
                const inner = (
                  <>
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[var(--accent)] bg-[var(--accent)]/40">
                      {item.product_image ? (
                        // eslint-disable-next-line @next/next/no-img-element -- snapshot URL from checkout
                        <img src={item.product_image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--text-body)]">
                          —
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{item.product_name}</p>
                      {item.variant_name ? <p className="text-xs text-[var(--text-body)]">{item.variant_name}</p> : null}
                      <p className="text-xs text-[var(--text-body)]">Qty: {item.quantity}</p>
                      {slug ? (
                        <Link
                          href={`/products/${slug}`}
                          className="mt-1 inline-block text-xs font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline"
                        >
                          View product
                        </Link>
                      ) : null}
                    </div>
                    <p className="text-sm font-semibold text-[var(--text-primary)] shrink-0">{formatPrice(lineTotal)}</p>
                  </>
                );

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 justify-between border-b border-[var(--accent)] pb-4 last:border-none last:pb-0"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>

          {(order.status === 'shipped' || order.status === 'delivered') &&
          (order.shipping_rider_name || order.shipping_rider_phone) ? (
            <div className="bg-white border border-[var(--accent)] rounded-xl p-5 md:p-6">
              <h2 className="font-medium text-[var(--text-primary)] mb-3">Delivery contact</h2>
              <p className="text-xs text-[var(--text-body)] mb-3">
                Your parcel is handled by our dispatch partner. Reach them directly if needed.
              </p>
              <dl className="space-y-2 text-sm">
                {order.shipping_rider_name ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--text-body)]">Rider</dt>
                    <dd className="font-medium text-[var(--text-primary)] text-right">{order.shipping_rider_name}</dd>
                  </div>
                ) : null}
                {order.shipping_rider_phone ? (
                  <div className="flex justify-between gap-4 items-center">
                    <dt className="text-[var(--text-body)]">Contact</dt>
                    <dd>
                      <a
                        href={`tel:${String(order.shipping_rider_phone).replace(/\s/g, '')}`}
                        className="font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline"
                      >
                        {order.shipping_rider_phone}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}

          {shipping?.line1 || shipping?.city ? (
            <div className="bg-white border border-[var(--accent)] rounded-xl p-5 md:p-6">
              <h2 className="font-medium text-[var(--text-primary)] mb-3">Shipping address</h2>
              <div className="text-sm text-[var(--text-body)] leading-relaxed space-y-0.5">
                <p className="font-medium text-[var(--text-primary)]">{shipping.line1}</p>
                {shipping.line2 ? <p>{shipping.line2}</p> : null}
                <p>
                  {[shipping.city, shipping.county].filter(Boolean).join(', ')}
                  {shipping.country ? ` · ${shipping.country}` : ''}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white border border-[var(--accent)] rounded-xl p-5 md:p-6 space-y-3 lg:sticky lg:top-28">
            <h2 className="font-medium text-[var(--text-primary)]">Order summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-body)]">Subtotal</dt>
                <dd className="font-medium text-[var(--text-primary)]">{formatPrice(Number(order.subtotal ?? 0))}</dd>
              </div>
              {discount > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--text-body)]">Discount</dt>
                  <dd className="font-medium text-[var(--primary)]">−{formatPrice(discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-body)]">Shipping</dt>
                <dd className="font-medium text-[var(--text-primary)]">{formatPrice(shippingAmt)}</dd>
              </div>
              <div className="border-t border-[var(--accent)] pt-3 flex justify-between gap-4">
                <dt className="font-medium text-[var(--text-primary)]">Total</dt>
                <dd className="font-semibold text-[var(--text-primary)]">{formatPrice(Number(order.total ?? 0))}</dd>
              </div>
            </dl>
            <p className="text-xs text-[var(--text-body)] pt-2 border-t border-[var(--accent)]">
              Status:{' '}
              <span className="font-medium capitalize text-[var(--text-primary)]">{order.status.replace('_', ' ')}</span>
            </p>
            {order.payment_phone ? (
              <p className="text-xs text-[var(--text-body)]">
                Payment phone: <span className="font-medium text-[var(--text-primary)]">{order.payment_phone}</span>
              </p>
            ) : null}
            {order.mpesa_receipt ? (
              <p className="text-xs text-[var(--text-body)]">
                M-Pesa receipt:{' '}
                <span className="font-mono font-medium text-[var(--text-primary)]">{order.mpesa_receipt}</span>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
