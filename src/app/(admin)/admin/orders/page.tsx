import Link from 'next/link';
import { Download, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

const STATUS_BADGE: Record<string, string> = {
  pending_payment: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  payment_confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
  processing: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  shipped: 'bg-purple-50 text-purple-700 border-purple-100',
  delivered: 'bg-green-50 text-green-700 border-green-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
  refunded: 'bg-gray-50 text-gray-600 border-gray-100',
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('id,order_number,user_id,total,status,mpesa_receipt,created_at,payment_phone,items:order_items(count)')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Orders</h1>
          <p className="text-sm text-neutral-500 mt-1">{orders?.length ?? 0} total orders</p>
        </div>
        <button className="flex items-center gap-2 h-10 px-5 border border-neutral-200 text-neutral-700 text-sm font-semibold rounded-xl hover:bg-neutral-50 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                {['Order', 'Customer', 'Phone', 'Items', 'Total', 'M-Pesa Ref', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((order) => (
                <tr key={order.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  {(() => {
                    const itemCount = Array.isArray(order.items) ? (order.items[0]?.count ?? 0) : 0;
                    return (
                      <>
                  <td className="px-4 py-3 font-bold text-green-700">{order.order_number}</td>
                  <td className="px-4 py-3 font-medium">{`Customer ${String(order.user_id).slice(0, 8)}`}</td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{order.payment_phone ?? '-'}</td>
                  <td className="px-4 py-3 text-neutral-600">{itemCount} items</td>
                  <td className="px-4 py-3 font-semibold">KES {Number(order.total).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-mono text-neutral-500">{order.mpesa_receipt ?? '-'}</td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{new Date(order.created_at).toLocaleDateString('en-KE')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_BADGE[order.status] ?? 'bg-neutral-100 text-neutral-600 border-neutral-100'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                      </>
                    );
                  })()}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
