import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/service';
import { ProductForm } from '../../product-form';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const [{ data: categories }, { data: product }] = await Promise.all([
    supabase.from('categories').select('id,name').order('name', { ascending: true }),
    supabase
      .from('products')
      .select('id,name,slug,short_description,description,brand,sku,category_id,price,sale_price,stock,is_published,images:product_images(id,url,is_primary,sort_order)')
      .eq('id', id)
      .maybeSingle(),
  ]);

  if (!product) {
    notFound();
  }

  const imagesSorted = (product.images ?? []).slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const primaryImage = imagesSorted.find((img) => img.is_primary)?.url ?? imagesSorted[0]?.url ?? '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-white">Edit Product</h1>
        <p className="text-sm text-gray-500 mt-1">Update product details and inventory.</p>
      </div>
      <div className="bg-[#1A1D21] border border-white/5 rounded-2xl p-6">
        <ProductForm
          mode="edit"
          productId={product.id}
          categories={categories ?? []}
          initialValues={{
            name: product.name,
            slug: product.slug,
            short_description: product.short_description ?? '',
            description: product.description ?? '',
            brand: product.brand ?? '',
            sku: product.sku ?? '',
            category_id: product.category_id ?? '',
            price: Number(product.price ?? 0),
            sale_price: product.sale_price == null ? '' : Number(product.sale_price),
            stock: Number(product.stock ?? 0),
            is_published: Boolean(product.is_published),
          }}
          initialImages={imagesSorted.map((img, idx) => ({
            url: img.url,
            is_primary: Boolean(img.is_primary),
            sort_order: Number(img.sort_order ?? idx),
          }))}
        />
      </div>
    </div>
  );
}
