'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2, MapPin, ShoppingBag, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/shared/Toaster';
import { formatPrice, isValidKenyanPhone } from '@/lib/utils';

type Step = 'address' | 'review' | 'success';

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { add: showToast } = useToast();
  const router = useRouter();

  const [step, setStep] = useState<Step>('address');
  const [address, setAddress] = useState({ line1: '', city: 'Nairobi', county: '', country: 'Kenya' });
  const [phone, setPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');

  const subtotal = getSubtotal();
  const shipping = subtotal >= 2000 ? 0 : 250;
  const total = subtotal - discount + shipping;

  function applyCoupon() {
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setDiscount(Math.round(subtotal * 0.1));
      showToast('Coupon applied — 10% off!');
    } else if (couponCode.toUpperCase() === 'SAVE200' && subtotal >= 1000) {
      setDiscount(200);
      showToast('Coupon applied — KES 200 off!');
    } else {
      showToast('Invalid or expired coupon code', 'error');
    }
  }

  async function placeOrder() {
    if (!isValidKenyanPhone(phone)) {
      showToast('Please enter a valid Kenyan phone number (e.g. 0712345678)', 'error');
      return;
    }
    setIsProcessing(true);

    try {
      const res = await fetch('/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          couponCode: couponCode || undefined,
          shippingAddress: address,
          cartItems: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Failed to place order');
      setOrderId(payload.orderId);
      setOrderNumber(payload.orderNumber ?? '');
      clearCart();
      setStep('success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to place order', 'error');
    } finally {
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    if (items.length === 0 && step !== 'success') {
      router.replace('/cart');
    }
  }, [items.length, step, router]);

  if (items.length === 0 && step !== 'success') {
    return null;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-12">
      <div className="mb-8 md:mb-10">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--primary)] font-semibold mb-2">Secure Checkout</p>
        <h1 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-display)] text-[var(--text-primary)]">
          Complete your order
        </h1>
      </div>

      {/* Step Indicators */}
      {step !== 'success' && (
        <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-10 overflow-x-auto pb-1">
          {(['address', 'review'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s ? 'bg-[var(--primary)] text-white' : ['address', 'review'].indexOf(step) > i ? 'bg-[var(--accent)] text-[var(--primary)]' : 'bg-neutral-100 text-neutral-400'
              }`}>
                {['address', 'review'].indexOf(step) > i ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium capitalize ${step === s ? 'text-[var(--text-primary)]' : 'text-neutral-400'}`}>
                {s === 'address' ? 'Delivery' : 'Review'}
              </span>
              {i < 1 && <div className="w-8 md:w-12 h-px bg-neutral-200" />}
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main steps */}
        <div className="lg:col-span-2">
          {/* STEP 1: Address */}
          {step === 'address' && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-7 space-y-5 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.4)]">
              <h2 className="font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-[var(--primary)]" /> Delivery Address</h2>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">Street Address *</label>
                <input
                  type="text"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  placeholder="e.g. 123 Kimathi Street"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">City / Town *</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">County</label>
                  <select
                    value={address.county}
                    onChange={(e) => setAddress({ ...address, county: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)] transition-colors bg-white"
                  >
                    <option value="">Select county</option>
                    {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Nyeri', 'Machakos', 'Kakamega'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0712345678"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
              <button
                onClick={() => {
                  if (!address.line1 || !address.city || !phone) {
                    showToast('Please fill in all required fields', 'error');
                    return;
                  }
                  if (!isValidKenyanPhone(phone)) {
                    showToast('Please enter a valid Kenyan phone number (e.g. 0712345678)', 'error');
                    return;
                  }
                  setStep('review');
                }}
                className="w-full h-12 bg-[var(--primary)] text-white font-semibold rounded-xl hover:bg-[var(--primary-hover)] transition-colors"
              >
                Continue to Review
              </button>
            </div>
          )}

          {/* STEP 2: Review */}
          {step === 'review' && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-7 space-y-5 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.4)]">
              <h2 className="font-semibold flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-[var(--primary)]" /> Order Review</h2>
              <div className="space-y-3">
                {items.map((item) => {
                  const price = (item.product.sale_price ?? item.product.price) + (item.variant?.price_modifier ?? 0);
                  return (
                    <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-center py-2 border-b border-neutral-50">
                      <div>
                        <p className="text-sm font-medium">{item.product.name}</p>
                        {item.variant && <p className="text-xs text-neutral-500">{item.variant.name}</p>}
                        <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-sm">{formatPrice(price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Coupon */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center border border-neutral-200 rounded-xl px-3 gap-2">
                  <Tag className="w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Coupon code (WELCOME10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 py-2.5 text-sm outline-none"
                  />
                </div>
                <button onClick={applyCoupon} className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl hover:bg-[var(--primary-hover)] transition-colors">Apply</button>
              </div>

              <div className="space-y-2 text-sm border-t border-neutral-100 pt-4">
                <div className="flex justify-between"><span className="text-neutral-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-[var(--primary)]"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between"><span className="text-neutral-600">Shipping</span><span className={shipping === 0 ? 'text-[var(--primary)]' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-neutral-100"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('address')} className="flex-1 h-12 border border-neutral-200 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors">Back</button>
                <button
                  onClick={placeOrder}
                  disabled={isProcessing}
                  className="flex-1 h-12 bg-[var(--primary)] text-white font-semibold rounded-xl hover:bg-[var(--primary-hover)] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                  Place Order
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {step === 'success' && (
            <div className="bg-white border border-pink-100 rounded-2xl p-8 md:p-10 text-center space-y-6 max-w-2xl shadow-[0_10px_30px_-24px_rgba(0,0,0,0.4)]">
              <div className="w-20 h-20 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2 font-[family-name:var(--font-display)]">Order Confirmed! 🎉</h2>
                <p className="text-neutral-500 text-sm">Your order has been placed successfully and is now being prepared.</p>
              </div>
              <p className="text-xs text-neutral-400 bg-neutral-50 rounded-xl px-4 py-3">
                Order Reference: <strong>{orderNumber || orderId}</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/orders" className="h-11 px-6 bg-[var(--primary)] text-white rounded-full text-sm font-semibold flex items-center justify-center hover:bg-[var(--primary-hover)] transition-colors">Track My Order</Link>
                <Link href="/products" className="h-11 px-6 border border-neutral-200 rounded-full text-sm font-semibold flex items-center justify-center hover:bg-neutral-50 transition-colors">Continue Shopping</Link>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        {step !== 'success' && (
          <div className="lg:col-span-1">
            <div className="bg-[var(--accent)] rounded-2xl p-6 sticky top-24 border border-pink-100">
              <h2 className="font-semibold mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {items.slice(0, 3).map((item) => {
                  const price = (item.product.sale_price ?? item.product.price) + (item.variant?.price_modifier ?? 0);
                  return (
                    <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
                      <span className="text-neutral-600 truncate mr-2">{item.product.name} ×{item.quantity}</span>
                      <span className="font-medium shrink-0">{formatPrice(price * item.quantity)}</span>
                    </div>
                  );
                })}
                {items.length > 3 && <p className="text-xs text-neutral-400">+{items.length - 3} more items</p>}
              </div>
              <div className="border-t border-neutral-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-neutral-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-[var(--primary)]"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between"><span className="text-neutral-600">Shipping</span><span className={shipping === 0 ? 'text-[var(--primary)]' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between font-bold pt-2 border-t border-neutral-200 text-base"><span>Total</span><span className="text-[var(--primary)]">{formatPrice(total)}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
