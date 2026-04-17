import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const updateProfileSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal('')),
});

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('full_name,phone')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: {
      full_name: profile?.full_name ?? null,
      phone: profile?.phone ?? null,
      email: user.email ?? null,
    },
  });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid profile payload' }, { status: 422 });
  }

  const payload = {
    full_name: parsed.data.full_name,
    phone: parsed.data.phone ? parsed.data.phone : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('profiles').update(payload).eq('id', user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
