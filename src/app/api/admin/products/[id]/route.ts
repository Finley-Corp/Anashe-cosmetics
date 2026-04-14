import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

const updateProductSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(5000).optional().nullable(),
  short_description: z.string().max(500).optional().nullable(),
  brand: z.string().max(120).optional().nullable(),
  sku: z.string().max(120).optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0).default(0),
  is_published: z.coerce.boolean().default(false),
  image_url: z.string().url().optional().nullable(),
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

  const metadataRole =
    (user.app_metadata as { role?: string } | undefined)?.role ??
    (user.user_metadata as { role?: string } | undefined)?.role;

  let isAdmin = metadataRole === 'admin';
  if (!isAdmin) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    isAdmin = profile?.role === 'admin';
  }

  if (!isAdmin) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), user };
  }

  return { error: null, user };
}

async function ensureUniqueSlug(baseSlug: string, productId: string) {
  const supabase = createServiceClient();
  let slug = baseSlug;
  let idx = 1;

  while (idx < 200) {
    const { data } = await supabase.from('products').select('id').eq('slug', slug).neq('id', productId).limit(1).maybeSingle();
    if (!data) return slug;
    idx += 1;
    slug = `${baseSlug}-${idx}`;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;

  const { id } = await params;
  const body = await req.json();
  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 422 });
  }

  const supabase = createServiceClient();
  const payload = parsed.data;
  const uniqueSlug = await ensureUniqueSlug(payload.slug, id);

  const updatePayload = {
    name: payload.name.trim(),
    slug: uniqueSlug,
    description: normalizeText(payload.description),
    short_description: normalizeText(payload.short_description),
    brand: normalizeText(payload.brand),
    sku: normalizeText(payload.sku),
    category_id: payload.category_id ?? null,
    price: payload.price,
    stock: payload.stock,
    is_published: payload.is_published,
  };

  const { error } = await supabase.from('products').update(updatePayload).eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const imageUrl = normalizeText(payload.image_url);
  if (imageUrl) {
    const { data: existingPrimary } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', id)
      .eq('is_primary', true)
      .limit(1)
      .maybeSingle();

    if (existingPrimary?.id) {
      await supabase.from('product_images').update({ url: imageUrl }).eq('id', existingPrimary.id);
    } else {
      await supabase.from('product_images').insert({ product_id: id, url: imageUrl, is_primary: true, sort_order: 0 });
    }
  }

  return NextResponse.json({ success: true, data: { id, slug: uniqueSlug } });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;

  const { id } = await params;
  const supabase = createServiceClient();

  await supabase.from('product_images').delete().eq('product_id', id);
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
