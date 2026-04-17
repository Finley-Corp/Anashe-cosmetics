import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { generateOrderNumber } from '@/lib/utils';
import { sendSmsNotification } from '@/lib/sms/tilil';
import { sendOrderConfirmationEmail } from '@/lib/email/resend';

const schema = z.object({
  phone: z.string().regex(/^(\+?254|0)[17]\d{8}$/, 'Invalid Kenyan phone number'),
  cartItems: z.array(
    z.object({
      productId: z.string().uuid(),
      variantId: z.string().uuid().nullable(),
      quantity: z.number().int().min(1),
    })
  ),
  shippingAddress: z.object({
    line1: z.string().min(2),
    line2: z.string().optional().nullable(),
    city: z.string().min(2),
    county: z.string().optional().nullable(),
    country: z.string().optional(),
  }),
  couponCode: z.string().optional(),
  contactEmail: z.string().email().optional().nullable(),
});

function buildOwnerOrderSms(input: {
  orderNumber: string;
  total: number;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string;
  items: Array<{ product_name: string; variant_name: string | null; quantity: number }>;
  shippingAddress: {
    line1: string;
    line2: string | null;
    city: string;
    county: string | null;
    country?: string;
  };
}): string {
  const itemSummary = input.items
    .slice(0, 4)
    .map((item) => {
      const itemName = item.variant_name ? `${item.product_name} (${item.variant_name})` : item.product_name;
      return `${item.quantity}x ${itemName}`;
    })
    .join('; ');

  const hasMoreItems = input.items.length > 4;
  const locationParts = [
    input.shippingAddress.line1,
    input.shippingAddress.line2,
    input.shippingAddress.city,
    input.shippingAddress.county,
    input.shippingAddress.country ?? 'Kenya',
  ].filter(Boolean);

  const lines = [
    `Anashe NEW ORDER`,
    `Ref: ${input.orderNumber}`,
    `Total: KES ${Math.round(Number(input.total)).toLocaleString('en-KE')}`,
    `Customer: ${input.customerName ?? 'Not provided'}`,
    `Email: ${input.customerEmail ?? 'Not provided'}`,
    `Phone: ${input.customerPhone}`,
    `Items: ${itemSummary}${hasMoreItems ? `; +${input.items.length - 4} more` : ''}`,
    `Delivery: ${locationParts.join(', ')}`,
  ];

  const fullBody = lines.join('\n');
  if (fullBody.length <= 900) return fullBody;
  return `${fullBody.slice(0, 897)}...`;
}

