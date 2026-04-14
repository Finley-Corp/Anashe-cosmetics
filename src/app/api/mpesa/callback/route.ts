import { NextResponse } from 'next/server';
import type { STKCallback } from '@/types';
import { createServiceClient } from '@/lib/supabase/service';
import { sendOrderConfirmationEmail } from '@/lib/email/resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const callback: STKCallback = body?.Body?.stkCallback;

    if (!callback) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    const { ResultCode, CheckoutRequestID, CallbackMetadata } = callback;

    const supabase = createServiceClient();
    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_request_id', CheckoutRequestID)
      .maybeSingle();

    if (!payment) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    const { data: order } = await supabase.from('orders').select('*').eq('id', payment.order_id).maybeSingle();
    if (!order) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    if (ResultCode === 0) {
      // Payment successful
      const items = CallbackMetadata?.Item ?? [];
      const mpesaReceipt = items.find((i) => i.Name === 'MpesaReceiptNumber')?.Value as string;
      const amount = items.find((i) => i.Name === 'Amount')?.Value as number;

      console.log(`[M-Pesa Callback] SUCCESS: ${CheckoutRequestID}, Receipt: ${mpesaReceipt}, Amount: ${amount}`);

      await supabase
        .from('payments')
        .update({
          status: 'success',
          mpesa_receipt: mpesaReceipt ?? payment.mpesa_receipt,
          result_code: ResultCode,
          result_desc: callback.ResultDesc,
          amount: amount ?? payment.amount,
        })
        .eq('id', payment.id);

      await supabase
        .from('orders')
        .update({
          status: 'payment_confirmed',
          mpesa_receipt: mpesaReceipt ?? order.mpesa_receipt,
        })
        .eq('id', order.id);

      // Decrement stock
      const { data: orderItems } = await supabase.from('order_items').select('product_id,variant_id,quantity').eq('order_id', order.id);
      for (const item of orderItems ?? []) {
        if (item.variant_id) {
          const { data: variant } = await supabase.from('product_variants').select('stock').eq('id', item.variant_id).single();
          await supabase
            .from('product_variants')
            .update({ stock: Math.max(0, Number(variant?.stock ?? 0) - Number(item.quantity)) })
            .eq('id', item.variant_id);
        } else {
          const { data: product } = await supabase.from('products').select('stock').eq('id', item.product_id).single();
          await supabase
            .from('products')
            .update({ stock: Math.max(0, Number(product?.stock ?? 0) - Number(item.quantity)) })
            .eq('id', item.product_id);
        }
      }

      // coupon usage bump
      if (order.coupon_id) {
        const { data: coupon } = await supabase.from('coupons').select('used_count').eq('id', order.coupon_id).single();
        await supabase
          .from('coupons')
          .update({ used_count: Number(coupon?.used_count ?? 0) + 1 })
          .eq('id', order.coupon_id);
      }

      // clear customer cart
      const { data: carts } = await supabase.from('carts').select('id').eq('user_id', order.user_id);
      const cartIds = (carts ?? []).map((c) => c.id);
      if (cartIds.length > 0) {
        await supabase.from('cart_items').delete().in('cart_id', cartIds);
      }

      // send order confirmation email
      try {
        const {
          data: { user },
        } = await supabase.auth.admin.getUserById(order.user_id);
        if (user?.email) {
          await sendOrderConfirmationEmail({
            to: user.email,
            customerName: user.user_metadata?.full_name ?? null,
            orderNumber: order.order_number,
            total: Number(order.total),
            receipt: mpesaReceipt ?? null,
          });
        }
      } catch (emailError) {
        console.error('[Order Confirmation Email Error]', emailError);
      }

    } else {
      // Payment failed or cancelled
      console.log(`[M-Pesa Callback] FAILED: ${CheckoutRequestID}, ResultCode: ${ResultCode}, Desc: ${callback.ResultDesc}`);

      await supabase
        .from('payments')
        .update({
          status: 'failed',
          result_code: ResultCode,
          result_desc: callback.ResultDesc,
        })
        .eq('id', payment.id);
      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
    }

    // Always return 200 to Safaricom
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('[M-Pesa Callback Error]', error);
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
}
