import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';

const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  subject: z.string().trim().max(160).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(2500),
});

export async function POST(req: Request) {
  const parsed = contactMessageSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid contact payload' }, { status: 422 });
  }

  const payload = parsed.data;
  const supabase = createServiceClient();
  const { error } = await supabase.from('contact_messages').insert({
    full_name: payload.name,
    email: payload.email,
    phone: payload.phone && payload.phone.length > 0 ? payload.phone : null,
    subject: payload.subject && payload.subject.length > 0 ? payload.subject : null,
    message: payload.message,
    status: 'open',
  });

  if (error) {
    if (error.message.includes('contact_messages')) {
      return NextResponse.json(
        { error: 'Contact messages setup is incomplete. Run the latest Supabase migration and try again.' },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
