import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, price, sale_price, skin_type, concerns, images:product_images(url,is_primary)')
    .eq('is_published', true)
    .or(`name.ilike.%${q}%,brand.ilike.%${q}%,ingredients.ilike.%${q}%,short_description.ilike.%${q}%,concerns.cs.{${q.toLowerCase()}}`)
    .limit(5);

  if (error) {
    return NextResponse.json({ suggestions: [] });
  }

  const suggestions = (data ?? []).map((item) => {
    const primary = item.images?.find((img: { is_primary?: boolean }) => img.is_primary) ?? item.images?.[0];
    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      sale_price: item.sale_price,
      image: primary?.url ?? null,
      skin_type: item.skin_type ?? [],
    };
  });

  return NextResponse.json({ suggestions });
}
