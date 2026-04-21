import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';

const serviceFeedbackSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(10).max(1200),
});

export async function POST(req: Request) {
  const parsed = serviceFeedbackSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid feedback payload' }, { status: 422 });
  }

  const admin = createServiceClient();
  const payload = parsed.data;

  const { error } = await admin.from('service_feedback').insert({
    full_name: payload.full_name,
    email: payload.email,
    rating: payload.rating,
    message: payload.message,
  });

  if (error) {
    if (error.message.includes('service_feedback')) {
      return NextResponse.json(
        { error: 'Service feedback setup is incomplete. Run the latest Supabase migration and try again.' },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
