"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Landmark, ShoppingBag } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartItem, CART_UPDATED_EVENT, clearCart, readCart } from "@/lib/cart";

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  county: string;
  city: string;
  address: string;
  agree: boolean;
};

const initialForm: CheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  county: "",
  city: "",
  address: "",
  agree: false,
};

function formatKsh(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const syncCart = () => setItems(readCart());
    syncCart();

    window.addEventListener("storage", syncCart);
    window.addEventListener(CART_UPDATED_EVENT, syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const shippingFee = items.length > 0 ? 900 : 0;
  const total = subtotal + shippingFee;

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!form.county.trim()) nextErrors.county = "County is required.";
    if (!form.city.trim()) nextErrors.city = "City is required.";
    if (!form.address.trim()) nextErrors.address = "Delivery address is required.";
    if (!form.agree) nextErrors.agree = "You must accept the terms to continue.";
    if (items.length === 0) nextErrors.cart = "Your cart is empty.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    clearCart();
    setItems([]);
    setForm(initialForm);
    setIsSubmitting(false);
    setOrderPlaced(true);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-neutral-950 text-white">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/10 via-neutral-950/0 to-transparent" />
      </div>

      <section className="relative border-b border-white/10">
        <Header />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pb-12 pt-6 sm:pb-16 sm:pt-10">
          <p className="uppercase tracking-[0.18em] text-xs text-white/60 font-sans">Secure Checkout</p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bricolage font-semibold tracking-tighter leading-[1.05] max-w-3xl">
            Checkout
          </h1>
          <p className="mt-4 max-w-2xl text-white/80 font-sans text-base sm:text-lg">
            Complete your order details and choose a payment method.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-12 sm:py-16">
        {orderPlaced ? (
          <div className="border-gradient before:rounded-3xl rounded-3xl bg-white/[0.03] p-8 sm:p-10 text-center" style={{ backdropFilter: "blur(6px) saturate(1.1)" }}>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-300/15 border border-emerald-200/30">
              <CheckCircle2 className="h-7 w-7 text-emerald-200" />
            </div>
            <h2 className="mt-5 text-3xl font-bricolage font-semibold tracking-tight">Order placed successfully</h2>
            <p className="mt-3 text-white/75 font-sans max-w-xl mx-auto">
              Thank you for your purchase. A confirmation message will be sent to your contact details shortly.
            </p>
            <div className="mt-7 flex justify-center gap-3">
              <Link href="/shop" className="inline-flex items-center gap-2 rounded-2xl bg-white text-neutral-900 px-5 py-3 text-sm font-medium hover:bg-white/90 transition font-sans">
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/" className="inline-flex items-center justify-center rounded-2xl border-gradient before:rounded-2xl bg-white/5 px-5 py-3 text-sm font-medium text-white/90 hover:bg-white/10 transition font-sans">
                Back Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form
              onSubmit={handlePlaceOrder}
              className="lg:col-span-2 border-gradient before:rounded-3xl rounded-3xl bg-white/[0.03] p-6 sm:p-8"
              style={{ backdropFilter: "blur(6px) saturate(1.1)" }}
            >
              <h2 className="text-2xl font-bricolage font-semibold tracking-tight">Delivery Details</h2>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-sm text-white/75 font-sans">Full Name</span>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="w-full rounded-2xl bg-white/5 text-white px-4 py-3 text-sm border border-white/10 focus:ring-2 focus:ring-emerald-300/30 outline-none"
                    placeholder="Jane Doe"
                  />
                  {errors.fullName ? <span className="text-xs text-red-300">{errors.fullName}</span> : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-white/75 font-sans">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-2xl bg-white/5 text-white px-4 py-3 text-sm border border-white/10 focus:ring-2 focus:ring-emerald-300/30 outline-none"
                    placeholder="jane@email.com"
                  />
                  {errors.email ? <span className="text-xs text-red-300">{errors.email}</span> : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-white/75 font-sans">Phone Number</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full rounded-2xl bg-white/5 text-white px-4 py-3 text-sm border border-white/10 focus:ring-2 focus:ring-emerald-300/30 outline-none"
                    placeholder="07xx xxx xxx"
                  />
                  {errors.phone ? <span className="text-xs text-red-300">{errors.phone}</span> : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-white/75 font-sans">County</span>
                  <input
                    value={form.county}
                    onChange={(e) => setForm((prev) => ({ ...prev, county: e.target.value }))}
                    className="w-full rounded-2xl bg-white/5 text-white px-4 py-3 text-sm border border-white/10 focus:ring-2 focus:ring-emerald-300/30 outline-none"
                    placeholder="Nairobi"
                  />
                  {errors.county ? <span className="text-xs text-red-300">{errors.county}</span> : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-white/75 font-sans">City / Town</span>
                  <input
                    value={form.city}
                    onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                    className="w-full rounded-2xl bg-white/5 text-white px-4 py-3 text-sm border border-white/10 focus:ring-2 focus:ring-emerald-300/30 outline-none"
                    placeholder="Westlands"
                  />
                  {errors.city ? <span className="text-xs text-red-300">{errors.city}</span> : null}
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm text-white/75 font-sans">Delivery Address</span>
                  <textarea
                    rows={4}
                    value={form.address}
                    onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full rounded-2xl bg-white/5 text-white px-4 py-3 text-sm border border-white/10 focus:ring-2 focus:ring-emerald-300/30 outline-none"
                    placeholder="Apartment, street, landmark"
                  />
                  {errors.address ? <span className="text-xs text-red-300">{errors.address}</span> : null}
                </label>
              </div>

              <h3 className="mt-8 text-xl font-bricolage font-semibold tracking-tight">Payment Method</h3>
              <div className="mt-4">
                <div className="rounded-2xl border border-emerald-300 bg-emerald-300/10 px-4 py-3 text-sm text-left text-white">
                  <Landmark className="h-4 w-4 mb-2" />
                  M-Pesa
                  <p className="mt-1 text-xs text-emerald-100/90 font-sans">
                    Payment prompt will be sent to the phone number you provide at checkout.
                  </p>
                </div>
              </div>

              <label className="mt-6 inline-flex items-start gap-2 text-sm text-white/75 font-sans">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => setForm((prev) => ({ ...prev, agree: e.target.checked }))}
                  className="mt-1"
                />
                <span>I confirm my details are correct and I agree to ANASHE checkout terms.</span>
              </label>
              {errors.agree ? <p className="text-xs text-red-300 mt-2">{errors.agree}</p> : null}
              {errors.cart ? <p className="text-xs text-red-300 mt-2">{errors.cart}</p> : null}

              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-neutral-900 px-4 py-3 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 font-sans"
              >
                <ShoppingBag className="h-4 w-4" />
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>

            <aside className="h-fit lg:sticky lg:top-8 border-gradient before:rounded-3xl rounded-3xl bg-white/[0.03] p-6" style={{ backdropFilter: "blur(6px) saturate(1.1)" }}>
              <h3 className="text-2xl font-bricolage font-semibold tracking-tight">Order Summary</h3>

              {items.length === 0 ? (
                <p className="mt-4 text-sm text-white/70 font-sans">No items in cart.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {items.map((item) => (
                    <div key={`${item.slug}-${item.size}`} className="flex items-start gap-3">
                      <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover border border-white/10" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white font-sans">{item.name}</p>
                        <p className="text-xs text-white/60 font-sans">{item.size} x {item.quantity}</p>
                      </div>
                      <p className="text-sm text-white/90 font-sans">{formatKsh(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 space-y-3 text-sm font-sans">
                <div className="flex items-center justify-between text-white/80">
                  <span>Subtotal</span>
                  <span>{formatKsh(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <span>Shipping</span>
                  <span>{formatKsh(shippingFee)}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex items-center justify-between text-base font-medium text-white">
                  <span>Total</span>
                  <span>{formatKsh(total)}</span>
                </div>
              </div>

              <Link href="/cart" className="mt-5 w-full inline-flex items-center justify-center rounded-2xl border-gradient before:rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10 transition font-sans" style={{ backdropFilter: "blur(4px) saturate(1.25)" }}>
                Back to Cart
              </Link>
            </aside>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
