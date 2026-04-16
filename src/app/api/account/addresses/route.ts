import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

const addressSchema = z.object({
  line1: z.string().trim().min(3).max(200),
  line2: z.string().trim().max(200).optional().or(z.literal('')),
  city: z.string().trim().min(2).max(120),
  county: z.string().trim().max(120).optional().or(z.literal('')),
  country: z.string().trim().max(120).optional().default('Kenya'),
  is_default: z.boolean().optional().default(false),
});

async function getAuthedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET() {
  const { user } = await getAuthedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createServiceClient();

  const { data, error } = await admin
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: Request) {
  const { user } = await getAuthedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createServiceClient();

  const body = await req.json();
  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid address payload' }, { status: 422 });

  const payload = parsed.data;

  if (payload.is_default) {
    await admin.from('addresses').update({ is_default: false }).eq('user_id', user.id);
  }

  const { data, error } = await admin
    .from('addresses')
    .insert({
      user_id: user.id,
      line1: payload.line1,
      line2: payload.line2 || null,
      city: payload.city,
      county: payload.county || null,
      country: payload.country || 'Kenya',
      is_default: payload.is_default,
    })
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}
