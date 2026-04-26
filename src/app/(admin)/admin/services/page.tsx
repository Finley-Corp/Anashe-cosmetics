import { CalendarClock } from 'lucide-react';
import { createServiceClient } from '@/lib/supabase/service';
import { ServiceBookingActions } from './service-booking-actions';

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
  pending: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20',
  confirmed: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  cancelled: 'bg-red-500/15 text-red-300 border-red-500/20',
};

export default async function AdminServicesPage() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
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
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Services</h1>
          <p className="mt-1 text-sm text-gray-500">{bookings.length} booking requests</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error.message.includes('service_bookings')
            ? 'Service bookings table is missing. Run the latest Supabase migration (or full_setup.sql) and refresh.'
            : error.message}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#1A1D21]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Client', 'Contact', 'Service', 'Coming Date', 'Status', 'Booked On', 'Actions'].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{booking.full_name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="min-w-[240px] rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                      <p className="text-sm font-medium text-gray-200">{booking.phone}</p>
                      <p className="mt-0.5 truncate text-xs text-gray-400">{booking.email}</p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold">
                        <a
                          href={`tel:${booking.phone}`}
                          className="rounded-full border border-blue-400/30 bg-blue-400/10 px-2.5 py-1 text-blue-200 transition-colors hover:bg-blue-400/20"
                        >
                          Call
                        </a>
                        <a
                          href={`mailto:${booking.email}`}
                          className="rounded-full border border-violet-400/30 bg-violet-400/10 px-2.5 py-1 text-violet-200 transition-colors hover:bg-violet-400/20"
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 capitalize">{booking.service_type.replace(/-/g, ' ')}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-gray-300">
                      <CalendarClock className="h-3.5 w-3.5 text-gray-400" />
                      {booking.preferred_date} {booking.preferred_time}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        STATUS_BADGE[booking.status] ?? 'bg-white/10 text-gray-300 border-white/10'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(booking.created_at).toLocaleDateString('en-KE')}
                  </td>
                  <td className="px-4 py-3">
                    <ServiceBookingActions bookingId={booking.id} currentStatus={booking.status} />
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
