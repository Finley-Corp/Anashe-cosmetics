'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Plus, Star } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/shared/Toaster';
import {
  formatPrice,
  getDiscountPercent,
  isSupabaseStorageUrl,
  resolveProductImageUrl,
  shouldUnoptimizeImage,
} from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  initialWishlisted?: boolean;
}

export function ProductCard({ product, priority = false, initialWishlisted = false }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [isAdding, setIsAdding] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [primaryErrored, setPrimaryErrored] = useState(false);
  const [secondaryErrored, setSecondaryErrored] = useState(false);
  const { addItem } = useCartStore();
  const { add: showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const rawPrimaryImage = product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url;
  const rawSecondaryImage = product.images?.[1]?.url;
  const resolvedPrimaryImage = resolveProductImageUrl(rawPrimaryImage);
  const resolvedSecondaryImage = resolveProductImageUrl(rawSecondaryImage);
  const primaryImage = primaryErrored ? '/images/hero-image.jpg' : resolvedPrimaryImage ?? '/images/hero-image.jpg';
  const secondaryImage =
    secondaryErrored || resolvedSecondaryImage === primaryImage ? null : resolvedSecondaryImage;
  const normalizedName = product.name.replace(/\s+/g, ' ').trim();
  const price = product.sale_price ?? product.price;
  const discountPercent = product.sale_price ? getDiscountPercent(product.price, product.sale_price) : 0;

  useEffect(() => {
    if (!isHovered || !secondaryImage) {
      setCarouselIndex(0);
      return;
    }
    const timer = window.setInterval(() => {
      setCarouselIndex((prev) => (prev === 0 ? 1 : 0));
    }, 1800);
    return () => window.clearInterval(timer);
  }, [isHovered, secondaryImage]);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem({
      productId: product.id,
      variantId: null,
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        sale_price: product.sale_price,
        slug: product.slug,
        image: primaryImage,
      },
    });
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      showToast('Added to bag', 'success', {
        kind: 'cart',
        cart: {
          productName: product.name,
          image: primaryImage,
          quantity: 1,
          unitPrice: product.sale_price ?? product.price,
        },
      });
    } else {
      showToast(`${product.name} added to cart`);
    }
    setTimeout(() => setIsAdding(false), 600);
  }

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isTogglingWishlist) return;
    setIsTogglingWishlist(true);

    try {
      const res = isWishlisted
        ? await fetch(`/api/wishlist/${product.id}`, { method: 'DELETE' })
        : await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: product.id }),
          });

      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 401) {
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname || '/products')}`);
        return;
      }
      if (!res.ok) {
        throw new Error(payload.error ?? 'Unable to update wishlist');
      }

      setIsWishlisted((prev) => !prev);
      showToast(
        isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
        isWishlisted ? 'info' : 'success'
      );
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update wishlist', 'error');
    } finally {
      setIsTogglingWishlist(false);
    }
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group product-card block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square bg-neutral-100 rounded-xl overflow-hidden mb-4 border border-neutral-100">
        {/* Primary image */}
        {primaryImage ? (
          isSupabaseStorageUrl(primaryImage) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage}
              alt={product.name}
              className={`product-card-img object-cover absolute inset-0 z-10 h-full w-full transition-transform duration-700 ease-in-out ${
                secondaryImage && carouselIndex === 1 ? '-translate-x-full' : 'translate-x-0'
              }`}
              loading={priority ? 'eager' : 'lazy'}
              onError={() => setPrimaryErrored(true)}
            />
          ) : (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className={`product-card-img object-cover absolute inset-0 z-10 transition-transform duration-700 ease-in-out ${
                secondaryImage && carouselIndex === 1 ? '-translate-x-full' : 'translate-x-0'
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
              unoptimized={shouldUnoptimizeImage(primaryImage)}
              onError={() => setPrimaryErrored(true)}
            />
          )
        ) : (
          <div className="w-full h-full bg-neutral-200" />
        )}
        {/* Secondary image (hover) */}
        {secondaryImage && (
          isSupabaseStorageUrl(secondaryImage) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={secondaryImage}
              alt={product.name}
              className={`product-card-img object-cover absolute inset-0 h-full w-full transition-transform duration-700 ease-in-out ${
                carouselIndex === 1 ? 'translate-x-0' : 'translate-x-full'
              }`}
              loading="lazy"
              onError={() => setSecondaryErrored(true)}
            />
          ) : (
            <Image
              src={secondaryImage}
              alt={product.name}
              fill
              className={`product-card-img object-cover absolute inset-0 transition-transform duration-700 ease-in-out ${
                carouselIndex === 1 ? 'translate-x-0' : 'translate-x-full'
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized={shouldUnoptimizeImage(secondaryImage)}
              onError={() => setSecondaryErrored(true)}
            />
          )
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
          {product.is_featured && (
            <span className="text-[9px] font-bold uppercase bg-amber-500 text-white px-2 py-0.5 rounded">Featured</span>
          )}
          {discountPercent > 0 && (
            <span className="text-[9px] font-bold uppercase bg-red-500 text-white px-2 py-0.5 rounded">-{discountPercent}%</span>
          )}
          {product.stock <= 0 && (
            <span className="text-[9px] font-bold uppercase bg-neutral-600 text-white px-2 py-0.5 rounded">Sold Out</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={toggleWishlist}
          disabled={isTogglingWishlist}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-400'}`}
          />
        </button>

        {/* Quick add */}
        {product.stock > 0 && (
          <div className="absolute bottom-3 left-3 right-3 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full h-10 bg-white/95 backdrop-blur text-neutral-900 text-xs font-bold rounded-lg shadow-lg hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <Plus className="w-3.5 h-3.5" />
              {isAdding ? 'Adding...' : 'Quick Add'}
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight min-h-10 overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {normalizedName}
          </h3>
          {product.brand && (
            <p className="text-xs text-neutral-500 mt-0.5">{product.brand}</p>
          )}
          {product.review_count > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-neutral-500">
                {product.average_rating.toFixed(1)} ({product.review_count})
              </span>
            </div>
          )}
        </div>
        <div className="shrink-0 text-right">
          <span className="text-sm font-bold text-neutral-900 whitespace-nowrap">{formatPrice(price)}</span>
          {product.sale_price && (
            <p className="text-xs text-neutral-400 line-through whitespace-nowrap">{formatPrice(product.price)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="block">
      <div className="aspect-square bg-neutral-100 rounded-xl mb-4 skeleton" />
      <div className="space-y-2">
        <div className="h-4 bg-neutral-100 rounded skeleton w-3/4" />
        <div className="h-3 bg-neutral-100 rounded skeleton w-1/2" />
      </div>
    </div>
  );
}
