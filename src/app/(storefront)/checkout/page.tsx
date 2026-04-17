'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/shared/Toaster';
import { formatPrice, isValidKenyanPhone } from '@/lib/utils';

type Step = 'form' | 'success';

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { add: showToast } = useToast();
  const router = useRouter();

  const [step, setStep] = useState<Step>('form');
  const [contact, setContact] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [county, setCounty] = useState('');
  const [phone, setPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shippingDiscount, setShippingDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');

  const subtotal = getSubtotal();
  const shippingBase = subtotal >= 2000 ? 0 : 250;
  const shipping = Math.max(0, shippingBase - shippingDiscount);
  const total = subtotal - discount + shipping;

  async function applyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      showToast('Enter a coupon code first', 'error');
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
        showToast(payload.error ?? 'Invalid or expired coupon code', 'error');
        return;
      }

      setCouponCode(code);
      setDiscount(Number(payload.data.discount ?? 0));
      setShippingDiscount(Number(payload.data.shippingDiscount ?? 0));
      showToast('Coupon applied successfully');
    } catch {
      setDiscount(0);
      setShippingDiscount(0);
      showToast('Unable to validate coupon right now', 'error');
    }
  }

  async function placeOrder() {
    if (!contact || !firstName || !lastName || !address || !city || !phone) {
      showToast('Please fill out all required fields', 'error');
      return;
    }
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
          shippingAddress: {
            line1: `${address}${apartment ? `, ${apartment}` : ''}`,
            city,
            county: county || null,
            country: 'Kenya',
          },
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
      if (!payload.smsSent) {
        showToast(
          payload.smsSkipped
            ? 'Order placed, but SMS is not configured yet.'
            : 'Order placed, but SMS delivery failed.',
          'info'
        );
      }
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
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
      {step === 'success' ? (
        <div className="bg-white border border-pink-100 rounded-2xl p-8 md:p-10 text-center space-y-6 max-w-2xl mx-auto shadow-[0_10px_30px_-24px_rgba(0,0,0,0.4)]">
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
      ) : (
        <div className="grid lg:grid-cols-[1.35fr_0.95fr] gap-10 items-start">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 space-y-7">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-display)] text-[var(--text-primary)]">
                Checkout
              </h1>
              <Link href="/cart" className="text-[11px] tracking-[0.15em] uppercase text-neutral-500 hover:text-neutral-800">
                Return to cart
              </Link>
            </div>

            <section className="space-y-3">
              <h2 className="text-xs tracking-[0.16em] uppercase font-semibold text-neutral-700">Contact</h2>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email or mobile phone number *"
                className="w-full border border-neutral-300 rounded-none px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
              />
            </section>

            <section className="space-y-3">
              <h2 className="text-xs tracking-[0.16em] uppercase font-semibold text-neutral-700">Delivery</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name *"
                  className="w-full border border-neutral-300 rounded-none px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name *"
                  className="w-full border border-neutral-300 rounded-none px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
                />
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address *"
                className="w-full border border-neutral-300 rounded-none px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
              />
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder="Apartment, suite, etc. (optional)"
                className="w-full border border-neutral-300 rounded-none px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
              />
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City *"
                  className="w-full border border-neutral-300 rounded-none px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
                />
                <input
                  type="text"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  placeholder="County"
                  className="w-full border border-neutral-300 rounded-none px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
                />
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Postal code"
                  className="w-full border border-neutral-300 rounded-none px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
                />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone (e.g. 0712345678) *"
                className="w-full border border-neutral-300 rounded-none px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
              />
            </section>

            <section className="space-y-3">
              <h2 className="text-xs tracking-[0.16em] uppercase font-semibold text-neutral-700">Shipping Method</h2>
              <div className="border border-neutral-300 rounded-none px-3 py-3 flex items-center justify-between text-sm">
                <span>Standard Shipping (3-5 Business Days)</span>
                <span className="font-medium">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
            </section>

            <button
              onClick={placeOrder}
              disabled={isProcessing}
              className="w-full h-12 bg-black text-white text-xs tracking-[0.18em] uppercase font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
              Place Order
            </button>
          </div>

          <aside className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-7 space-y-5">
            <div className="space-y-3 border-b border-neutral-200 pb-4">
              {items.map((item) => {
                const unitPrice = (item.product.sale_price ?? item.product.price) + (item.variant?.price_modifier ?? 0);
                return (
                  <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-start gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item.product.name}</p>
                      {item.variant && <p className="text-xs text-neutral-500">{item.variant.name}</p>}
                      <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold shrink-0">{formatPrice(unitPrice * item.quantity)}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 border border-neutral-300 rounded-none px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
              />
              <button
                onClick={applyCoupon}
                className="px-4 bg-neutral-100 border border-neutral-300 text-[11px] tracking-[0.15em] uppercase font-semibold hover:bg-neutral-200 transition-colors"
              >
                Apply
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[var(--primary)]">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              {shippingDiscount > 0 && (
                <div className="flex justify-between text-[var(--primary)]">
                  <span>Shipping Discount</span>
                  <span>-{formatPrice(shippingDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-neutral-200 pt-3 mt-2 font-bold text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
