import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { createServiceClient } from '@/lib/supabase/service';
import { isSupabaseStorageUrl, resolveProductImageUrl, shouldUnoptimizeImage } from '@/lib/utils';
import { ProductRowActions } from './product-row-actions';
import { DeleteAllProductsButton } from './delete-all-products-button';

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

  function ProductTableImage({ src, alt }: { src: string; alt: string }) {
    if (isSupabaseStorageUrl(src)) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="object-cover w-full h-full" loading="lazy" />
      );
    }

    return (
      <Image
        src={src}
        alt={alt}
        width={40}
        height={40}
        className="object-cover w-full h-full"
        unoptimized={shouldUnoptimizeImage(src)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products?.length ?? 0} total products</p>
        </div>
        <div className="flex items-center gap-2">
          <DeleteAllProductsButton />
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 h-10 px-5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      <div className="bg-[#1A1D21] border border-white/5 rounded-2xl overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(products ?? []).map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3 min-w-[320px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                        <ProductTableImage
                          src={
                            resolveProductImageUrl(
                              product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url
                            ) ?? 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=100&q=80'
                          }
                          alt={product.name}
                        />
                      </div>
                      <p className="font-medium text-white">{product.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono whitespace-nowrap">{product.sku}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                    {(product.category_id ? categoryMap.get(product.category_id) : null) ?? '-'}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">KES {product.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      product.stock === 0 ? 'bg-red-500/15 text-red-300' :
                      product.stock <= 5 ? 'bg-amber-500/15 text-amber-300' :
                      'bg-emerald-500/15 text-emerald-300'
                    }`}>
                      {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.is_published ? 'bg-sky-500/15 text-sky-300' : 'bg-white/10 text-gray-400'}`}>
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
