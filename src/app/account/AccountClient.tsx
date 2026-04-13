"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

/* ─── Types ─────────────────────────────────────── */
type Tab = "overview" | "orders" | "wishlist" | "addresses" | "settings";

type Order = {
  id: string;
  date: string;
  status: "Delivered" | "In Transit" | "Processing" | "Cancelled";
  total: number;
  items: { name: string; image: string; qty: number; price: number }[];
};

type WishlistItem = {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  image: string;
};

type Address = {
  id: number;
  label: string;
  name: string;
  line1: string;
  line2: string;
  country: string;
  isDefault: boolean;
};

/* ─── Mock Data ──────────────────────────────────── */
const USER = {
  name: "Sofia Andersson",
  email: "sofia@example.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
  memberSince: "March 2023",
  tier: "Gold Member",
  points: 2340,
};

const ORDERS: Order[] = [
  {
    id: "LMA-00412",
    date: "Apr 5, 2026",
    status: "Delivered",
    total: 1350,
    items: [
      { name: "Linen Lounge Chair", image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=400", qty: 1, price: 890 },
      { name: "Sculpt Vase 02", image: "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?w=400&q=80", qty: 1, price: 140 },
      { name: "Ceramic Tray", image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=400", qty: 1, price: 95 },
    ],
  },
  {
    id: "LMA-00389",
    date: "Feb 18, 2026",
    status: "Delivered",
    total: 560,
    items: [
      { name: "Arc Floor Lamp", image: "https://images.unsplash.com/photo-1513506003901-1e6a35eb7b4e?w=400&q=80", qty: 1, price: 560 },
    ],
  },
  {
    id: "LMA-00461",
    date: "Apr 11, 2026",
    status: "In Transit",
    total: 810,
    items: [
      { name: "Orbital Lamp", image: "https://images.unsplash.com/photo-1604610728890-6f4b631ed081?w=400&q=80", qty: 2, price: 320 },
      { name: "Woven Throw", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80", qty: 1, price: 180 },
    ],
  },
  {
    id: "LMA-00501",
    date: "Apr 13, 2026",
    status: "Processing",
    total: 450,
    items: [
      { name: "Side Table", image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=400", qty: 1, price: 450 },
    ],
  },
];

const WISHLIST: WishlistItem[] = [
  { id: 1, name: "Pendant Light", subtitle: "Hand-blown Glass", price: 740, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { id: 2, name: "Ottoman Cube", subtitle: "Bouclé Fabric", price: 390, image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=600" },
  { id: 3, name: "Modular Shelf", subtitle: "Solid Oak", price: 1100, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
  { id: 4, name: "Dining Chair", subtitle: "Ash Wood + Linen", price: 620, image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=600" },
];

const ADDRESSES: Address[] = [
  { id: 1, label: "Home", name: "Sofia Andersson", line1: "Strandvägen 22, Apt 4B", line2: "114 56 Stockholm, Sweden", country: "Sweden", isDefault: true },
  { id: 2, label: "Office", name: "Sofia Andersson", line1: "Kungsgatan 8", line2: "111 43 Stockholm, Sweden", country: "Sweden", isDefault: false },
];

/* ─── Helpers ────────────────────────────────────── */
const STATUS_STYLES: Record<Order["status"], string> = {
  Delivered: "bg-green-50 text-green-700 border-green-100",
  "In Transit": "bg-blue-50 text-blue-700 border-blue-100",
  Processing: "bg-amber-50 text-amber-700 border-amber-100",
  Cancelled: "bg-red-50 text-red-700 border-red-100",
};

const STATUS_ICONS: Record<Order["status"], string> = {
  Delivered: "lucide:package-check",
  "In Transit": "lucide:truck",
  Processing: "lucide:loader-2",
  Cancelled: "lucide:x-circle",
};

const NAV_ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "lucide:layout-dashboard" },
  { id: "orders", label: "My Orders", icon: "lucide:package" },
  { id: "wishlist", label: "Wishlist", icon: "lucide:heart" },
  { id: "addresses", label: "Addresses", icon: "lucide:map-pin" },
  { id: "settings", label: "Settings", icon: "lucide:settings" },
];

/* ─── Sub-panels ─────────────────────────────────── */
function Overview({ setTab }: { setTab: (t: Tab) => void }) {
  const recent = ORDERS.slice(0, 2);
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: ORDERS.length, icon: "lucide:package" },
          { label: "Items Saved", value: WISHLIST.length, icon: "lucide:heart" },
          { label: "Reward Points", value: USER.points.toLocaleString(), icon: "lucide:star" },
          { label: "Addresses", value: ADDRESSES.length, icon: "lucide:map-pin" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-neutral-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 mb-3">
              <Icon icon={s.icon} width={17} />
            </div>
            <p className="text-2xl font-semibold tracking-tight text-neutral-900">{s.value}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h3 className="text-sm font-semibold text-neutral-900">Recent Orders</h3>
          <button onClick={() => setTab("orders")} className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1">
            View all <Icon icon="lucide:arrow-right" width={13} />
          </button>
        </div>
        {recent.map((order, i) => (
          <div key={order.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors ${i < recent.length - 1 ? "border-b border-neutral-100" : ""}`}>
            <div className="flex -space-x-3">
              {order.items.slice(0, 3).map((item) => (
                <div key={item.name} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white bg-neutral-100 relative shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="w-10 h-10 rounded-lg border-2 border-white bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-500">
                  +{order.items.length - 3}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900">{order.id}</p>
              <p className="text-xs text-neutral-400">{order.date} · {order.items.length} {order.items.length === 1 ? "item" : "items"}</p>
            </div>
            <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[order.status]}`}>
              {order.status}
            </span>
            <span className="text-sm font-semibold text-neutral-900 hidden sm:block shrink-0">
              KSh {order.total.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Wishlist Preview */}
      <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h3 className="text-sm font-semibold text-neutral-900">Saved Items</h3>
          <button onClick={() => setTab("wishlist")} className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1">
            View all <Icon icon="lucide:arrow-right" width={13} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-neutral-100">
          {WISHLIST.slice(0, 4).map((item) => (
            <div key={item.id} className="group p-4 hover:bg-neutral-50 transition-colors cursor-pointer">
              <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-3 relative">
                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="text-xs font-semibold text-neutral-900 truncate">{item.name}</p>
              <p className="text-xs text-neutral-400">KSh {item.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Orders() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold tracking-tight">Order History</h2>
        <span className="text-xs text-neutral-400">{ORDERS.length} orders</span>
      </div>
      {ORDERS.map((order) => (
        <div key={order.id} className="bg-white border border-neutral-100 rounded-2xl overflow-hidden">
          {/* Order Header */}
          <button
            onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            className="w-full flex items-center gap-4 px-6 py-5 hover:bg-neutral-50 transition-colors text-left"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${STATUS_STYLES[order.status]}`}>
              <Icon icon={STATUS_ICONS[order.status]} width={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-neutral-900">{order.id}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">{order.date} · {order.items.length} {order.items.length === 1 ? "item" : "items"}</p>
            </div>
            <div className="text-right shrink-0 mr-2">
              <p className="text-sm font-semibold text-neutral-900">KSh {order.total.toLocaleString()}</p>
            </div>
            <Icon
              icon="lucide:chevron-down"
              width={16}
              className={`text-neutral-400 transition-transform shrink-0 ${expandedId === order.id ? "rotate-180" : ""}`}
            />
          </button>

          {/* Expanded Detail */}
          {expandedId === order.id && (
            <div className="border-t border-neutral-100 px-6 py-5 space-y-4">
              {order.items.map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 relative shrink-0 border border-neutral-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900">{item.name}</p>
                    <p className="text-xs text-neutral-400">Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900 shrink-0">KSh {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-neutral-100 flex flex-wrap gap-3 justify-between items-center">
                <div className="flex gap-3">
                  {order.status === "Delivered" && (
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 border border-neutral-200 px-4 py-2 rounded-xl hover:bg-neutral-50 transition-colors">
                      <Icon icon="lucide:refresh-ccw" width={13} /> Return Item
                    </button>
                  )}
                  {order.status === "In Transit" && (
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 border border-blue-200 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                      <Icon icon="lucide:map-pin" width={13} /> Track Order
                    </button>
                  )}
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 border border-neutral-200 px-4 py-2 rounded-xl hover:bg-neutral-50 transition-colors">
                    <Icon icon="lucide:file-text" width={13} /> View Invoice
                  </button>
                </div>
                <p className="text-xs text-neutral-400">
                  Order total: <span className="font-semibold text-neutral-900">KSh {order.total.toLocaleString()}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Wishlist() {
  const [items, setItems] = useState(WISHLIST);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Saved Items</h2>
        <span className="text-xs text-neutral-400">{items.length} items</span>
      </div>
      {items.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-neutral-100">
          <Icon icon="lucide:heart" width={36} className="text-neutral-300 mx-auto mb-4" />
          <p className="text-sm font-medium text-neutral-500 mb-6">Your wishlist is empty</p>
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-neutral-900 px-6 py-3 rounded-full hover:bg-neutral-800 transition-colors">
            Browse Collection <Icon icon="lucide:arrow-right" width={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item.id} className="group bg-white border border-neutral-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] relative overflow-hidden bg-neutral-100">
                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <button
                  onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-neutral-400 hover:text-red-500 hover:scale-110 transition-all"
                >
                  <Icon icon="lucide:heart" width={15} className="fill-current text-red-400" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">{item.name}</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">{item.subtitle}</p>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">KSh {item.price.toLocaleString()}</span>
                </div>
                <button className="w-full h-9 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                  <Icon icon="lucide:shopping-bag" width={13} /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Addresses() {
  const [addresses, setAddresses] = useState(ADDRESSES);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Saved Addresses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-neutral-900 px-4 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
        >
          <Icon icon="lucide:plus" width={14} /> Add Address
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-5">
          <h3 className="text-sm font-semibold mb-5">New Address</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {["Label (e.g. Home)", "Full Name", "Address Line 1", "City & Postcode", "Country"].map((placeholder) => (
              <input
                key={placeholder}
                placeholder={placeholder}
                className={`border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all bg-neutral-50/50 ${placeholder === "Address Line 1" || placeholder === "Country" ? "sm:col-span-2" : ""}`}
              />
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 h-10 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Save Address
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 h-10 border border-neutral-200 text-xs font-semibold rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr.id} className={`bg-white border rounded-2xl p-5 relative ${addr.isDefault ? "border-neutral-900" : "border-neutral-100"}`}>
            {addr.isDefault && (
              <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                <Icon icon={addr.label === "Home" ? "lucide:home" : "lucide:briefcase"} width={14} />
              </div>
              <span className="text-sm font-semibold text-neutral-900">{addr.label}</span>
            </div>
            <p className="text-sm text-neutral-700 font-medium">{addr.name}</p>
            <p className="text-sm text-neutral-500 mt-0.5">{addr.line1}</p>
            <p className="text-sm text-neutral-500">{addr.line2}</p>
            <div className="flex gap-3 mt-4 pt-4 border-t border-neutral-100">
              <button className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1">
                <Icon icon="lucide:pencil" width={12} /> Edit
              </button>
              {!addr.isDefault && (
                <>
                  <span className="w-px h-3 bg-neutral-200 self-center" />
                  <button
                    onClick={() => setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === addr.id })))}
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1"
                  >
                    <Icon icon="lucide:check-circle" width={12} /> Set Default
                  </button>
                  <span className="w-px h-3 bg-neutral-200 self-center" />
                  <button
                    onClick={() => setAddresses((prev) => prev.filter((a) => a.id !== addr.id))}
                    className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <Icon icon="lucide:trash-2" width={12} /> Remove
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings() {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    orders: true,
    promotions: true,
    newArrivals: false,
    blog: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Profile */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-6 lg:p-8">
        <h3 className="text-sm font-semibold text-neutral-900 mb-6">Profile Information</h3>
        <div className="flex items-center gap-5 mb-7 pb-7 border-b border-neutral-100">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-200 border-2 border-white shadow-sm">
              <Image src={USER.avatar} alt={USER.name} width={64} height={64} className="object-cover" />
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center border-2 border-white">
              <Icon icon="lucide:camera" width={11} className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">{USER.name}</p>
            <p className="text-xs text-neutral-400">{USER.email}</p>
            <button className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors mt-1 underline underline-offset-2">
              Change photo
            </button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "First Name", value: "Sofia" },
            { label: "Last Name", value: "Andersson" },
            { label: "Email Address", value: "sofia@example.com", full: true },
            { label: "Phone Number", value: "+46 70 123 45 67" },
          ].map((field) => (
            <div key={field.label} className={field.full ? "sm:col-span-2" : ""}>
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">
                {field.label}
              </label>
              <input
                defaultValue={field.value}
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all bg-neutral-50/50"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Password */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-6 lg:p-8">
        <h3 className="text-sm font-semibold text-neutral-900 mb-6">Change Password</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {["Current Password", "New Password", "Confirm New Password"].map((label) => (
            <div key={label} className={label === "Current Password" ? "sm:col-span-2" : ""}>
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block mb-2">{label}</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all bg-neutral-50/50"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-6 lg:p-8">
        <h3 className="text-sm font-semibold text-neutral-900 mb-6">Email Notifications</h3>
        <div className="space-y-4">
          {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, enabled]) => {
            const labels: Record<keyof typeof notifications, { title: string; desc: string }> = {
              orders: { title: "Order Updates", desc: "Shipping and delivery notifications for your orders" },
              promotions: { title: "Promotions & Offers", desc: "Exclusive discounts and seasonal sale alerts" },
              newArrivals: { title: "New Arrivals", desc: "Be first to know when new pieces drop" },
              blog: { title: "Journal & Stories", desc: "New articles from The Journal" },
            };
            return (
              <div key={key} className="flex items-start justify-between gap-4 py-3 border-b border-neutral-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{labels[key].title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{labels[key].desc}</p>
                </div>
                <button
                  onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                  className={`relative shrink-0 w-10 h-5.5 h-[22px] rounded-full transition-colors duration-200 ${enabled ? "bg-neutral-900" : "bg-neutral-200"}`}
                >
                  <span className={`absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200 ${enabled ? "translate-x-[20px]" : "translate-x-[2px]"}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-red-100 rounded-2xl p-6 lg:p-8">
        <h3 className="text-sm font-semibold text-red-600 mb-4">Danger Zone</h3>
        <p className="text-xs text-neutral-500 mb-4">
          Once you delete your account, there is no going back. This will permanently delete all your orders and saved data.
        </p>
        <button className="flex items-center gap-2 text-xs font-semibold text-red-500 border border-red-200 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors">
          <Icon icon="lucide:trash-2" width={13} /> Delete Account
        </button>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 h-11 px-8 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neutral-900/10 active:translate-y-0 duration-200"
        >
          {saved ? (
            <><Icon icon="lucide:check" width={15} /> Saved!</>
          ) : (
            <>Save Changes</>
          )}
        </button>
        <button className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────── */
export default function AccountClient() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const PANEL = {
    overview: <Overview setTab={setActiveTab} />,
    orders: <Orders />,
    wishlist: <Wishlist />,
    addresses: <Addresses />,
    settings: <Settings />,
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-10 lg:py-14">

      {/* Top Profile Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10 pb-8 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-200 border-2 border-white shadow relative shrink-0">
            <Image src={USER.avatar} alt={USER.name} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
              {USER.name}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Icon icon="lucide:star" width={12} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-amber-600">{USER.tier}</span>
              <span className="w-px h-3 bg-neutral-200" />
              <span className="text-xs text-neutral-400">{USER.points.toLocaleString()} pts</span>
              <span className="w-px h-3 bg-neutral-200" />
              <span className="text-xs text-neutral-400">Member since {USER.memberSince}</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-red-500 border border-neutral-200 hover:border-red-200 px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto">
          <Icon icon="lucide:log-out" width={14} /> Sign Out
        </button>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8 items-start">

        {/* Sidebar Nav */}
        <aside className="lg:sticky lg:top-24">
          {/* Mobile: horizontal scroll */}
          <div className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 lg:overflow-visible">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink w-auto lg:w-full ${
                  activeTab === item.id
                    ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/10"
                    : "text-neutral-600 hover:bg-white hover:text-neutral-900 hover:shadow-sm"
                }`}
              >
                <Icon icon={item.icon} width={16} className="shrink-0" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Loyalty Card */}
          <div className="hidden lg:block mt-6 bg-gradient-to-br from-neutral-900 to-neutral-700 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Icon icon="lucide:gem" width={16} className="text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                {USER.tier}
              </span>
            </div>
            <p className="text-2xl font-semibold tracking-tight mb-0.5">
              {USER.points.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-400">reward points</p>
            <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-300 rounded-full" style={{ width: "62%" }} />
            </div>
            <p className="text-[10px] text-neutral-400 mt-1.5">660 pts to Platinum</p>
          </div>
        </aside>

        {/* Main Panel */}
        <div className="min-w-0">
          {PANEL[activeTab]}
        </div>
      </div>
    </div>
  );
}
