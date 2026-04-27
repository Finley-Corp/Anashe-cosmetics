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
    <>
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[var(--text-primary)] mb-2">Wishlist</h1>
        <p className="text-sm text-[var(--text-body)] max-w-xl leading-relaxed">
          Pieces you have saved — add them to your bag anytime.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center rounded-xl border border-[var(--accent)] bg-white px-6">
          <Heart className="w-16 h-16 text-[var(--primary-100)] mb-6" strokeWidth={1} />
          <h2 className="text-xl font-medium mb-3 text-[var(--text-primary)]">Your wishlist is empty</h2>
          <p className="text-[var(--text-body)] text-sm mb-8 max-w-xs leading-relaxed">
            Save items you love by tapping the heart on any product page.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 h-11 px-8 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" /> Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} initialWishlisted />
          ))}
        </div>
      )}
    </>
  );
}
