import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

const createDiscountSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[A-Z0-9_-]+$/, 'Use only A-Z, 0-9, underscore, dash'),
  percent_off: z.coerce.number().min(1).max(95),
  description: z.string().max(255).optional().nullable(),
  is_active: z.coerce.boolean().optional().default(true),
});

function normalizeText(value?: string | null) {
  const text = value?.trim();
  return text ? text : null;
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), user: null };
  }

  return { error: null, user };
}

export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('coupons')
    .select('id,code,description,type,value,is_active,used_count,max_uses,created_at,expires_at')
    .eq('type', 'percentage')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: Request) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;

  const body = await req.json();
  const parsed = createDiscountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 422 });
  }

  const supabase = createServiceClient();
  const payload = parsed.data;
  const code = payload.code.trim().toUpperCase();

  const { data, error } = await supabase
    .from('coupons')
    .insert({
      code,
      description: normalizeText(payload.description),
      type: 'percentage',
      value: payload.percent_off,
      min_order_value: 0,
      max_uses: null,
      used_count: 0,
      per_user_limit: 1,
      is_stackable: false,
      is_active: payload.is_active,
      starts_at: null,
      expires_at: null,
    })
    .select('id,code,description,type,value,is_active,used_count,max_uses,created_at,expires_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

