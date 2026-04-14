import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';

const querySchema = z.object({
  q: z.string().max(100).optional(),
  category: z.string().optional(),
  skin_type: z.union([z.string(), z.array(z.string())]).optional(),
  concerns: z.union([z.string(), z.array(z.string())]).optional(),
  min_price: z.coerce.number().min(0).optional(),
  max_price: z.coerce.number().min(0).optional(),
  finish: z.string().optional(),
  spf_min: z.coerce.number().min(0).optional(),
  spf_max: z.coerce.number().min(0).optional(),
  is_vegan: z.coerce.boolean().optional(),
  is_cruelty_free: z.coerce.boolean().optional(),
  is_natural: z.coerce.boolean().optional(),
  in_stock: z.coerce.boolean().optional(),
  sort: z.enum(['relevance', 'price_asc', 'price_desc', 'newest', 'popular', 'rating']).optional().default('newest'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(16),
  brand: z.string().optional()
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      if (params[key]) {
        const existing = params[key];
        params[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
      } else {
        params[key] = value;
      }
    });
    const parsed = querySchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 422 });
    }

    const supabase = createServiceClient();
    const {
      q,
      category,
      skin_type,
      concerns,
      min_price,
      max_price,
      finish,
      spf_min,
      spf_max,
      is_vegan,
      is_cruelty_free,
      is_natural,
      in_stock,
      sort,
      page,
      limit,
      brand,
    } = parsed.data;

    let query = supabase
      .from('products')
      .select('*, images:product_images(*), category:categories(*)', { count: 'exact' })
      .eq('is_published', true);

    if (q) {
      query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,short_description.ilike.%${q}%,ingredients.ilike.%${q}%`);
    }

    if (category) {
      const { data: categoryRow } = await supabase.from('categories').select('id').eq('slug', category).single();
      if (categoryRow?.id) {
        query = query.eq('category_id', categoryRow.id);
      }
    }

    if (brand) query = query.ilike('brand', `%${brand}%`);
    if (min_price !== undefined) query = query.gte('price', min_price);
    if (max_price !== undefined) query = query.lte('price', max_price);
    if (finish) query = query.eq('finish', finish);
    if (spf_min !== undefined) query = query.gte('spf', spf_min);
    if (spf_max !== undefined) query = query.lte('spf', spf_max);
    if (is_vegan !== undefined) query = query.eq('is_vegan', is_vegan);
    if (is_cruelty_free !== undefined) query = query.eq('is_cruelty_free', is_cruelty_free);
    if (is_natural !== undefined) query = query.eq('is_natural', is_natural);
    if (in_stock) query = query.gt('stock', 0);

    const skinTypes = skin_type ? (Array.isArray(skin_type) ? skin_type : [skin_type]) : [];
    const concernFilters = concerns ? (Array.isArray(concerns) ? concerns : [concerns]) : [];
    if (skinTypes.length > 0) query = query.overlaps('skin_type', skinTypes);
    if (concernFilters.length > 0) query = query.overlaps('concerns', concernFilters);

    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'rating':
        query = query.order('average_rating', { ascending: false });
        break;
      case 'popular':
        query = query.order('review_count', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, count, error } = await query.range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: data ?? [],
      total,
      page,
      totalPages,
      perPage: limit,
    });
  } catch (error) {
    console.error('[Products API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
