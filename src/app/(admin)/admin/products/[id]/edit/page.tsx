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
      .select('id,name,slug,short_description,description,brand,sku,category_id,price,stock,is_published,images:product_images(url,is_primary)')
      .eq('id', id)
      .maybeSingle(),
  ]);

  if (!product) {
    notFound();
  }

  const primaryImage = product.images?.find((img) => img.is_primary)?.url ?? product.images?.[0]?.url ?? '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-neutral-900">Edit Product</h1>
        <p className="text-sm text-neutral-500 mt-1">Update product details and inventory.</p>
      </div>
      <div className="bg-white border border-neutral-100 rounded-2xl p-6">
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
            stock: Number(product.stock ?? 0),
            image_url: primaryImage,
            is_published: Boolean(product.is_published),
          }}
        />
      </div>
    </div>
  );
}
