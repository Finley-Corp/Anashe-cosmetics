"use client";

import Link from "next/link";
import Icon from "@/components/Icon";

export default function CartPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-6">
        <h1 className="text-4xl font-medium tracking-tighter mb-12 reveal">Your Cart</h1>
        
        <div className="grid lg:grid-cols-12 gap-16 items-start">
           {/* Cart Items */}
           <div className="lg:col-span-8 space-y-8 reveal">
              {[
                { name: "Linen Lounge Chair", price: 890, color: "Oatmeal", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1964" },
                { name: "Orbital Lamp", price: 320, color: "Matte Black", img: "https://images.unsplash.com/photo-1604610728890-6f4b631ed081?w=800&q=80" }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 py-6 border-b border-neutral-100 items-center">
                   <div className="w-24 h-32 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                   </div>
                   <div className="flex-1">
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">{item.color}</p>
                      <div className="flex items-center gap-4 mt-4">
                         <div className="flex items-center gap-4 bg-neutral-100 px-3 py-1.5 rounded-lg text-xs font-bold">
                            <button><Icon icon="lucide:minus" width="12"></Icon></button>
                            <span>1</span>
                            <button><Icon icon="lucide:plus" width="12"></Icon></button>
                         </div>
                         <button className="text-xs font-bold text-neutral-400 hover:text-red-500 transition-colors uppercase tracking-widest">Remove</button>
                      </div>
                   </div>
                   <span className="text-lg font-semibold">KSh {item.price}</span>
                </div>
              ))}

              <Link href="/product-listing-page" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors pt-8">
                 <Icon icon="lucide:arrow-left" width="16"></Icon> Continue Shopping
              </Link>
           </div>

           {/* Summary */}
           <div className="lg:col-span-4 bg-neutral-50 rounded-3xl p-10 reveal delay-100">
              <h3 className="text-xl font-medium tracking-tight mb-8">Order Summary</h3>
              <div className="space-y-4 text-sm mb-8">
                 <div className="flex justify-between">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="font-semibold text-neutral-900">KSh 1,210.00</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-neutral-500">Shipping</span>
                    <span className="font-semibold text-neutral-900">Calculated at checkout</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-neutral-500">Estimated Tax</span>
                    <span className="font-semibold text-neutral-900">KSh 0.00</span>
                 </div>
                 <div className="pt-4 border-t border-neutral-200 flex justify-between text-lg">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-neutral-900">KSh 1,210.00</span>
                 </div>
              </div>
              <Link href="/checkout">
                <button className="w-full h-14 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-900/10">
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
      </div>
    </div>
  );
}
