import { createServiceClient } from '@/lib/supabase/service';
import { CategoriesClient } from './categories-client';

export default async function AdminCategoriesPage() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('categories')
    .select('id,name,slug,sort_order,is_active,created_at')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
    .limit(500);

  return <CategoriesClient initialCategories={data ?? []} />;
}

