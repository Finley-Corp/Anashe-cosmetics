import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';

const schema = z.object({
  code: z.string().min(2).max(40),
  subtotal: z.coerce.number().min(0),
  shipping: z.coerce.number().min(0).optional().default(0),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 422 });
  }

  const { code, subtotal, shipping } = parsed.data;
  const normalizedCode = code.trim().toUpperCase();
  const supabase = createServiceClient();

  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('id,code,type,value,min_order_value,max_uses,used_count,is_active,starts_at,expires_at')
    .eq('code', normalizedCode)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!coupon || !coupon.is_active) {
    return NextResponse.json({ error: 'Invalid or inactive coupon code' }, { status: 404 });
  }

  const now = new Date();
  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    return NextResponse.json({ error: 'This coupon is not active yet' }, { status: 422 });
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < now) {
    return NextResponse.json({ error: 'This coupon has expired' }, { status: 422 });
  }
  if (
    typeof coupon.max_uses === 'number' &&
    coupon.max_uses > 0 &&
    Number(coupon.used_count ?? 0) >= coupon.max_uses
  ) {
    return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 422 });
  }
  if (subtotal < Number(coupon.min_order_value ?? 0)) {
    return NextResponse.json(
      {
        error: `Minimum order is KES ${Number(coupon.min_order_value ?? 0).toLocaleString('en-KE')}`,
      },
      { status: 422 }
    );
  }

  let discount = 0;
  let shippingDiscount = 0;

  if (coupon.type === 'percentage') {
    discount = Math.round((subtotal * Number(coupon.value)) / 100);
  } else if (coupon.type === 'fixed') {
    discount = Math.min(Number(coupon.value), subtotal);
  } else if (coupon.type === 'free_shipping') {
    shippingDiscount = shipping;
  }

  return NextResponse.json({
    success: true,
    data: {
      code: coupon.code,
      type: coupon.type,
      discount,
      shippingDiscount,
    },
  });
}

