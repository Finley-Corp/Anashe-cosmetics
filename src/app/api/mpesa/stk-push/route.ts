import { NextResponse } from 'next/server';
import { initiateSTKPush } from '@/lib/mpesa/stk-push';
import { isValidKenyanPhone, generateOrderNumber } from '@/lib/utils';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  phone: z.string().regex(/^(\+?254|0)[17]\d{8}$/, 'Invalid Kenyan phone number'),
  amount: z.number().min(1),
  cartItems: z.array(z.object({
    productId: z.string(),
    variantId: z.string().nullable(),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
  })),
  shippingAddress: z.object({
    line1: z.string(),
    line2: z.string().optional().nullable(),
    city: z.string(),
    county: z.string().optional().nullable(),
    country: z.string().optional(),
  }).optional(),
  couponCode: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 422 });
    }

    const { phone, amount, cartItems, shippingAddress, couponCode } = parsed.data;

    if (!isValidKenyanPhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 422 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const safeAddress = shippingAddress ?? {
      line1: 'Customer provided at checkout',
      line2: null,
      city: 'Nairobi',
      county: null,
      country: 'Kenya',
    };

    const { data: coupon } = couponCode
      ? await supabase.from('coupons').select('*').eq('code', couponCode.toUpperCase()).eq('is_active', true).maybeSingle()
      : { data: null };

    const orderNumber = generateOrderNumber();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        status: 'pending_payment',
        subtotal: amount,
        discount_amount: 0,
        shipping_amount: 0,
        total: amount,
        coupon_id: coupon?.id ?? null,
        shipping_address: safeAddress,
        payment_phone: phone,
      })
      .select('*')
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: orderError?.message ?? 'Failed to create order' }, { status: 500 });
    }

    // create order items snapshots
    for (const item of cartItems) {
      const { data: product } = await supabase
        .from('products')
        .select('id,name,price,sale_price,images:product_images(url,is_primary)')
        .eq('id', item.productId)
        .single();
      const { data: variant } = item.variantId
        ? await supabase.from('product_variants').select('*').eq('id', item.variantId).maybeSingle()
        : { data: null };
      if (!product) continue;

      const primaryImage = product.images?.find((img: { is_primary?: boolean; url: string }) => img.is_primary)?.url
        ?? product.images?.[0]?.url
        ?? null;
      const unitPrice = Number(variant ? Number(product.sale_price ?? product.price) + Number(variant.price_modifier ?? 0) : Number(product.sale_price ?? product.price));
      await supabase.from('order_items').insert({
        order_id: order.id,
        product_id: product.id,
        variant_id: item.variantId ?? null,
        product_name: product.name,
        product_image: primaryImage,
        variant_name: variant?.name ?? null,
        quantity: item.quantity,
        unit_price: unitPrice,
      });
    }

    let checkoutRequestId = '';
    let merchantRequestId = '';

    if (process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_KEY !== 'your-consumer-key') {
      try {
        const stkResponse = await initiateSTKPush({
          phone,
          amount,
          orderId: order.id,
          callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`,
        });
        checkoutRequestId = stkResponse.CheckoutRequestID;
        merchantRequestId = stkResponse.MerchantRequestID;
      } catch (mpesaError) {
        console.error('[STK Push Error]', mpesaError);
        return NextResponse.json({ error: 'Failed to initiate M-Pesa payment. Please try again.' }, { status: 502 });
      }
    } else {
      checkoutRequestId = `demo-${Date.now()}`;
      merchantRequestId = `demo-merchant-${Date.now()}`;
    }

    await supabase.from('payments').insert({
      order_id: order.id,
      checkout_request_id: checkoutRequestId,
      merchant_request_id: merchantRequestId || null,
      phone,
      amount,
      status: 'pending',
    });
    await supabase.from('orders').update({ checkout_request_id: checkoutRequestId }).eq('id', order.id);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber,
      checkoutRequestId,
      message: 'STK Push initiated. Check your phone.',
    });
  } catch (error) {
    console.error('[STK Push Route Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
