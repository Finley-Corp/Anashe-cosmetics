import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(5000).optional().nullable(),
  short_description: z.string().max(500).optional().nullable(),
  brand: z.string().max(120).optional().nullable(),
  sku: z.string().max(120).optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  price: z.coerce.number().min(0),
  sale_price: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
  is_published: z.coerce.boolean().default(false),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        is_primary: z.coerce.boolean().optional().default(false),
        sort_order: z.coerce.number().int().min(0).max(10000).optional().default(0),
      })
    )
    .optional()
    .nullable(),
});

function normalizeText(value?: string | null) {
  const text = value?.trim();
  return text ? text : null;
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

async function ensureUniqueSlug(baseSlug: string, productId?: string) {
  const supabase = createServiceClient();
  let slug = baseSlug;
  let idx = 1;

  while (idx < 200) {
    let query = supabase.from('products').select('id').eq('slug', slug).limit(1);
    if (productId) query = query.neq('id', productId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    idx += 1;
    slug = `${baseSlug}-${idx}`;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function POST(req: Request) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;

  const body = await req.json();
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 422 });
  }

  const supabase = createServiceClient();
  const payload = parsed.data;
  const uniqueSlug = await ensureUniqueSlug(payload.slug);

  const insertPayload = {
    name: payload.name.trim(),
    slug: uniqueSlug,
    description: normalizeText(payload.description),
    short_description: normalizeText(payload.short_description),
    brand: normalizeText(payload.brand),
    sku: normalizeText(payload.sku),
    category_id: payload.category_id ?? null,
    price: payload.price,
    sale_price: payload.sale_price ?? null,
    stock: payload.stock,
    is_published: payload.is_published,
  };

  const { data: product, error } = await supabase.from('products').insert(insertPayload).select('id').single();
  if (error || !product) {
    return NextResponse.json({ error: error?.message ?? 'Unable to create product' }, { status: 500 });
  }

  const images = payload.images ?? [];
  if (images.length > 0) {
    const normalized = images
      .map((img, idx) => ({
        url: normalizeText(img.url),
        is_primary: Boolean(img.is_primary),
        sort_order: Number.isFinite(img.sort_order) ? img.sort_order : idx,
      }))
      .filter((img): img is { url: string; is_primary: boolean; sort_order: number } => Boolean(img.url));

    const hasPrimary = normalized.some((i) => i.is_primary);
    const withPrimary = hasPrimary
      ? normalized
      : normalized.map((i, idx) => ({ ...i, is_primary: idx === 0 }));

    if (withPrimary.length > 0) {
      await supabase.from('product_images').insert(
        withPrimary.map((img) => ({
          product_id: product.id,
          url: img.url,
          is_primary: img.is_primary,
          sort_order: img.sort_order,
        }))
      );
    }
  }

  return NextResponse.json({ success: true, data: { id: product.id, slug: uniqueSlug } });
}

export async function DELETE() {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;

  const supabase = createServiceClient();

  const { data: orderedRows, error: orderedError } = await supabase
    .from('order_items')
    .select('product_id')
    .not('product_id', 'is', null);

  if (orderedError) {
    return NextResponse.json({ error: orderedError.message }, { status: 500 });
  }

  const orderedIds = Array.from(new Set((orderedRows ?? []).map((row) => row.product_id).filter(Boolean)));

  const { data: allProducts, error: allProductsError } = await supabase.from('products').select('id');
  if (allProductsError) {
    return NextResponse.json({ error: allProductsError.message }, { status: 500 });
  }
  const allProductIds = (allProducts ?? []).map((row) => row.id);
  const protectedIds = new Set(orderedIds);
  const deletableProductIds = allProductIds.filter((id) => !protectedIds.has(id));

  if (deletableProductIds.length === 0) {
    return NextResponse.json({
      success: true,
      deletedCount: 0,
      skippedCount: orderedIds.length,
      message: 'No deletable products found.',
    });
  }

  await supabase.from('wishlist_items').delete().in('product_id', deletableProductIds);
  await supabase.from('cart_items').delete().in('product_id', deletableProductIds);
  await supabase.from('product_variants').delete().in('product_id', deletableProductIds);
  await supabase.from('product_images').delete().in('product_id', deletableProductIds);

  const { error: productDeleteError } = await supabase.from('products').delete().in('id', deletableProductIds);
  if (productDeleteError) {
    return NextResponse.json({ error: productDeleteError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    deletedCount: deletableProductIds.length,
    skippedCount: orderedIds.length,
  });
}
