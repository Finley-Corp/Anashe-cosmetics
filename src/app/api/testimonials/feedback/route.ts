import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';

const testimonialFeedbackSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  role: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().min(20).max(1000),
});

export async function POST(req: Request) {
  const parsed = testimonialFeedbackSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid feedback payload' }, { status: 422 });
  }

  const admin = createServiceClient();
  const payload = parsed.data;

  const { error } = await admin.from('testimonials_feedback').insert({
    full_name: payload.full_name,
    role: payload.role && payload.role.length > 0 ? payload.role : null,
    message: payload.message,
    is_approved: true,
  });

  if (error) {
    if (error.message.includes('testimonials_feedback')) {
      return NextResponse.json(
        { error: 'Testimonials feedback setup is incomplete. Run the latest Supabase migration and try again.' },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
