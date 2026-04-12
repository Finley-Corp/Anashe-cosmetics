"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { generateOrderId, ORDER_STORAGE_KEY } from "@/lib/order";

type ShippingMethod = "standard" | "express";

const SHIPPING_COST: Record<ShippingMethod, number> = {
  standard: 45,
  express: 120,
};

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, clearCart, isReady } = useCart();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState<ShippingMethod>("standard");
  const [email, setEmail] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  useEffect(() => {
    if (!isReady) return;
    if (lines.length === 0) {
      router.replace("/cart");
    }
  }, [isReady, lines.length, router]);

  const discountAmount = useMemo(() => {
    if (appliedDiscount <= 0) return 0;
    return Math.round(subtotal * (appliedDiscount / 100) * 100) / 100;
  }, [appliedDiscount, subtotal]);

  const shippingCost = SHIPPING_COST[shipping];
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyDiscount = () => {
    const code = discountInput.trim().toUpperCase();
    if (code === "WELCOME10" || code === "ANASHE10") {
      setAppliedDiscount(10);
    } else if (code) {
      setAppliedDiscount(0);
      alert("That code is not valid. Try WELCOME10 for 10% off.");
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      const orderId = generateOrderId();
      const payload = {
        orderId,
        email: email.trim() || "your inbox",
        total,
        subtotal,
        shipping: shippingCost,
        discount: discountAmount,
        placedAt: new Date().toISOString(),
        itemCount: lines.reduce((s, l) => s + l.quantity, 0),
      };
      try {
        sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(payload));
      } catch {
        /* ignore */
      }
      clearCart();
      router.push(`/checkout/success?order=${encodeURIComponent(orderId)}`);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.push("/cart");
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400 text-sm">
        Loading…
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400 text-sm">
        Redirecting to cart…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-100 py-8">
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-medium tracking-tighter">
            ANASHE
          </Link>
          <Link href="/cart" className="text-neutral-400 hover:text-black transition-colors">
            <Icon icon="lucide:shopping-bag" width="24"></Icon>
          </Link>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-0 min-h-[calc(100vh-100px)]">
        <div className="lg:col-span-7 py-12 lg:py-20 lg:pr-20 reveal">
          <nav className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-12">
            <Link href="/cart" className="hover:text-black transition-colors">
              Cart
            </Link>
            <Icon icon="lucide:chevron-right" width="12"></Icon>
            <span className={step >= 1 ? "text-black" : ""}>Information</span>
            <Icon icon="lucide:chevron-right" width="12"></Icon>
            <span className={step >= 2 ? "text-black" : ""}>Shipping</span>
            <Icon icon="lucide:chevron-right" width="12"></Icon>
            <span className={step >= 3 ? "text-black" : ""}>Payment</span>
          </nav>

          <form
            className="space-y-12"
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
          >
            {step === 1 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium tracking-tight">Contact Information</h2>
                    <p className="text-sm font-medium">
                      Already have an account?{" "}
                      <Link href="/account-dashboard" className="border-b border-black">
                        Log in
                      </Link>
                    </p>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full h-14 bg-neutral-50 border border-neutral-100 rounded-xl px-6 outline-none focus:border-black transition-all font-medium"
                  />
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black" />
                    <span className="text-sm text-neutral-500 group-hover:text-black transition-colors">
                      Keep me updated on new drops and exclusive offers
                    </span>
                  </label>
                </section>

                <section className="space-y-6">
                  <h2 className="text-xl font-medium tracking-tight">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First name"
                      className="w-full h-14 bg-neutral-50 border border-neutral-100 rounded-xl px-6 outline-none focus:border-black transition-all font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      className="w-full h-14 bg-neutral-50 border border-neutral-100 rounded-xl px-6 outline-none focus:border-black transition-all font-medium"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full h-14 bg-neutral-50 border border-neutral-100 rounded-xl px-6 outline-none focus:border-black transition-all font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full h-14 bg-neutral-50 border border-neutral-100 rounded-xl px-6 outline-none focus:border-black transition-all font-medium"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full h-14 bg-neutral-50 border border-neutral-100 rounded-xl px-6 outline-none focus:border-black transition-all font-medium"
                    />
                    <select className="col-span-1 h-14 bg-neutral-50 border border-neutral-100 rounded-xl px-6 outline-none focus:border-black transition-all font-medium appearance-none">
                      <option>Country</option>
                      <option>Kenya</option>
                      <option>United Kingdom</option>
                      <option>United States</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Postal code"
                      className="w-full h-14 bg-neutral-50 border border-neutral-100 rounded-xl px-6 outline-none focus:border-black transition-all font-medium"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    className="w-full h-14 bg-neutral-50 border border-neutral-100 rounded-xl px-6 outline-none focus:border-black transition-all font-medium"
                  />
                </section>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="space-y-6">
                  <h2 className="text-xl font-medium tracking-tight">Shipping Method</h2>
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setShipping("standard")}
                      className={`w-full p-6 rounded-xl flex items-center justify-between cursor-pointer text-left transition-all ${shipping === "standard" ? "bg-white border-2 border-black" : "bg-neutral-50 border border-neutral-100 hover:border-neutral-300"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-4 h-4 rounded-full ${shipping === "standard" ? "border-4 border-black" : "border border-neutral-300"}`}
                        ></div>
                        <div>
                          <p className="text-sm font-bold">Standard Shipping</p>
                          <p className="text-xs text-neutral-400">3-5 business days</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold tracking-tight">KSh {SHIPPING_COST.standard.toFixed(2)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShipping("express")}
                      className={`w-full p-6 rounded-xl flex items-center justify-between cursor-pointer text-left transition-all ${shipping === "express" ? "bg-white border-2 border-black" : "bg-neutral-50 border border-neutral-100 hover:border-neutral-300"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-4 h-4 rounded-full ${shipping === "express" ? "border-4 border-black" : "border border-neutral-300"}`}
                        ></div>
                        <div>
                          <p className="text-sm font-bold">Express Delivery</p>
                          <p className="text-xs text-neutral-400">1-2 business days</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold tracking-tight">KSh {SHIPPING_COST.express.toFixed(2)}</span>
                    </button>
                  </div>
                </section>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="space-y-6">
                  <h2 className="text-xl font-medium tracking-tight text-neutral-900">Payment</h2>
                  <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold">
                    Safe & Secure Mobile Money via M-Pesa
                  </p>

                  <div className="space-y-4">
                    <div className="bg-neutral-50 border border-neutral-100 rounded-[24px] overflow-hidden">
                      <div className="p-6 border-b border-neutral-100 bg-white flex items-center justify-between font-bold text-sm">
                        <div className="flex items-center gap-3">
                          <span className="w-12 h-8 rounded flex items-center justify-center overflow-hidden">
                            <img src="/Mpesa-Logo (1).webp" className="h-full object-contain" alt="M-Pesa" />
                          </span>
                          <span className="text-neutral-900">M-Pesa Mobile Money</span>
                        </div>
                        <div className="w-4 h-4 rounded-full border-4 border-black"></div>
                      </div>
                      <div className="p-8 space-y-6">
                        <p className="text-[13px] text-neutral-500 font-medium leading-relaxed">
                          Once you click &quot;Pay with M-Pesa&quot;, you will receive an STK Push notification on your
                          phone asking you to enter your M-Pesa PIN.
                        </p>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1">
                            M-Pesa Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="e.g. 0712 345 678"
                            className="w-full h-14 bg-white border border-neutral-100 rounded-xl px-6 outline-none focus:border-green-500 transition-all font-bold text-lg tracking-tight shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h2 className="text-xl font-medium tracking-tight">Billing Address</h2>
                  <div className="space-y-4">
                    <div className="p-6 bg-white border-2 border-black rounded-xl flex items-center gap-4 cursor-pointer">
                      <div className="w-4 h-4 rounded-full border-4 border-black"></div>
                      <span className="text-sm font-bold">Same as shipping address</span>
                    </div>
                    <div className="p-6 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center gap-4 cursor-pointer hover:border-neutral-300 transition-all">
                      <div className="w-4 h-4 rounded-full border border-neutral-300"></div>
                      <span className="text-sm font-bold">Use a different billing address</span>
                    </div>
                  </div>
                </section>
              </div>
            )}

            <div className="pt-12 border-t border-neutral-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors flex items-center gap-2"
              >
                <Icon icon="lucide:chevron-left" width="16"></Icon>
                {step === 1 ? "Return to Cart" : "Back"}
              </button>
              <button
                type="submit"
                className="bg-black text-white px-10 h-14 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
              >
                {step === 1 ? "Continue to Shipping" : step === 2 ? "Continue to Payment" : "Pay with M-Pesa"}
              </button>
            </div>
          </form>
        </div>

        <aside className="lg:col-span-5 bg-neutral-50/80 lg:border-l border-neutral-100 py-12 lg:py-20 px-6 lg:px-20 reveal delay-100 h-full">
          <div className="lg:sticky lg:top-10 space-y-10">
            <div className="space-y-6">
              {lines.map((item) => (
                <div key={item.lineId} className="flex gap-4 items-center">
                  <div className="relative w-20 h-20 bg-neutral-100 rounded-xl border border-neutral-100 flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-cover rounded-xl" alt={item.name} />
                    <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-neutral-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white z-20">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-neutral-900 truncate">{item.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5 truncate">
                      {item.variantLabel}
                    </p>
                  </div>
                  <span className="text-sm font-bold tabular-nums">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-6 border-t border-neutral-100">
              <input
                type="text"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                placeholder="Gift card or discount code"
                className="flex-1 h-12 bg-white border border-neutral-200 rounded-xl px-4 text-sm font-medium outline-none focus:border-black transition-all"
              />
              <button
                type="button"
                onClick={handleApplyDiscount}
                className="px-6 h-12 bg-neutral-200 text-neutral-600 text-[10px] font-bold rounded-xl uppercase tracking-widest hover:bg-black hover:text-white transition-all"
              >
                Apply
              </button>
            </div>
            {appliedDiscount > 0 && (
              <p className="text-xs text-green-700 font-medium">Applied {appliedDiscount}% off subtotal.</p>
            )}

            <div className="space-y-4 text-sm pt-6 border-t border-neutral-200">
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium tracking-tight text-neutral-900">Subtotal</span>
                <span className="font-bold">KSh {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span className="font-bold">− KSh {discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium tracking-tight text-neutral-900">Shipping</span>
                <span className="font-bold">KSh {shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium tracking-tight text-neutral-900">Estimated Taxes</span>
                <span className="font-bold text-neutral-400 tracking-tight">Included</span>
              </div>
              <div className="pt-8 border-t border-neutral-200 flex justify-between items-center">
                <div>
                  <h5 className="text-xl font-bold tracking-tight text-neutral-900 leading-none">Total</h5>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-2 px-0 bg-transparent">
                    Demo checkout — no real charge
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-neutral-400 mr-2">KSH</span>
                  <span className="text-[40px] font-bold tracking-tighter leading-none tabular-nums">
                    {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-10 flex items-center justify-center gap-6 opacity-40 scale-95">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Secured by</span>
              <img src="/Mpesa-Logo (1).webp" className="h-6 object-contain" alt="M-Pesa" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
