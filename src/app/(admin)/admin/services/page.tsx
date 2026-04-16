import { CalendarClock } from 'lucide-react';
import { createServiceClient } from '@/lib/supabase/service';

type ServiceBookingRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  created_at: string;
};

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
};

export default async function AdminServicesPage() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('service_bookings')
    .select('id,full_name,email,phone,service_type,preferred_date,preferred_time,status,created_at')
    .order('preferred_date', { ascending: true })
    .order('preferred_time', { ascending: true })
    .limit(200);

  const bookings = (data ?? []) as ServiceBookingRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Services</h1>
          <p className="mt-1 text-sm text-neutral-500">{bookings.length} booking requests</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                {['Client', 'Contact', 'Service', 'Coming Date', 'Status', 'Booked On'].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-neutral-900">{booking.full_name}</p>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    <p>{booking.phone}</p>
                    <p className="text-xs text-neutral-500">{booking.email}</p>
                  </td>
                  <td className="px-4 py-3 text-neutral-700 capitalize">{booking.service_type.replace(/-/g, ' ')}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700">
                      <CalendarClock className="h-3.5 w-3.5 text-neutral-500" />
                      {booking.preferred_date} {booking.preferred_time}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        STATUS_BADGE[booking.status] ?? 'bg-neutral-100 text-neutral-600 border-neutral-100'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500">
                    {new Date(booking.created_at).toLocaleDateString('en-KE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
