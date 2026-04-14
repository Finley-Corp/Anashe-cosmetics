'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { addItem } = useCartStore();
  const { add: showToast } = useToast();

  const images = product.images ?? [];
  const primaryImage = images[selectedImage]?.url ?? images[0]?.url;
  const price = (product.sale_price ?? product.price) + (selectedVariant?.price_modifier ?? 0);
  const originalPrice = product.price + (selectedVariant?.price_modifier ?? 0);
  const discountPercent = product.sale_price ? getDiscountPercent(originalPrice, price) : 0;
  const stockStatus = getStockStatus(selectedVariant?.stock ?? product.stock);
  const maxQty = selectedVariant?.stock ?? product.stock;
  const productIngredients = (product as Product & { ingredients?: string }).ingredients;

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
    showToast(`${product.name} added to cart`);
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

  const stockBadge = {
    in_stock: <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">In Stock</span>,
    low_stock: <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">Only {maxQty} left</span>,
    out_of_stock: <span className="text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">Out of Stock</span>,
  }[stockStatus];

  const variantLabel = product.variants?.[0]?.options
    ? Object.keys(product.variants[0].options)[0]
    : 'Option';

  return (
    <div className="bg-[#F9F8F4] text-[#2C2C2C] min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 lg:pt-12">
        <nav className="flex items-center gap-2 text-xs text-[#5C5C5C] mb-6">
          <Link href="/home" className="hover:text-[#2F3E30] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-[#2F3E30] transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="truncate max-w-[220px] text-[#1A1A1A]">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="aspect-[4/3] w-full bg-[#F0EFE9] rounded-lg overflow-hidden relative group">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-neutral-200" />
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.slice(0, 4).map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-md overflow-hidden transition-opacity ${
                      selectedImage === i ? 'ring-1 ring-[#2F3E30] opacity-100' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.url} alt={img.alt ?? product.name} width={320} height={320} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 lg:mt-0 mt-8 relative">
            <div className="sticky top-24 space-y-8">
              <div className="space-y-3 border-b border-[#E8E4D9] pb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  {product.is_featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8E4D9] text-[#5C5C5C]">
                      Best Seller
                    </span>
                  )}
                  {product.brand && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-[#7D6A58] bg-orange-50/50">
                      {product.brand}
                    </span>
                  )}
                  {stockBadge}
                </div>

                <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#1A1A1A]">{product.name}</h1>
                <p className="text-base text-[#5C5C5C] font-normal leading-relaxed">
                  {product.short_description ?? 'Authentic skincare and beauty essentials crafted for your daily routine.'}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-[#D97706]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.average_rating || 0) ? 'fill-current stroke-none' : 'text-[#D6CEC0]'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-[#5C5C5C] hover:underline cursor-pointer">
                    {(product.average_rating || 0).toFixed(1)} ({reviews.length} Reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-medium text-[#1A1A1A]">{formatPrice(price)}</span>
                {product.sale_price && (
                  <>
                    <span className="text-base text-[#9CA3AF] line-through font-light">{formatPrice(originalPrice)}</span>
                    <span className="text-sm text-[#2F3E30] font-medium">Save {discountPercent}%</span>
                  </>
                )}
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#4A4A4A]">Select {variantLabel}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={variant.stock <= 0}
                        className={`border rounded-lg py-3 px-4 text-sm transition-colors ${
                          selectedVariant?.id === variant.id
                            ? 'border-2 border-[#2F3E30] bg-[#2F3E30]/5 text-[#1A1A1A] font-medium'
                            : 'border-[#E8E4D9] text-[#5C5C5C] hover:border-[#2F3E30]'
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
                  <div className="flex items-center border border-[#E8E4D9] rounded-lg w-32 justify-between px-3 h-12">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[#5C5C5C] hover:text-[#1A1A1A] text-lg">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-base font-medium text-[#1A1A1A]">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(maxQty, quantity + 1))} className="text-[#5C5C5C] hover:text-[#1A1A1A] text-lg">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={addToCart}
                    disabled={stockStatus === 'out_of_stock'}
                    className="flex-1 bg-[#2F3E30] hover:bg-[#243025] text-white font-medium rounded-lg h-12 shadow-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{stockStatus === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}</span>
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsWishlisted(!isWishlisted);
                    showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', isWishlisted ? 'info' : 'success');
                  }}
                  className="w-full h-11 border border-[#E8E4D9] rounded-lg text-sm font-medium text-[#4A4A4A] hover:border-[#2F3E30] transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>

                <div className="flex items-center justify-center gap-4 text-xs text-[#5C5C5C] pt-2 flex-wrap">
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#2F3E30]" /> Lab Tested</span>
                  <span className="w-1 h-1 rounded-full bg-[#E8E4D9]" />
                  <span className="flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5 text-[#2F3E30]" /> No Preservatives</span>
                  <span className="w-1 h-1 rounded-full bg-[#E8E4D9]" />
                  <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[#2F3E30]" /> Farm to Jar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-[#EFECE6] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {[
              { icon: <Heart className="w-6 h-6 text-[#7D6A58] stroke-[1.25]" />, title: 'Skin Loving Formula', desc: 'Selected ingredients formulated for healthy-looking skin and long-term barrier support.' },
              { icon: <Leaf className="w-6 h-6 text-[#7D6A58] stroke-[1.25]" />, title: 'Clean Beauty Focus', desc: 'Crafted without unnecessary fillers, with a focus on practical, skin-first performance.' },
              { icon: <Award className="w-6 h-6 text-[#7D6A58] stroke-[1.25]" />, title: 'Authentic Products', desc: 'Sourced from trusted brands and verified suppliers for quality and consistency.' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                <div className="w-12 h-12 rounded-full bg-[#E4DFCFA] flex items-center justify-center shrink-0 border border-[#D6CEC0]">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-medium text-[#2F3E30] mb-1">{item.title}</h3>
                  <p className="text-sm text-[#5C5C5C] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {product.description && (
        <section className="py-20 bg-[#F9F8F4]">
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
                <h2 className="text-3xl tracking-tight text-[#2F3E30]">Crafted for your routine.</h2>
                <div
                  className="prose prose-sm max-w-none text-[#5C5C5C] [&>h3]:text-[#1A1A1A] [&>h3]:font-semibold [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="border-[#E8E4D9] border-t pt-16 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl text-[#1A1A1A] text-center mb-10 tracking-tight">Transparency in every use</h2>
          <div className="bg-white rounded-xl border border-[#E8E4D9] divide-y divide-[#E8E4D9]">
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

      <section className="py-20 bg-[#F5F4EF]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl text-[#1A1A1A] tracking-tight">Customer Reviews</h2>
            <span className="text-sm font-medium text-[#5C5C5C]">{reviews.length} total</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg border border-[#E8E4D9] shadow-sm">
                <div className="flex text-[#D97706] mb-3">
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

          <form onSubmit={submitReview} className="bg-white rounded-xl border border-[#E8E4D9] p-5 space-y-3 max-w-3xl">
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Write a review</h3>
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#5C5C5C]">Rating</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border border-[#E8E4D9] rounded px-2 py-1 text-xs bg-white">
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
              className="w-full border border-[#E8E4D9] rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value)}
              placeholder="Share your experience with this product"
              className="w-full border border-[#E8E4D9] rounded-lg px-3 py-2 text-sm min-h-24"
            />
            <button type="submit" disabled={isSubmittingReview} className="h-10 px-4 rounded-lg bg-[#2F3E30] text-white text-sm font-semibold disabled:opacity-60">
              {isSubmittingReview ? 'Submitting...' : 'Submit review'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
