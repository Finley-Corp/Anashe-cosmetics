"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ORDER_STORAGE_KEY } from "@/lib/order";

type LastOrder = {
  orderId: string;
  email: string;
  total: number;
  placedAt: string;
};

function SuccessInner() {
  const searchParams = useSearchParams();
  const orderFromUrl = searchParams.get("order");
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ORDER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LastOrder;
        setOrder(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const orderId = order?.orderId ?? orderFromUrl ?? "—";
  const emailDisplay =
    order?.email && order.email.includes("@") ? order.email : "the address you provided";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center reveal">
      <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-8 rotate-in scale-in duration-700">
        <Icon icon="lucide:check" width="48" className="text-white"></Icon>
      </div>

      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-4">Confirmed</span>
      <h1 className="text-4xl lg:text-5xl font-medium tracking-tighter mb-6">Thank you for your order.</h1>

      <p className="max-w-md text-neutral-500 text-sm leading-relaxed mb-12">
        Your order <span className="text-black font-bold">#{orderId}</span> has been placed successfully.
        {order && (
          <>
            {" "}
            Total: <span className="text-black font-bold">KSh {order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>.
          </>
        )}{" "}
        We&apos;ve noted confirmation for <span className="text-black font-bold">{emailDisplay}</span>.
      </p>

      <div className="space-y-4 w-full max-w-xs">
        <Link href="/" className="block">
          <button
            type="button"
            className="w-full h-14 bg-black text-white text-[11px] font-bold rounded-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
          >
            Return to Home
          </button>
        </Link>
        <Link href="/account-dashboard" className="block">
          <button
            type="button"
            className="w-full h-14 bg-white border border-neutral-100 text-neutral-900 text-[11px] font-bold rounded-xl uppercase tracking-widest hover:bg-neutral-50 transition-all"
          >
            View account
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

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-neutral-400 text-sm">Loading…</div>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
