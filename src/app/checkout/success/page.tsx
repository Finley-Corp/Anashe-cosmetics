"use client";

import Link from "next/link";
import Icon from "@/components/Icon";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center reveal">
      <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-8 rotate-in scale-in duration-700">
        <Icon icon="lucide:check" width="48" className="text-white"></Icon>
      </div>
      
      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-4">Confirmed</span>
      <h1 className="text-4xl lg:text-5xl font-medium tracking-tighter mb-6">Thank you for your order.</h1>
      
      <p className="max-w-md text-neutral-500 text-sm leading-relaxed mb-12">
        Your order <span className="text-black font-bold">#AN-28491</span> has been placed successfully. 
        We've sent a confirmation email to <span className="text-black font-bold">jane@example.com</span> with your order details and tracking information.
      </p>

      <div className="space-y-4 w-full max-w-xs">
        <Link href="/" className="block">
          <button className="w-full h-14 bg-black text-white text-[11px] font-bold rounded-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10">
            Return to Home
          </button>
        </Link>
        <Link href="/account-dashboard" className="block">
          <button className="w-full h-14 bg-white border border-neutral-100 text-neutral-900 text-[11px] font-bold rounded-xl uppercase tracking-widest hover:bg-neutral-50 transition-all">
            Track Order
          </button>
        </Link>
      </div>

      <div className="mt-20 pt-10 border-t border-neutral-100 flex items-center gap-12 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
         <div className="flex flex-col items-center gap-2">
            <Icon icon="lucide:package" width="20"></Icon>
            <span>Arriving in 3-5 days</span>
         </div>
         <div className="flex flex-col items-center gap-2">
            <Icon icon="lucide:mail" width="20"></Icon>
            <span>Support via Email</span>
         </div>
      </div>
    </div>
  );
}
