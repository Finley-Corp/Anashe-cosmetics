import { createServiceClient } from '@/lib/supabase/service';
import { ProductForm } from '../product-form';

export default async function NewProductPage() {
  const supabase = createServiceClient();
  const { data: categories } = await supabase.from('categories').select('id,name').order('name', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-neutral-900">Add Product</h1>
        <p className="text-sm text-neutral-500 mt-1">Create a new skincare or cosmetic product.</p>
      </div>
      <div className="bg-white border border-neutral-100 rounded-2xl p-6">
        <ProductForm mode="create" categories={categories ?? []} />
      </div>
    </div>
  );
}
