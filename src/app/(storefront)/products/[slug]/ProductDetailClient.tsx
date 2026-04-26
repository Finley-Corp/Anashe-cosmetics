'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight, Star, Heart, ShoppingBag, Truck, Minus, Plus, CheckCircle, Leaf, Award } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/shared/Toaster';
import { formatPrice, getDiscountPercent, getStockStatus } from '@/lib/utils';
import type { Product } from '@/types';
import type { Review } from '@/types';

interface ProductDetailClientProps {
  product: Product;
  reviews: Review[];
}

export function ProductDetailClient({ product, reviews }: ProductDetailClientProps) {
  const images = useMemo(
    () =>
      [...(product.images ?? [])].sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      }),
    [product.images]
  );
  const primaryImageIndex = useMemo(() => {
    const idx = images.findIndex((img) => img.is_primary);
    return idx >= 0 ? idx : 0;
  }, [images]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistBusy, setIsWishlistBusy] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { addItem } = useCartStore();
  const { add: showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setSelectedImage(primaryImageIndex);
  }, [product.id, primaryImageIndex]);

  const activeImageIndex =
    selectedImage >= 0 && selectedImage < images.length ? selectedImage : primaryImageIndex;
  const primaryImage = images[activeImageIndex]?.url ?? images[primaryImageIndex]?.url ?? images[0]?.url;
  const price = (product.sale_price ?? product.price) + (selectedVariant?.price_modifier ?? 0);
  const originalPrice = product.price + (selectedVariant?.price_modifier ?? 0);
  const discountPercent = product.sale_price ? getDiscountPercent(originalPrice, price) : 0;
  const stockStatus = getStockStatus(selectedVariant?.stock ?? product.stock);
  const maxQty = selectedVariant?.stock ?? product.stock;
  const productIngredients = (product as Product & { ingredients?: string }).ingredients;

  const isSupabaseStorageUrl = (url: string) =>
    url.includes('.supabase.co/storage/v1/object') || url.includes('.supabase.in/storage/v1/object');

  function addToCart() {
    if (stockStatus === 'out_of_stock') return;
    const primaryImg = images.find((i) => i.is_primary)?.url ?? images[0]?.url;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        sale_price: product.sale_price,
        slug: product.slug,
        image: primaryImg,
      },
      variant: selectedVariant ? {
        id: selectedVariant.id,
        name: selectedVariant.name,
        price_modifier: selectedVariant.price_modifier,
      } : undefined,
    });
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      showToast('Added to bag', 'success', {
        kind: 'cart',
        cart: {
          productName: product.name,
          image: primaryImg,
          quantity,
          variantName: selectedVariant?.name,
          unitPrice: price,
        },
      });
    } else {
      showToast(`${product.name} added to cart`);
    }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          title: reviewTitle || undefined,
          body: reviewBody || undefined,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? 'Failed to submit review');
      }
      showToast('Review submitted. It will appear after approval.');
      setReviewTitle('');
      setReviewBody('');
      setRating(5);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  }

  async function toggleWishlist() {
    if (isWishlistBusy) return;
    setIsWishlistBusy(true);
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
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname || `/products/${product.slug}`)}`);
        return;
      }
      if (!res.ok) {
        throw new Error(payload.error ?? 'Unable to update wishlist');
      }

      setIsWishlisted((prev) => !prev);
      showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', isWishlisted ? 'info' : 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update wishlist', 'error');
    } finally {
      setIsWishlistBusy(false);
    }
  }

  const stockBadge = {
    in_stock: <span className="text-xs font-semibold text-[var(--primary)] bg-[var(--accent)] px-2.5 py-1 rounded-full">In Stock</span>,
    low_stock: <span className="text-xs font-semibold text-[var(--primary)] bg-[var(--accent)] px-2.5 py-1 rounded-full">Only {maxQty} left</span>,
    out_of_stock: <span className="text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">Out of Stock</span>,
  }[stockStatus];

  const variantLabel = product.variants?.[0]?.options
    ? Object.keys(product.variants[0].options)[0]
    : 'Option';

  return (
    <div className="bg-[var(--canvas)] text-[var(--text-primary)] min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 lg:pt-12">
        <nav className="flex items-center gap-2 text-xs text-[var(--text-body)] mb-6">
          <Link href="/home" className="hover:text-[var(--primary)] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-[var(--primary)] transition-colors">Products</Link>
          {product.category?.slug ? (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link
                href={`/categories/${product.category.slug}`}
                className="hover:text-[var(--primary)] transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          ) : null}
          <ChevronRight className="w-3 h-3" />
          <span className="truncate max-w-[220px] text-[var(--text-primary)]">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="aspect-[4/3] w-full bg-white rounded-lg overflow-hidden relative group">
              {primaryImage ? (
                isSupabaseStorageUrl(primaryImage) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={primaryImage}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="eager"
                    fetchPriority="high"
                  />
                ) : (
                  <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    className="w-full h-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    priority
                  />
                )
              ) : (
                <div className="w-full h-full bg-neutral-200" />
              )}
            </div>

            {images.length > 1 && (
              <div className="rounded-xl border border-[var(--accent)] bg-white/60 p-2.5 md:p-3">
                <div className="flex gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory md:grid md:grid-cols-6 lg:grid-cols-7 md:gap-3 md:overflow-visible md:pb-0">
                  {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`snap-start shrink-0 h-20 w-20 md:h-[84px] md:w-[84px] lg:h-[92px] lg:w-[92px] rounded-lg overflow-hidden border transition-all ${
                      activeImageIndex === i
                        ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/25 opacity-100'
                        : 'border-neutral-200 opacity-80 hover:opacity-100 hover:border-neutral-300'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    {isSupabaseStorageUrl(img.url) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img.url} alt={img.alt ?? product.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <Image src={img.url} alt={img.alt ?? product.name} width={320} height={320} className="h-full w-full object-cover" />
                    )}
                  </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 lg:mt-0 mt-8 relative">
            <div className="sticky top-24 space-y-8">
              <div className="space-y-3 border-b border-[var(--accent)] pb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  {product.is_featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--accent)] text-[var(--text-body)]">
                      Best Seller
                    </span>
                  )}
                  {product.brand && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-[var(--primary)] bg-[var(--accent)]">
                      {product.brand}
                    </span>
                  )}
                  {stockBadge}
                </div>

                <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[var(--text-primary)]">{product.name}</h1>
                <p className="text-base text-[var(--text-body)] font-normal leading-relaxed">
                  {product.short_description ?? 'Authentic skincare and beauty essentials crafted for your daily routine.'}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-[var(--primary)]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.average_rating || 0) ? 'fill-current stroke-none' : 'text-zinc-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-[var(--text-body)] hover:underline cursor-pointer">
                    {(product.average_rating || 0).toFixed(1)} ({reviews.length} Reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-medium text-[var(--text-primary)]">{formatPrice(price)}</span>
                {product.sale_price && (
                  <>
                    <span className="text-base text-[#9CA3AF] line-through font-light">{formatPrice(originalPrice)}</span>
                    <span className="text-sm text-[var(--primary)] font-medium">Save {discountPercent}%</span>
                  </>
                )}
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[var(--text-body)]">Select {variantLabel}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={variant.stock <= 0}
                        className={`border rounded-lg py-3 px-4 text-sm transition-colors ${
                          selectedVariant?.id === variant.id
                            ? 'border-2 border-[var(--primary)] bg-[var(--accent)] text-[var(--text-primary)] font-medium'
                            : 'border-[var(--accent)] text-[var(--text-body)] hover:border-[var(--primary)]'
                        } disabled:opacity-50`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-center">
                  <div className="flex items-center border border-[var(--accent)] rounded-lg w-32 justify-between px-3 h-12">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[var(--text-body)] hover:text-[var(--text-primary)] text-lg">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-base font-medium text-[var(--text-primary)]">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(maxQty, quantity + 1))} className="text-[var(--text-body)] hover:text-[var(--text-primary)] text-lg">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={addToCart}
                    disabled={stockStatus === 'out_of_stock'}
                    className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium rounded-lg h-12 shadow-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{stockStatus === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}</span>
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={toggleWishlist}
                  disabled={isWishlistBusy}
                  className="w-full h-11 border border-[var(--accent)] rounded-lg text-sm font-medium text-[var(--text-body)] hover:border-[var(--primary)] transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>

                <div className="flex items-center justify-center gap-4 text-xs text-[var(--text-body)] pt-2 flex-wrap">
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[var(--primary)]" /> Lab Tested</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                  <span className="flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5 text-[var(--primary)]" /> No Preservatives</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                  <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[var(--primary)]" /> Farm to Jar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-[var(--accent)] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {[
              { icon: <Heart className="w-6 h-6 text-[var(--primary)] stroke-[1.25]" />, title: 'Skin Loving Formula', desc: 'Selected ingredients formulated for healthy-looking skin and long-term barrier support.' },
              { icon: <Leaf className="w-6 h-6 text-[var(--primary)] stroke-[1.25]" />, title: 'Clean Beauty Focus', desc: 'Crafted without unnecessary fillers, with a focus on practical, skin-first performance.' },
              { icon: <Award className="w-6 h-6 text-[var(--primary)] stroke-[1.25]" />, title: 'Authentic Products', desc: 'Sourced from trusted brands and verified suppliers for quality and consistency.' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 border border-[var(--primary-100)]">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">{item.title}</h3>
                  <p className="text-sm text-[var(--text-body)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {product.description && (
        <section className="py-20 bg-[var(--canvas)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-12 items-center">
              <div className="order-2 md:order-1 relative rounded-lg overflow-hidden">
                <Image
                  src={images[1]?.url ?? primaryImage ?? '/images/hero-image-pro-2.jpg'}
                  alt={`${product.name} detail`}
                  width={1600}
                  height={1000}
                  className="grayscale-[10%] hover:grayscale-0 transition-all duration-700 w-full h-[500px] object-cover"
                />
                <div className="bg-gradient-to-t from-black/40 to-transparent absolute inset-0" />
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="text-3xl tracking-tight text-[var(--text-primary)]">Crafted for your routine.</h2>
                <div
                  className="prose prose-sm max-w-none text-[var(--text-body)] [&>h3]:text-[var(--text-primary)] [&>h3]:font-semibold [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="border-[var(--accent)] border-t pt-16 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl text-[#1A1A1A] text-center mb-10 tracking-tight">Transparency in every use</h2>
          <div className="bg-white rounded-xl border border-[var(--accent)] divide-y divide-[var(--accent)]">
            <div className="p-5">
              <span className="block text-sm font-medium text-[#1A1A1A]">Ingredients</span>
              <span className="block text-sm text-[#5C5C5C] mt-1">{productIngredients || 'Ingredients listed on package.'}</span>
            </div>
            <div className="p-5">
              <span className="block text-sm font-medium text-[#1A1A1A]">About this product</span>
              <span className="block text-sm text-[#5C5C5C] mt-1">{product.short_description || 'High-quality skincare and cosmetic product.'}</span>
            </div>
            <div className="p-5">
              <span className="block text-sm font-medium text-[#1A1A1A]">Storage instructions</span>
              <span className="block text-sm text-[#5C5C5C] mt-1">Store in a cool, dry place away from direct sunlight.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--accent)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl text-[#1A1A1A] tracking-tight">Customer Reviews</h2>
            <span className="text-sm font-medium text-[var(--text-body)]">{reviews.length} total</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg border border-[var(--primary-100)] shadow-sm">
                <div className="flex text-[var(--primary)] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current stroke-none' : 'text-[#D6CEC0]'}`} />
                  ))}
                </div>
                {review.title && <p className="text-sm font-medium text-[#1A1A1A] mb-2">{review.title}</p>}
                <p className="text-[#4A4A4A] text-sm leading-relaxed mb-4">{review.body}</p>
                <p className="text-[11px] text-[#9CA3AF]">{new Date(review.created_at).toLocaleDateString('en-KE')}</p>
              </div>
            ))}
          </div>

          <form onSubmit={submitReview} className="bg-white rounded-xl border border-[var(--primary-100)] p-5 space-y-3 max-w-3xl">
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Write a review</h3>
            <div className="flex items-center gap-2">
              <label className="text-xs text-[var(--text-body)]">Rating</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border border-[var(--primary-100)] rounded px-2 py-1 text-xs bg-white">
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} star{r > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="Review title"
              className="w-full border border-[var(--primary-100)] rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value)}
              placeholder="Share your experience with this product"
              className="w-full border border-[var(--primary-100)] rounded-lg px-3 py-2 text-sm min-h-24"
            />
            <button type="submit" disabled={isSubmittingReview} className="h-10 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold disabled:opacity-60">
              {isSubmittingReview ? 'Submitting...' : 'Submit review'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
