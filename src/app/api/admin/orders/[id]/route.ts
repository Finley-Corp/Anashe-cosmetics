import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

const updateOrderSchema = z.object({
  status: z.enum([
    'pending_payment',
    'payment_confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ]),
  note: z.string().max(500).optional().nullable(),
});

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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;
  const { id } = await params;

  const parsed = updateOrderSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 422 });
  }

  const { status, note } = parsed.data;
  const supabase = createServiceClient();

  const { data: existing, error: orderFetchError } = await supabase
    .from('orders')
    .select('id,status')
    .eq('id', id)
    .maybeSingle();
  if (orderFetchError) {
    return NextResponse.json({ error: orderFetchError.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  if (existing.status === status) {
    return NextResponse.json({ success: true, data: existing });
  }

  const { error: updateError } = await supabase.from('orders').update({ status }).eq('id', id);
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await supabase.from('order_status_history').insert({
    order_id: id,
    status,
    note: note?.trim() || null,
    changed_by: adminCheck.user?.id ?? null,
  });

  return NextResponse.json({ success: true, data: { id, status } });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;
  const { id } = await params;

  const supabase = createServiceClient();

  const { data: existing, error: orderFetchError } = await supabase
    .from('orders')
    .select('id')
    .eq('id', id)
    .maybeSingle();
  if (orderFetchError) {
    return NextResponse.json({ error: orderFetchError.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const { error: reviewsUpdateError } = await supabase
    .from('reviews')
    .update({ order_id: null })
    .eq('order_id', id);
  if (reviewsUpdateError) {
    return NextResponse.json({ error: reviewsUpdateError.message }, { status: 500 });
  }

  const { error: analyticsUpdateError } = await supabase
    .from('analytics_events')
    .update({ order_id: null })
    .eq('order_id', id);
  if (analyticsUpdateError) {
    return NextResponse.json({ error: analyticsUpdateError.message }, { status: 500 });
  }

  const { error: paymentsDeleteError } = await supabase.from('payments').delete().eq('order_id', id);
  if (paymentsDeleteError) {
    return NextResponse.json({ error: paymentsDeleteError.message }, { status: 500 });
  }

  const { error: orderDeleteError } = await supabase.from('orders').delete().eq('id', id);
  if (orderDeleteError) {
    return NextResponse.json({ error: orderDeleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

