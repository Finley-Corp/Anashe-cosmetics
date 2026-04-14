'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2, Smartphone, MapPin, ShoppingBag, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/shared/Toaster';
import { formatPrice, isValidKenyanPhone, formatPhone } from '@/lib/utils';

type Step = 'address' | 'review' | 'payment' | 'waiting' | 'success';

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
  const [receipt, setReceipt] = useState<string>('');
  const [countdown, setCountdown] = useState(90);

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

  async function initiatePayment() {
    if (!isValidKenyanPhone(phone)) {
      showToast('Please enter a valid Kenyan phone number (e.g. 0712345678)', 'error');
      return;
    }
    setIsProcessing(true);
    setStep('waiting');

    let active = true;
    let count = 90;
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
        if (active) {
          setStep('review');
          setIsProcessing(false);
          showToast('Payment timed out. Please try again.', 'error');
        }
      }
    }, 1000);

    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          amount: total,
          couponCode: couponCode || undefined,
          shippingAddress: address,
          cartItems: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: (item.product.sale_price ?? item.product.price) + (item.variant?.price_modifier ?? 0),
          })),
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Failed to start payment');
      setOrderId(payload.orderId);

      const poll = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/orders/${payload.orderId}/status`, { cache: 'no-store' });
          const statusPayload = await statusRes.json();
          if (!statusRes.ok) return;
          const status = statusPayload?.data?.status;
          if (status === 'payment_confirmed') {
            clearInterval(poll);
            clearInterval(timer);
            active = false;
            setReceipt(statusPayload?.data?.mpesa_receipt ?? '');
            clearCart();
            setStep('success');
            setIsProcessing(false);
            return;
          }
          if (status === 'cancelled' || status === 'refunded') {
            clearInterval(poll);
            clearInterval(timer);
            active = false;
            setStep('review');
            setIsProcessing(false);
            showToast('Payment failed or cancelled.', 'error');
          }
        } catch {
          // keep polling
        }
      }, 3000);

      setTimeout(() => clearInterval(poll), 90000);
    } catch (err: unknown) {
      clearInterval(timer);
      active = false;
      setStep('payment');
      setIsProcessing(false);
      showToast(err instanceof Error ? err.message : 'Failed to initiate payment', 'error');
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
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
      <h1 className="text-2xl font-semibold mb-8 font-[family-name:var(--font-display)]">Checkout</h1>

      {/* Step Indicators */}
      {step !== 'waiting' && step !== 'success' && (
        <div className="flex items-center gap-2 mb-10">
          {(['address', 'review', 'payment'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s ? 'bg-green-700 text-white' : ['address', 'review', 'payment'].indexOf(step) > i ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-400'
              }`}>
                {['address', 'review', 'payment'].indexOf(step) > i ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium capitalize ${step === s ? 'text-neutral-900' : 'text-neutral-400'}`}>
                {s === 'address' ? 'Delivery' : s === 'review' ? 'Review' : 'Payment'}
              </span>
              {i < 2 && <div className="w-8 h-px bg-neutral-200" />}
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main steps */}
        <div className="lg:col-span-2">
          {/* STEP 1: Address */}
          {step === 'address' && (
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 space-y-5">
              <h2 className="font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-green-700" /> Delivery Address</h2>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">Street Address *</label>
                <input
                  type="text"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  placeholder="e.g. 123 Kimathi Street"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">City / Town *</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">County</label>
                  <select
                    value={address.county}
                    onChange={(e) => setAddress({ ...address, county: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 transition-colors bg-white"
                  >
                    <option value="">Select county</option>
                    {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Nyeri', 'Machakos', 'Kakamega'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={() => { if (!address.line1 || !address.city) { showToast('Please fill in all required fields', 'error'); return; } setStep('review'); }}
                className="w-full h-12 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors"
              >
                Continue to Review
              </button>
            </div>
          )}

          {/* STEP 2: Review */}
          {step === 'review' && (
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 space-y-5">
              <h2 className="font-semibold flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-green-700" /> Order Review</h2>
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
                <button onClick={applyCoupon} className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors">Apply</button>
              </div>

              <div className="space-y-2 text-sm border-t border-neutral-100 pt-4">
                <div className="flex justify-between"><span className="text-neutral-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between"><span className="text-neutral-600">Shipping</span><span className={shipping === 0 ? 'text-green-700' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-neutral-100"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('address')} className="flex-1 h-12 border border-neutral-200 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors">Back</button>
                <button onClick={() => setStep('payment')} className="flex-1 h-12 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors">Continue to Payment</button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 'payment' && (
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 space-y-5">
              <h2 className="font-semibold flex items-center gap-2"><Smartphone className="w-4 h-4 text-green-700" /> M-Pesa Payment</h2>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-sm font-medium text-green-800 mb-1">How it works</p>
                <ol className="text-xs text-green-700 space-y-1 list-decimal list-inside">
                  <li>Enter your M-Pesa registered phone number below</li>
                  <li>Click &ldquo;Pay Now&rdquo; — you&apos;ll receive an STK Push prompt</li>
                  <li>Enter your M-Pesa PIN to confirm payment</li>
                  <li>Your order is confirmed immediately</li>
                </ol>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1.5">M-Pesa Phone Number *</label>
                <div className="flex items-center border border-neutral-200 rounded-xl px-4 gap-3 focus-within:border-green-500 transition-colors">
                  <span className="text-sm font-medium text-neutral-500 shrink-0">🇰🇪 +254</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="712 345 678"
                    className="flex-1 py-3 text-sm outline-none"
                  />
                </div>
                <p className="text-xs text-neutral-400 mt-1">Enter the number registered with M-Pesa (e.g. 0712345678)</p>
              </div>

              <div className="bg-neutral-50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-sm text-neutral-600">Amount to pay</span>
                <span className="text-xl font-bold text-green-700">{formatPrice(total)}</span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('review')} className="flex-1 h-12 border border-neutral-200 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors">Back</button>
                <button
                  onClick={initiatePayment}
                  disabled={isProcessing}
                  className="flex-1 h-12 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-base font-bold">M</span>}
                  Pay {formatPrice(total)} via M-Pesa
                </button>
              </div>
            </div>
          )}

          {/* WAITING */}
          {step === 'waiting' && (
            <div className="bg-white border border-neutral-100 rounded-2xl p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-10 h-10 text-green-700 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2 font-[family-name:var(--font-display)]">Check your phone!</h2>
                <p className="text-neutral-500 text-sm">We sent an M-Pesa payment request to <strong>{phone}</strong>. Enter your PIN to complete payment.</p>
              </div>
              <div className="text-4xl font-bold text-green-700">{countdown}s</div>
              <p className="text-xs text-neutral-400">The payment request expires in {countdown} seconds</p>
              <button onClick={() => setStep('payment')} className="text-sm text-neutral-500 hover:text-neutral-700 underline">Cancel and go back</button>
            </div>
          )}

          {/* SUCCESS */}
          {step === 'success' && (
            <div className="bg-white border border-green-100 rounded-2xl p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2 font-[family-name:var(--font-display)]">Order Confirmed! 🎉</h2>
                <p className="text-neutral-500 text-sm">Your M-Pesa payment was received. Order <strong>{orderId}</strong> is being processed.</p>
              </div>
              <p className="text-xs text-neutral-400 bg-neutral-50 rounded-xl px-4 py-3">M-Pesa Receipt: <strong>{receipt || 'Pending confirmation'}</strong></p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/orders" className="h-11 px-6 bg-green-700 text-white rounded-full text-sm font-semibold flex items-center justify-center hover:bg-green-800 transition-colors">Track My Order</a>
                <a href="/products" className="h-11 px-6 border border-neutral-200 rounded-full text-sm font-semibold flex items-center justify-center hover:bg-neutral-50 transition-colors">Continue Shopping</a>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        {step !== 'waiting' && step !== 'success' && (
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 rounded-2xl p-6 sticky top-24">
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
                {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between"><span className="text-neutral-600">Shipping</span><span className={shipping === 0 ? 'text-green-700' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between font-bold pt-2 border-t border-neutral-200 text-base"><span>Total</span><span className="text-green-700">{formatPrice(total)}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
