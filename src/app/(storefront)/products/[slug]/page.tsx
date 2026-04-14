import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductDetailClient } from './ProductDetailClient';
import type { Product } from '@/types';
import { createServiceClient } from '@/lib/supabase/service';
import type { Review } from '@/types';

async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    console.error('[Product Detail] Failed to fetch product', { slug, error: error?.message });
    return null;
  }
  return data as Product;
}

async function getApprovedReviews(productId: string): Promise<Review[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) {
    console.error('[Product Detail] Failed to fetch reviews', { productId, error: error.message });
    return [];
  }
  return (data ?? []) as Review[];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.meta_title ?? product.name,
    description: product.meta_description ?? product.short_description ?? '',
    openGraph: {
      title: product.name,
      description: product.short_description ?? '',
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = await getApprovedReviews(product.id);
  return <ProductDetailClient product={product} reviews={reviews} />;
}
