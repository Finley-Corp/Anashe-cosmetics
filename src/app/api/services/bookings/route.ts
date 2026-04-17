import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';
import { sendSmsNotification } from '@/lib/sms/tilil';
import { sendBookingConfirmationEmail } from '@/lib/email/resend';

const serviceBookingSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(7).max(30),
  service_type: z.string().trim().min(2).max(80),
  preferred_date: z.string().trim().min(8).max(20),
  preferred_time: z.string().trim().min(3).max(20),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = serviceBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking payload' }, { status: 422 });
  }

  const admin = createServiceClient();
  const payload = parsed.data;

  const { error } = await admin.from('service_bookings').insert({
    full_name: payload.full_name,
    email: payload.email,
    phone: payload.phone,
    service_type: payload.service_type,
    preferred_date: payload.preferred_date,
    preferred_time: payload.preferred_time,
    notes: payload.notes || null,
  });

  if (error) {
    if (error.message.includes('service_bookings')) {
      return NextResponse.json(
        { error: 'Service booking setup is incomplete. Run the latest Supabase migration/full_setup.sql first.' },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await Promise.all([
    sendSmsNotification({
      to: payload.phone,
      body: `Anashe: Hi ${payload.full_name}, your ${payload.service_type} booking for ${payload.preferred_date} at ${payload.preferred_time} has been received. We will confirm shortly.`,
    }),
    sendBookingConfirmationEmail({
      to: payload.email,
      customerName: payload.full_name,
      serviceType: payload.service_type,
      preferredDate: payload.preferred_date,
      preferredTime: payload.preferred_time,
    }),
  ]);

  return NextResponse.json({ success: true });
}
