import { Download } from 'lucide-react';
import { createServiceClient } from '@/lib/supabase/service';

const STATUS_BADGE: Record<string, string> = {
  pending_payment: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20',
  payment_confirmed: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  processing: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
  shipped: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
  delivered: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  cancelled: 'bg-red-500/15 text-red-300 border-red-500/20',
  refunded: 'bg-white/10 text-gray-300 border-white/10',
};

export default async function AdminOrdersPage() {
  const supabase = createServiceClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('id,order_number,user_id,total,status,mpesa_receipt,created_at,payment_phone,items:order_items(count)')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders?.length ?? 0} total orders</p>
        </div>
        <button className="flex items-center gap-2 h-10 px-5 border border-white/10 text-gray-300 text-sm font-semibold rounded-xl hover:bg-white/5 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-[#1A1D21] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Order', 'Customer', 'Phone', 'Items', 'Total', 'M-Pesa Ref', 'Date', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  {(() => {
                    const itemCount = Array.isArray(order.items) ? (order.items[0]?.count ?? 0) : 0;
                    return (
                      <>
                  <td className="px-4 py-3 font-bold text-white">{order.order_number}</td>
                  <td className="px-4 py-3 font-medium text-gray-300">{`Customer ${String(order.user_id).slice(0, 8)}`}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{order.payment_phone ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-400">{itemCount} items</td>
                  <td className="px-4 py-3 font-semibold text-white">KES {Number(order.total).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{order.mpesa_receipt ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString('en-KE')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_BADGE[order.status] ?? 'bg-neutral-100 text-neutral-600 border-neutral-100'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
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
