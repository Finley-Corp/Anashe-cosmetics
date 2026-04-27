import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, resolveProductImageUrl, shouldUnoptimizeImage } from '@/lib/utils';

type BlogPostRecord = {
  id: string;
  title: string;
  category: string | null;
  excerpt: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string | null;
  is_published?: boolean | null;
  content?: string | null;
  body?: string | null;
};

type SidebarProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  images?: Array<{
    url: string;
    is_primary: boolean | null;
    sort_order: number | null;
  }>;
};

function formatPostDate(value: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-KE', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data }, { data: soldItems }] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .maybeSingle(),
    supabase
      .from('order_items')
      .select('product_id,quantity')
      .limit(4000),
  ]);

  if (!data) {
    notFound();
  }

  const post = data as BlogPostRecord;
  const postBody = post.content ?? post.body ?? post.excerpt ?? '';

  const unitsByProduct = new Map<string, number>();
  for (const item of soldItems ?? []) {
    const productId = item.product_id as string | null;
    if (!productId) continue;
    const current = unitsByProduct.get(productId) ?? 0;
    unitsByProduct.set(productId, current + Number(item.quantity ?? 0));
  }
  const topProductIds = Array.from(unitsByProduct.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([productId]) => productId);

  let topProducts: SidebarProduct[] = [];
  if (topProductIds.length > 0) {
    const { data: productsBySales } = await supabase
      .from('products')
      .select('id,name,slug,price,sale_price,images:product_images(url,is_primary,sort_order)')
      .eq('is_published', true)
      .in('id', topProductIds)
      .limit(8);

    const byId = new Map(((productsBySales ?? []) as SidebarProduct[]).map((p) => [p.id, p]));
    topProducts = topProductIds.map((pid) => byId.get(pid)).filter(Boolean) as SidebarProduct[];
  }

  if (topProducts.length === 0) {
    const { data: featuredFallback } = await supabase
      .from('products')
      .select('id,name,slug,price,sale_price,images:product_images(url,is_primary,sort_order)')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(4);
    topProducts = (featuredFallback ?? []) as SidebarProduct[];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/90 px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:text-neutral-900 hover:shadow-md mb-8"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to The Journal
          </Link>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-3">{post.category ?? 'Journal'}</p>
            <h1 className="text-3xl md:text-5xl font-medium tracking-tight font-[family-name:var(--font-display)] mb-4">{post.title}</h1>
            <p className="text-sm text-neutral-400">{formatPostDate(post.published_at ?? post.created_at)}</p>
          </div>

          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100 mb-10">
            <Image
              src={post.image_url ?? '/images/hero-1.jpg'}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-neutral max-w-none">
            <p className="text-base leading-8 whitespace-pre-line text-neutral-700">
              {postBody || 'This article will be updated with full content soon.'}
            </p>
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700 mb-3">Shop Best Sellers</p>
            <h2 className="text-xl font-medium tracking-tight font-[family-name:var(--font-display)] mb-4">Popular Products</h2>
            <div className="space-y-3">
              {topProducts.map((product) => {
                const sortedImages = [...(product.images ?? [])].sort(
                  (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)
                );
                const rawImage = sortedImages.find((img) => img.is_primary)?.url ?? sortedImages[0]?.url ?? null;
                const image = resolveProductImageUrl(rawImage) ?? '/images/hero-image.jpg';
                const price = product.sale_price ?? product.price;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-neutral-200 p-2.5 transition-colors hover:bg-neutral-50"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-neutral-100 flex-shrink-0">
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized={shouldUnoptimizeImage(image)}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 line-clamp-2 group-hover:underline">{product.name}</p>
                      <p className="text-sm font-bold text-neutral-900 mt-1">{formatPrice(Number(price ?? 0))}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
