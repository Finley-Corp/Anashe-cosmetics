"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { useEffect, useState } from "react";
import { ORDER_STORAGE_KEY } from "@/lib/order";

type LastOrder = { orderId: string; total: number; placedAt: string; email?: string };

export default function AccountDashboardPage() {
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ORDER_STORAGE_KEY);
      if (raw) setLastOrder(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 reveal">
           <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4 block">Welcome back</span>
              <h1 className="text-4xl font-medium tracking-tighter">Your Account</h1>
           </div>
           <button className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors border-b border-transparent hover:border-black pb-1">Log Out</button>
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
           {/* Sidebar */}
           <div className="lg:col-span-1 space-y-2 reveal">
              {["Dashboard", "Order History", "Addresses", "Payment Methods", "Account Settings"].map((item, i) => (
                <button 
                  key={i} 
                  className={`w-full text-left px-6 py-4 rounded-xl text-sm font-semibold transition-all ${i === 0 ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"}`}
                >
                   {item}
                </button>
              ))}
           </div>

           {/* Content */}
           <div className="lg:col-span-3 space-y-12 reveal delay-100">
              {lastOrder && (
                <div className="p-6 rounded-2xl bg-neutral-900 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Latest order</p>
                  <p className="text-lg font-medium">
                    #{lastOrder.orderId}{" "}
                    <span className="text-neutral-400 font-normal text-sm">
                      · KSh {lastOrder.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </p>
                  <p className="text-xs text-neutral-400 mt-2">
                    Placed {new Date(lastOrder.placedAt).toLocaleString()}
                  </p>
                </div>
              )}
              {/* Stats/Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                    <Icon icon="lucide:package" width="24" className="mb-4 text-neutral-400"></Icon>
                    <h4 className="text-2xl font-semibold mb-1">02</h4>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Active Orders</p>
                 </div>
                 <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                    <Icon icon="lucide:heart" width="24" className="mb-4 text-neutral-400"></Icon>
                    <h4 className="text-2xl font-semibold mb-1">08</h4>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Wishlist Items</p>
                 </div>
                 <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                    <Icon icon="lucide:credit-card" width="24" className="mb-4 text-neutral-400"></Icon>
                    <h4 className="text-2xl font-semibold mb-1">ANASHE+</h4>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Membership Status</p>
                 </div>
              </div>

              {/* Recent Orders Table */}
              <div className="space-y-6">
                 <h3 className="text-xl font-medium tracking-tight">Recent Orders</h3>
                 <div className="overflow-x-auto ring-1 ring-neutral-100 rounded-2xl">
                    <table className="w-full text-left text-sm">
                       <thead className="bg-neutral-50 border-b border-neutral-100">
                          <tr>
                             <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Order ID</th>
                             <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Date</th>
                             <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Status</th>
                             <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-neutral-400 text-right">Total</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-neutral-100 font-medium">
                          <tr>
                             <td className="px-6 py-6 text-neutral-900">#LM-28491</td>
                             <td className="px-6 py-6 text-neutral-500">Oct 08, 2023</td>
                             <td className="px-6 py-6 text-neutral-900"><span className="bg-neutral-100 px-2.5 py-1 rounded text-[10px] font-bold">SHIPPED</span></td>
                             <td className="px-6 py-6 text-neutral-900 text-right">KSh 1,210.00</td>
                          </tr>
                          <tr>
                             <td className="px-6 py-6 text-neutral-900">#LM-28312</td>
                             <td className="px-6 py-6 text-neutral-500">Sep 24, 2023</td>
                             <td className="px-6 py-6 text-neutral-900"><span className="bg-green-50 text-green-700 px-2.5 py-1 rounded text-[10px] font-bold">DELIVERED</span></td>
                             <td className="px-6 py-6 text-neutral-900 text-right">KSh 450.00</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </div>

              {/* Account Settings Peek */}
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="p-8 rounded-3xl border border-neutral-100">
                    <h4 className="text-lg font-medium mb-4">Default Address</h4>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                       Jane Doe<br/>
                       Sveavägen 48, 111 34<br/>
                       Stockholm, Sweden
                    </p>
                    <button className="text-xs font-bold uppercase tracking-widest mt-6 border-b border-black pb-1 hover:text-neutral-500 hover:border-neutral-300 transition-all">Edit Address</button>
                 </div>
                 <div className="p-8 rounded-3xl border border-neutral-100">
                    <h4 className="text-lg font-medium mb-4">Profile Details</h4>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                       jane@example.com<br/>
                       +46 70 123 45 67
                    </p>
                    <button className="text-xs font-bold uppercase tracking-widest mt-6 border-b border-black pb-1 hover:text-neutral-500 hover:border-neutral-300 transition-all">Edit Profile</button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
