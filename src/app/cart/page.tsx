"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { lines, subtotal, setLineQuantity, removeLine, isReady } = useCart();

  const shippingNote = subtotal > 0 ? "Calculated at checkout" : "—";
  const total = subtotal;

  if (!isReady) {
    return (
      <div className="pt-32 pb-24 min-h-[50vh] flex items-center justify-center text-neutral-400 text-sm">
        Loading cart…
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-6">
        <h1 className="text-4xl font-medium tracking-tighter mb-12 reveal">Your Cart</h1>

        {lines.length === 0 ? (
          <div className="max-w-lg reveal">
            <p className="text-neutral-500 mb-8 leading-relaxed">
              Your cart is empty. Browse the shop to add skincare and beauty essentials.
            </p>
            <Link
              href="/product-listing-page"
              className="inline-flex items-center gap-2 h-12 px-8 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-colors"
            >
              Shop collection
              <Icon icon="lucide:arrow-right" width="16"></Icon>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-8 space-y-8 reveal">
              {lines.map((item) => (
                <div key={item.lineId} className="flex gap-6 py-6 border-b border-neutral-100 items-center">
                  <Link
                    href="/product-listing-page"
                    className="w-24 h-32 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0 block"
                  >
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium truncate">{item.name}</h3>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">
                      {item.variantLabel}
                    </p>
                    <div className="flex items-center gap-4 mt-4 flex-wrap">
                      <div className="flex items-center gap-4 bg-neutral-100 px-3 py-1.5 rounded-lg text-xs font-bold">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setLineQuantity(item.lineId, item.quantity - 1)}
                        >
                          <Icon icon="lucide:minus" width="12"></Icon>
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setLineQuantity(item.lineId, item.quantity + 1)}
                        >
                          <Icon icon="lucide:plus" width="12"></Icon>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(item.lineId)}
                        className="text-xs font-bold text-neutral-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className="text-lg font-semibold tabular-nums shrink-0">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}

              <Link
                href="/product-listing-page"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors pt-8"
              >
                <Icon icon="lucide:arrow-left" width="16"></Icon> Continue Shopping
              </Link>
            </div>

            <div className="lg:col-span-4 bg-neutral-50 rounded-3xl p-10 reveal delay-100">
              <h3 className="text-xl font-medium tracking-tight mb-8">Order Summary</h3>
              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-semibold text-neutral-900">KSh {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="font-semibold text-neutral-900">{shippingNote}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Estimated Tax</span>
                  <span className="font-semibold text-neutral-900">KSh 0.00</span>
                </div>
                <div className="pt-4 border-t border-neutral-200 flex justify-between text-lg">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-neutral-900 tabular-nums">
                    KSh {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <Link href="/checkout">
                <button
                  type="button"
                  className="w-full h-14 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-900/10"
                >
                  Proceed to Checkout
                </button>
              </Link>
              <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale">
                <Icon icon="lucide:credit-card" width="24"></Icon>
                <Icon icon="lucide:wallet" width="24"></Icon>
                <Icon icon="lucide:shield-check" width="24"></Icon>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
