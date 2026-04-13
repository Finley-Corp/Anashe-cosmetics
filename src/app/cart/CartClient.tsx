"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

type CartItem = {
  id: number;
  name: string;
  subtitle: string;
  color: string;
  price: number;
  qty: number;
  image: string;
};

const INITIAL_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "Linen Lounge Chair",
    subtitle: "Furniture",
    color: "Natural Oak",
    price: 890,
    qty: 1,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Orbital Lamp",
    subtitle: "Lighting",
    color: "Matte Black",
    price: 320,
    qty: 2,
    image: "https://images.unsplash.com/photo-1604610728890-6f4b631ed081?w=800&q=80",
  },
  {
    id: 3,
    name: "Sculpt Vase 02",
    subtitle: "Accessories",
    color: "Raw Clay",
    price: 140,
    qty: 1,
    image: "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?w=800&q=80",
  },
];

const SUGGESTED = [
  { id: 10, name: "Ceramic Tray", subtitle: "Stone White", price: 95, image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=800&auto=format&fit=crop" },
  { id: 11, name: "Woven Throw", subtitle: "Organic Merino", price: 180, image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80" },
  { id: 12, name: "Side Table", subtitle: "Walnut Finish", price: 450, image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=800&auto=format&fit=crop" },
];

const PERKS = [
  { icon: "lucide:truck", label: "Free shipping on orders over $500" },
  { icon: "lucide:shield-check", label: "5-year warranty on all items" },
  { icon: "lucide:refresh-ccw", label: "30-day hassle-free returns" },
];

export default function CartClient() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item)
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setRemovingId(null);
    }, 300);
  };

  const applyPromo = () => {
    if (promoCode.trim().toLowerCase() === "luma10") {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= 500 ? 0 : 35;
  const total = subtotal - discount + shipping;
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
          <Icon icon="lucide:shopping-bag" width={32} className="text-neutral-400" />
        </div>
        <h2 className="text-2xl font-medium tracking-tight mb-3">Your cart is empty</h2>
        <p className="text-sm text-neutral-500 mb-10 max-w-xs">
          Looks like you haven&apos;t added anything yet. Explore the collection to find your next favourite piece.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 h-12 px-8 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 hover:-translate-y-0.5 transition-all duration-300"
        >
          Browse Collection
          <Icon icon="lucide:arrow-right" width={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12 lg:py-16">

      {/* Header */}
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-neutral-100">
        <div>
          <h1 className="text-3xl lg:text-4xl font-medium tracking-tighter">Your Cart</h1>
          <p className="text-sm text-neutral-400 mt-1">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
        </div>
        <Link
          href="/shop"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <Icon icon="lucide:arrow-left" width={14} />
          Continue Shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">

        {/* Left — Cart Items */}
        <div className="space-y-0">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`flex gap-5 py-6 transition-all duration-300 ${
                i < items.length - 1 ? "border-b border-neutral-100" : ""
              } ${removingId === item.id ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
            >
              {/* Image */}
              <Link href="/shop" className="shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-100 relative group">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <Link href="/shop" className="text-sm font-semibold text-neutral-900 tracking-tight hover:text-neutral-600 transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-xs text-neutral-400 mt-0.5">{item.subtitle} · {item.color}</p>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900 shrink-0">
                    ${(item.price * item.qty).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-neutral-400 mb-4">${item.price.toLocaleString()} each</p>

                <div className="flex items-center justify-between">
                  {/* Qty stepper */}
                  <div className="flex items-center gap-0 border border-neutral-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Icon icon="lucide:minus" width={13} />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold text-neutral-900 select-none">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Icon icon="lucide:plus" width={13} />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Icon icon="lucide:trash-2" width={13} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Perks */}
          <div className="mt-8 pt-8 border-t border-neutral-100 grid sm:grid-cols-3 gap-4">
            {PERKS.map((p) => (
              <div key={p.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-600">
                  <Icon icon={p.icon} width={15} />
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">{p.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 lg:p-8">
            <h2 className="text-base font-semibold tracking-tight mb-6">Order Summary</h2>

            {/* Line items */}
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                <span className="font-medium text-neutral-900">${subtotal.toLocaleString()}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Icon icon="lucide:tag" width={13} /> Promo (LUMA10)
                  </span>
                  <span className="font-semibold">−${discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className={`font-medium ${shipping === 0 ? "text-green-600" : "text-neutral-900"}`}>
                  {shipping === 0 ? "Free" : `$${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[11px] text-neutral-400">
                  Add ${(500 - subtotal).toLocaleString()} more to unlock free shipping
                </p>
              )}
            </div>

            <div className="border-t border-neutral-200 pt-4 mb-6 flex justify-between items-baseline">
              <span className="text-sm font-semibold text-neutral-900">Total</span>
              <div className="text-right">
                <span className="text-xl font-semibold tracking-tight text-neutral-900">
                  ${total.toLocaleString()}
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">Incl. taxes where applicable</p>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
                Promo Code
              </label>
              {promoApplied ? (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl">
                  <Icon icon="lucide:check-circle" width={15} className="text-green-600 shrink-0" />
                  <span className="text-xs font-semibold text-green-700">LUMA10 applied — 10% off!</span>
                  <button
                    onClick={() => { setPromoApplied(false); setPromoCode(""); }}
                    className="ml-auto text-green-600 hover:text-green-800 transition-colors"
                  >
                    <Icon icon="lucide:x" width={13} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(false); }}
                    placeholder="e.g. LUMA10"
                    className={`flex-1 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-white placeholder:text-neutral-400 ${
                      promoError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-neutral-200 focus:border-neutral-400 focus:ring-neutral-100"
                    } focus:ring-2`}
                  />
                  <button
                    onClick={applyPromo}
                    className="shrink-0 px-4 py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoError && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <Icon icon="lucide:alert-circle" width={12} /> Invalid promo code. Try LUMA10.
                </p>
              )}
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full h-12 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neutral-900/10 transition-all duration-200 active:translate-y-0"
            >
              Proceed to Checkout
              <Icon icon="lucide:arrow-right" width={16} />
            </Link>

            {/* Trust badges */}
            <div className="mt-5 flex items-center justify-center gap-4 text-neutral-400">
              <div className="flex items-center gap-1.5 text-[11px] font-medium">
                <Icon icon="lucide:lock" width={12} />
                Secure checkout
              </div>
              <span className="w-px h-3 bg-neutral-200" />
              <div className="flex items-center gap-1.5 text-[11px] font-medium">
                <Icon icon="lucide:credit-card" width={12} />
                All major cards
              </div>
            </div>

            {/* Payment icons */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {["lucide:credit-card", "lucide:banknote", "lucide:wallet"].map((icon) => (
                <div key={icon} className="h-7 px-3 bg-white border border-neutral-200 rounded-md flex items-center justify-center text-neutral-400">
                  <Icon icon={icon} width={14} />
                </div>
              ))}
              <div className="h-7 px-3 bg-white border border-neutral-200 rounded-md flex items-center justify-center text-neutral-400 text-[10px] font-bold tracking-tight">
                M-PESA
              </div>
            </div>
          </div>

          {/* Back to shop */}
          <Link
            href="/shop"
            className="flex items-center justify-center gap-1.5 w-full py-3 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <Icon icon="lucide:arrow-left" width={13} />
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* You May Also Like */}
      <div className="mt-20 pt-16 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-medium tracking-tight">You may also like</h2>
          <Link href="/shop" className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1">
            View all <Icon icon="lucide:arrow-right" width={13} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SUGGESTED.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-3 relative border border-neutral-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-3 left-3 right-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  <button className="w-full h-9 bg-white/95 backdrop-blur text-neutral-900 text-xs font-bold rounded-lg shadow-lg hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-1.5">
                    <Icon icon="lucide:plus" width={13} /> Add to Cart
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">{product.name}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{product.subtitle}</p>
                </div>
                <span className="text-sm font-semibold text-neutral-900">${product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
