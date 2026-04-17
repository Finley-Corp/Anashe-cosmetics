import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Heart, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/storefront/ProductCard';
import type { Product } from '@/types';

export const metadata = { title: 'My Wishlist' };

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login?redirect=/wishlist');
  }

  let products: Product[] = [];
  const { data: wishlist } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (wishlist?.id) {
    const { data } = await supabase
      .from('wishlist_items')
      .select('product:products(*, images:product_images(*))')
      .eq('wishlist_id', wishlist.id)
      .order('added_at', { ascending: false });

    type WishlistItemRow = { product: Product | Product[] | null };
    products = (data ?? [])
      .map((row) => {
        const productRelation = (row as WishlistItemRow).product;
        if (Array.isArray(productRelation)) return productRelation[0] ?? null;
        return productRelation;
      })
      .filter((row): row is Product => Boolean(row));
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
      <h1 className="text-2xl font-semibold mb-8 font-[family-name:var(--font-display)]">My Wishlist</h1>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="w-20 h-20 text-neutral-200 mb-6" />
          <h2 className="text-xl font-medium mb-3 font-[family-name:var(--font-display)]">Your wishlist is empty</h2>
          <p className="text-neutral-500 text-sm mb-8 max-w-xs">Save items you love by clicking the heart icon on any product</p>
          <Link href="/products" className="inline-flex items-center gap-2 h-11 px-8 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-colors">
            <ShoppingBag className="w-4 h-4" /> Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} initialWishlisted />
          ))}
        </div>
      )}
    </div>
  );
}
