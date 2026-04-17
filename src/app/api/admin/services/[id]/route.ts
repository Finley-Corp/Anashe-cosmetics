import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { sendSmsNotification } from '@/lib/sms/tilil';

const updateServiceBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
});

const STATUS_SMS_COPY: Record<string, string> = {
  pending: 'is currently pending review',
  confirmed: 'has been confirmed',
  completed: 'has been marked as completed',
  cancelled: 'has been cancelled',
};

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  return { error: null };
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;
  const { id } = await params;

  const parsed = updateServiceBookingSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 422 });
  }

  const supabase = createServiceClient();

  const { data: existing, error: fetchError } = await supabase
    .from('service_bookings')
    .select('id,status,full_name,phone,service_type,preferred_date,preferred_time')
    .eq('id', id)
    .maybeSingle();
  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: 'Service booking not found' }, { status: 404 });
  }

  if (existing.status === parsed.data.status) {
    return NextResponse.json({ success: true, data: existing });
  }

  const { error: updateError } = await supabase
    .from('service_bookings')
    .update({ status: parsed.data.status })
    .eq('id', id);
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const smsResult = await sendSmsNotification({
    to: existing.phone,
    body: `Anashe: Hi ${existing.full_name}, your ${existing.service_type} booking for ${existing.preferred_date} at ${existing.preferred_time} ${STATUS_SMS_COPY[parsed.data.status] ?? `status was updated to ${parsed.data.status}`}.`,
  });

  return NextResponse.json({
    success: true,
    data: { id, status: parsed.data.status },
    smsSent: Boolean(smsResult.success),
    smsSkipped: 'skipped' in smsResult ? Boolean(smsResult.skipped) : false,
    smsError: 'error' in smsResult ? smsResult.error ?? null : null,
  });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;
  const { id } = await params;

  const supabase = createServiceClient();
  const { data: existing, error: fetchError } = await supabase
    .from('service_bookings')
    .select('id')
    .eq('id', id)
    .maybeSingle();
  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: 'Service booking not found' }, { status: 404 });
  }

  const { error: deleteError } = await supabase.from('service_bookings').delete().eq('id', id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
