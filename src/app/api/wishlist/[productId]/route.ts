import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
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
    return NextResponse.json({ success: true });
  }

  const { error } = await service
    .from('wishlist_items')
    .delete()
    .eq('wishlist_id', wishlist.id)
    .eq('product_id', productId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