export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 422 });
    }

    const supabase = await createClient();
    const service = createServiceClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { phone, cartItems, shippingAddress, couponCode, contactEmail } = parsed.data;
    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 422 });
    }

    let subtotal = 0;
    const orderItemsPayload: Array<{
      product_id: string;
      variant_id: string | null;
      product_name: string;
      product_image: string | null;
      variant_name: string | null;
      quantity: number;
      unit_price: number;
    }> = [];

    for (const item of cartItems) {
      const { data: product } = await service
        .from('products')
        .select('id,name,price,sale_price,images:product_images(url,is_primary)')
        .eq('id', item.productId)
        .single();
      if (!product) continue;

      const { data: variant } = item.variantId
        ? await service.from('product_variants').select('id,name,price_modifier').eq('id', item.variantId).maybeSingle()
        : { data: null };

      const basePrice = Number(product.sale_price ?? product.price);
      const unitPrice = Number(basePrice + Number(variant?.price_modifier ?? 0));
      subtotal += unitPrice * item.quantity;

      const primaryImage =
        product.images?.find((img: { is_primary?: boolean; url: string }) => img.is_primary)?.url ??
        product.images?.[0]?.url ??
        null;

      orderItemsPayload.push({
        product_id: product.id,
        variant_id: item.variantId ?? null,
        product_name: product.name,
        product_image: primaryImage,
        variant_name: variant?.name ?? null,
        quantity: item.quantity,
        unit_price: unitPrice,
      });
    }

    if (orderItemsPayload.length === 0) {
      return NextResponse.json({ error: 'No valid items found in cart' }, { status: 422 });
    }

    let discount = 0;
    let shipping = subtotal >= 2000 ? 0 : 250;
    let couponId: string | null = null;

    if (couponCode?.trim()) {
      const normalizedCouponCode = couponCode.trim().toUpperCase();
      const { data: coupon } = await service
        .from('coupons')
        .select('*')
        .eq('code', normalizedCouponCode)
        .eq('is_active', true)
        .maybeSingle();
      if (coupon) {
        const now = new Date();
        const startsAtValid = !coupon.starts_at || new Date(coupon.starts_at) <= now;
        const expiresAtValid = !coupon.expires_at || new Date(coupon.expires_at) >= now;
        const maxUsesValid =
          typeof coupon.max_uses !== 'number' ||
          coupon.max_uses <= 0 ||
          Number(coupon.used_count ?? 0) < coupon.max_uses;

        if (startsAtValid && expiresAtValid && maxUsesValid && subtotal >= Number(coupon.min_order_value ?? 0)) {
          couponId = coupon.id;
          if (coupon.type === 'percentage') {
            discount = Math.round((subtotal * Number(coupon.value)) / 100);
          } else if (coupon.type === 'fixed') {
            discount = Math.min(Number(coupon.value), subtotal);
          } else if (coupon.type === 'free_shipping') {
            shipping = 0;
          }
        }
      }
    }

    const total = Math.max(0, subtotal - discount + shipping);
    const orderNumber = generateOrderNumber();

    const { data: order, error: orderError } = await service
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        status: 'processing',
        subtotal,
        discount_amount: discount,
        shipping_amount: shipping,
        total,
        coupon_id: couponId,
        shipping_address: {
          line1: shippingAddress.line1,
          line2: shippingAddress.line2 ?? null,
          city: shippingAddress.city,
          county: shippingAddress.county ?? null,
          country: shippingAddress.country ?? 'Kenya',
        },
        payment_phone: phone,
      })
      .select('id,order_number,total')
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: orderError?.message ?? 'Unable to create order' }, { status: 500 });
    }

    const { error: itemInsertError } = await service.from('order_items').insert(
      orderItemsPayload.map((item) => ({
        ...item,
        order_id: order.id,
      }))
    );
    if (itemInsertError) {
      return NextResponse.json({ error: itemInsertError.message }, { status: 500 });
    }

    if (couponId) {
      const { data: couponRow } = await service.from('coupons').select('used_count').eq('id', couponId).maybeSingle();
      const nextUsedCount = Number(couponRow?.used_count ?? 0) + 1;
      await service.from('coupons').update({ used_count: nextUsedCount }).eq('id', couponId);
    }

    const emailToUse = contactEmail?.trim() || user.email || null;
    const ownerPhone = process.env.OWNER_PHONE;

    const customerName =
      typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim()
        ? user.user_metadata.full_name.trim()
        : null;
    const normalizedShippingAddress = {
      line1: shippingAddress.line1,
      line2: shippingAddress.line2 ?? null,
      city: shippingAddress.city,
      county: shippingAddress.county ?? null,
      country: shippingAddress.country ?? 'Kenya',
    };
    const ownerOrderSmsBody = buildOwnerOrderSms({
      orderNumber: order.order_number,
      total: Number(order.total),
      customerName,
      customerEmail: emailToUse,
      customerPhone: phone,
      items: orderItemsPayload.map((item) => ({
        product_name: item.product_name,
        variant_name: item.variant_name,
        quantity: item.quantity,
      })),
      shippingAddress: normalizedShippingAddress,
    });

    const [smsResult, , emailResult] = await Promise.all([
      sendSmsNotification({
        to: phone,
        body: `Anashe: Your order ${order.order_number} has been placed. Total KES ${Math.round(Number(order.total)).toLocaleString('en-KE')}. We will contact you shortly.`,
      }),
      ownerPhone
        ? sendSmsNotification({
            to: ownerPhone,
            body: ownerOrderSmsBody,
          })
        : Promise.resolve({ success: false, skipped: true }),
      emailToUse
        ? sendOrderConfirmationEmail({
            to: emailToUse,
            customerName: user.user_metadata?.full_name ?? null,
            orderNumber: order.order_number,
            total: Number(order.total),
            items: orderItemsPayload.map((i) => ({
              product_name: i.product_name,
              quantity: i.quantity,
              unit_price: i.unit_price,
            })),
          })
        : Promise.resolve({ success: false, skipped: true }),
    ]);

    const smsSkipped = 'skipped' in smsResult ? Boolean(smsResult.skipped) : false;
    const smsError = 'error' in smsResult ? smsResult.error ?? null : null;
    const smsMessageId = 'messageId' in smsResult ? smsResult.messageId ?? null : null;
    const emailSkipped = 'skipped' in emailResult ? Boolean(emailResult.skipped) : false;
    const emailError = 'error' in emailResult ? emailResult.error ?? null : null;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      total: Number(order.total),
      smsSent: smsResult.success,
      smsSkipped,
      smsError,
      smsMessageId,
      smsTo: phone,
      emailSent: Boolean(emailResult.success),
      emailSkipped,
      emailError,
      message: 'Order placed successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

