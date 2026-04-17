import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

const addWishlistSchema = z.object({
  product_id: z.string().uuid(),
});

async function ensureWishlistId(userId: string) {
  const service = createServiceClient();
  const { data: existing } = await service
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  if (existing?.id) return existing.id;

  const { data: created, error } = await service
    .from('wishlists')
    .insert({ user_id: userId })
    .select('id')
    .single();
  if (error || !created?.id) {
    throw new Error(error?.message ?? 'Unable to create wishlist');
  }
  return created.id;
}

export async function GET() {
  const supabase = await createClient();
  const service = createServiceClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: wishlist } = await service
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!wishlist?.id) {
    return NextResponse.json({ data: [] });
  }

  const { data, error } = await service
    .from('wishlist_items')
    .select('product_id')
    .eq('wishlist_id', wishlist.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const service = createServiceClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = addWishlistSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 422 });
  }

  try {
    const wishlistId = await ensureWishlistId(user.id);
    const { error } = await service.from('wishlist_items').insert({
      wishlist_id: wishlistId,
      product_id: parsed.data.product_id,
    });

    if (error && !error.message.toLowerCase().includes('duplicate')) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to add wishlist item' },
      { status: 500 }
    );
  }
}
