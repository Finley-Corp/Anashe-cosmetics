import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { createServiceClient } from '@/lib/supabase/service';
import { ProductRowActions } from './product-row-actions';

export default async function AdminProductsPage() {
  const supabase = createServiceClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('id,name,sku,price,stock,is_published,category_id,images:product_images(url,is_primary)')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase.from('categories').select('id,name'),
  ]);
  const categoryMap = new Map((categories ?? []).map((category) => [category.id, category.name]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Products</h1>
          <p className="text-sm text-neutral-500 mt-1">{products?.length ?? 0} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 h-10 px-5 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(products ?? []).map((product) => (
                <tr key={product.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3 min-w-[320px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url ?? 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=100&q=80'}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="font-medium text-neutral-900">{product.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs font-mono whitespace-nowrap">{product.sku}</td>
                  <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">
                    {(product.category_id ? categoryMap.get(product.category_id) : null) ?? '-'}
                  </td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">KES {product.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      product.stock === 0 ? 'bg-red-50 text-red-600' :
                      product.stock <= 5 ? 'bg-amber-50 text-amber-700' :
                      'bg-neutral-100 text-neutral-700'
                    }`}>
                      {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.is_published ? 'bg-neutral-100 text-neutral-700' : 'bg-neutral-100 text-neutral-500'}`}>
                      {product.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <ProductRowActions productId={product.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
