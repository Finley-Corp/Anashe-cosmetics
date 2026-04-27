import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { sendSmsNotification } from '@/lib/sms/tilil';

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
  mpesa_receipt: z.string().max(80).optional(),
  shipping_rider_name: z.string().max(120).optional().nullable(),
  shipping_rider_phone: z.string().max(30).optional().nullable(),
  resend_shipped_sms: z.boolean().optional(),
});

function buildShippedSmsBody(orderNumber: string, riderName: string, riderPhone: string) {
  const base = `Anashe: Order ${orderNumber} is out for delivery. Rider: ${riderName}.`;
  const contact = ` Call ${riderPhone}.`;
  const full = base + contact;
  if (full.length <= 320) return full;
  return `${base.slice(0, 220)}…${contact}`;
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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;
  const { id } = await params;

  const parsed = updateOrderSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 422 });
  }

  const { status, note, mpesa_receipt, resend_shipped_sms } = parsed.data;
  const receiptTrimmed = mpesa_receipt?.trim();

  let riderNameInput: string | undefined;
  let riderPhoneInput: string | undefined;
  if (parsed.data.shipping_rider_name !== undefined && parsed.data.shipping_rider_name !== null) {
    riderNameInput = parsed.data.shipping_rider_name.trim();
  }
  if (parsed.data.shipping_rider_phone !== undefined && parsed.data.shipping_rider_phone !== null) {
    riderPhoneInput = parsed.data.shipping_rider_phone.trim();
  }

  const supabase = createServiceClient();

  const { data: existing, error: orderFetchError } = await supabase
    .from('orders')
    .select('id,status,payment_phone,order_number,shipping_rider_name,shipping_rider_phone')
    .eq('id', id)
    .maybeSingle();
  if (orderFetchError) {
    return NextResponse.json({ error: orderFetchError.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const becomingShipped = status === 'shipped' && existing.status !== 'shipped';

  const mergedRiderName =
    riderNameInput !== undefined ? riderNameInput : (existing.shipping_rider_name ?? '') || '';
  const mergedRiderPhone =
    riderPhoneInput !== undefined ? riderPhoneInput : (existing.shipping_rider_phone ?? '') || '';

  if (becomingShipped) {
    if (!mergedRiderName || !mergedRiderPhone) {
      return NextResponse.json(
        {
          error:
            'Rider name and rider contact are required when marking an order as shipped (used for customer SMS).',
        },
        { status: 422 }
      );
    }
  }

  const updates: {
    status?: typeof status;
    mpesa_receipt?: string;
    shipping_rider_name?: string | null;
    shipping_rider_phone?: string | null;
    updated_at?: string;
  } = {};

  if (existing.status !== status) updates.status = status;
  if (receiptTrimmed) updates.mpesa_receipt = receiptTrimmed;
  if (riderNameInput !== undefined) {
    updates.shipping_rider_name = riderNameInput.length > 0 ? riderNameInput : null;
  }
  if (riderPhoneInput !== undefined) {
    updates.shipping_rider_phone = riderPhoneInput.length > 0 ? riderPhoneInput : null;
  }

  const hasDbUpdates = Object.keys(updates).length > 0;

  if (hasDbUpdates) {
    updates.updated_at = new Date().toISOString();
    const { error: updateError } = await supabase.from('orders').update(updates).eq('id', id);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }

  const finalName =
    riderNameInput !== undefined ? riderNameInput || '' : (existing.shipping_rider_name ?? '') || '';
  const finalPhone =
    riderPhoneInput !== undefined ? riderPhoneInput || '' : (existing.shipping_rider_phone ?? '') || '';

  const customerPhone = existing.payment_phone?.trim();

  const smsEligible = Boolean(customerPhone && finalName && finalPhone);
  const sendOnTransition = becomingShipped && smsEligible;
  const sendResend =
    smsEligible &&
    Boolean(resend_shipped_sms) &&
    existing.status === 'shipped' &&
    status === 'shipped';

  let smsDispatched = false;
  if (sendOnTransition || sendResend) {
    const smsBody = buildShippedSmsBody(existing.order_number as string, finalName, finalPhone);
    const smsResult = await sendSmsNotification({
      to: customerPhone as string,
      body: smsBody,
    });
    smsDispatched = smsResult.success;
  }

  if (existing.status !== status) {
    await supabase.from('order_status_history').insert({
      order_id: id,
      status,
      note: note?.trim() || null,
      changed_by: adminCheck.user?.id ?? null,
    });
  }

  return NextResponse.json({
    success: true,
    data: { id, status },
    smsDispatched,
  });
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
