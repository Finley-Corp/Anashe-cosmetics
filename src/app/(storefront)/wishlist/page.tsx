import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';

export const metadata = { title: 'My Wishlist' };

export default function WishlistPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
      <h1 className="text-2xl font-semibold mb-8 font-[family-name:var(--font-display)]">My Wishlist</h1>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Heart className="w-20 h-20 text-neutral-200 mb-6" />
        <h2 className="text-xl font-medium mb-3 font-[family-name:var(--font-display)]">Your wishlist is empty</h2>
        <p className="text-neutral-500 text-sm mb-8 max-w-xs">Save items you love by clicking the heart icon on any product</p>
        <Link href="/products" className="inline-flex items-center gap-2 h-11 px-8 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-colors">
          <ShoppingBag className="w-4 h-4" /> Browse Products
        </Link>
      </div>
    </div>
  );
}
