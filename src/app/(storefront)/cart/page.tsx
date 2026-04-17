'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Minus, Plus, X, ArrowRight, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice, isSupabaseStorageUrl, resolveProductImageUrl, shouldUnoptimizeImage } from '@/lib/utils';
import { useMemo, useState } from 'react';

function CartProductImage({ image, name }: { image?: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  const resolved = useMemo(() => resolveProductImageUrl(image), [image]);

  if (!resolved || failed) {
    return <div className="w-full h-full bg-neutral-200" />;
  }

  if (isSupabaseStorageUrl(resolved)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={resolved} alt={name} className="w-full h-full object-cover" loading="lazy" onError={() => setFailed(true)} />
    );
  }

  return (
    <Image
      src={resolved}
      alt={name}
      width={96}
      height={96}
      className="w-full h-full object-cover"
      unoptimized={shouldUnoptimizeImage(resolved)}
      onError={() => setFailed(true)}
    />
  );
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shippingDiscount, setShippingDiscount] = useState(0);
  const subtotal = getSubtotal();
  const shippingBase = subtotal >= 2000 ? 0 : 250;
  const shipping = Math.max(0, shippingBase - shippingDiscount);
  const total = subtotal - discount + shipping;

  async function applyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      alert('Enter a coupon code first.');
      return;
    }

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          subtotal,
          shipping: shippingBase,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        data?: { discount?: number; shippingDiscount?: number };
      };
      if (!res.ok || !payload.data) {
        setDiscount(0);
        setShippingDiscount(0);
        alert(payload.error ?? 'Invalid or expired coupon code.');
        return;
      }

      setCouponCode(code);
      setDiscount(Number(payload.data.discount ?? 0));
      setShippingDiscount(Number(payload.data.shippingDiscount ?? 0));
    } catch {
      setDiscount(0);
      setShippingDiscount(0);
      alert('Unable to validate coupon right now.');
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-20 text-center">
        <ShoppingBag className="w-20 h-20 text-neutral-200 mx-auto mb-6" />
        <h1 className="text-2xl font-semibold mb-3 font-[family-name:var(--font-display)]">Your cart is empty</h1>
        <p className="text-neutral-500 mb-8">Add some products to get started</p>
        <Link href="/products" className="inline-flex items-center gap-2 h-12 px-8 bg-green-700 text-white rounded-full text-sm font-semibold hover:bg-green-800 transition-colors">
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold font-[family-name:var(--font-display)]">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-neutral-400 hover:text-neutral-700 transition-colors">Clear all</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = (item.product.sale_price ?? item.product.price) + (item.variant?.price_modifier ?? 0);
            return (
              <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 p-4 bg-white border border-neutral-100 rounded-2xl">
                <div className="w-24 h-24 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
                  <CartProductImage image={item.product.image} name={item.product.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link href={`/products/${item.product.slug}`} className="font-semibold text-sm hover:text-green-700 transition-colors">{item.product.name}</Link>
                      {item.variant && <p className="text-xs text-neutral-500 mt-0.5">{item.variant.name}</p>}
                    </div>
                    <button onClick={() => removeItem(item.productId, item.variantId)} className="text-neutral-300 hover:text-red-500 transition-colors shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 border border-neutral-200 rounded-lg">
                      <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-neutral-900">{formatPrice(price * item.quantity)}</span>
                      {item.quantity > 1 && <p className="text-xs text-neutral-400">{formatPrice(price)} each</p>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <Link href="/products" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mt-2">
            ← Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-50 rounded-2xl p-6 sticky top-24">
            <h2 className="font-semibold mb-6">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2">Coupon Code</label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center border border-neutral-200 bg-white rounded-lg px-3 gap-2">
                  <Tag className="w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="WELCOME10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 py-2 text-sm outline-none bg-transparent"
                  />
                </div>
                <button onClick={applyCoupon} className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors">Apply</button>
              </div>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              {shippingDiscount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Shipping Discount</span>
                  <span>-{formatPrice(shippingDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className={shipping === 0 ? 'text-green-700 font-medium' : 'font-medium'}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-neutral-400">Add {formatPrice(2000 - subtotal)} more for free shipping</p>
              )}
              <div className="flex justify-between font-bold text-base pt-3 border-t border-neutral-200">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full h-12 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors text-sm"
            >
              Checkout — {formatPrice(total)}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-center text-xs text-neutral-400 mt-3 flex items-center justify-center gap-1">
              <span className="font-bold text-green-700">S</span> Secure order checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
