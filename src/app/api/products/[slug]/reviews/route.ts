import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().max(2000).optional(),
});

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('id')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('*, profile:profiles(*)')
    .eq('product_id', product.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 422 });
  }

  const { data: product } = await supabase.from('products').select('id').eq('slug', slug).single();
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // Verified purchase check
  const { data: purchasedItem } = await supabase
    .from('order_items')
    .select('id, order:orders!inner(id, user_id, status)')
    .eq('product_id', product.id)
    .eq('orders.user_id', user.id)
    .neq('orders.status', 'cancelled')
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from('reviews').insert({
    product_id: product.id,
    user_id: user.id,
    order_id: Array.isArray(purchasedItem.order)
      ? purchasedItem.order[0]?.id
      : (purchasedItem.order as { id?: string } | null)?.id ?? null,
    rating: parsed.data.rating,
    title: parsed.data.title ?? null,
    body: parsed.data.body ?? null,
    is_approved: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Review submitted for moderation' });
}

