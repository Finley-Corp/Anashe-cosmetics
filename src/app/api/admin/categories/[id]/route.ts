import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

const updateCategorySchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sort_order: z.coerce.number().int().min(0).max(100000).optional().nullable(),
  is_active: z.coerce.boolean().optional().nullable(),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
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

async function ensureUniqueSlug(baseSlug: string, categoryId: string) {
  const supabase = createServiceClient();
  let slug = baseSlug;
  let idx = 1;

  while (idx < 200) {
    const { data } = await supabase.from('categories').select('id').eq('slug', slug).neq('id', categoryId).limit(1).maybeSingle();
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
  const parsed = updateCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 422 });
  }

  const supabase = createServiceClient();
  const name = parsed.data.name.trim();
  const baseSlug = parsed.data.slug.trim() || slugify(name);
  const uniqueSlug = await ensureUniqueSlug(baseSlug, id);

  const { data, error } = await supabase
    .from('categories')
    .update({
      name,
      slug: uniqueSlug,
      sort_order: parsed.data.sort_order ?? 0,
      is_active: parsed.data.is_active ?? true,
    })
    .eq('id', id)
    .select('id,name,slug,sort_order,is_active,created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;

  const { id } = await params;
  const supabase = createServiceClient();

  const { data: productRef, error: refError } = await supabase
    .from('products')
    .select('id')
    .eq('category_id', id)
    .limit(1)
    .maybeSingle();

  if (refError) return NextResponse.json({ error: refError.message }, { status: 500 });
  if (productRef?.id) {
    return NextResponse.json(
      { error: 'Category is in use by products. Move products to another category or deactivate this category instead.' },
      { status: 409 }
    );
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

