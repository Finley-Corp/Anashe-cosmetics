"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { addToCart } from "@/lib/cart";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
};

const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "bio-renew-serum",
    name: "Bio-Renew Serum",
    category: "Serum",
    price: 9800,
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=900&h=900&fit=crop",
    description: "A fast-absorbing concentrate that visibly smooths texture and boosts hydration.",
  },
  {
    id: "p2",
    slug: "barrier-cloud-cream",
    name: "Barrier Cloud Cream",
    category: "Moisturizer",
    price: 7200,
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=900&h=900&fit=crop",
    description: "Velvety daily moisture that reinforces the skin barrier with ceramides and peptides.",
  },
  {
    id: "p3",
    slug: "moonwater-cleanse",
    name: "Moonwater Cleanse",
    category: "Cleanser",
    price: 4800,
    image: "https://images.unsplash.com/photo-1648203107138-9e9f9dc64662?w=900&h=900&fit=crop",
    description: "A low-foam, pH-balanced cleanse that removes sunscreen and impurities without stripping.",
  },
  {
    id: "p4",
    slug: "luminous-eye-veil",
    name: "Luminous Eye Veil",
    category: "Treatment",
    price: 6400,
    image: "https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?w=900&h=900&fit=crop",
    description: "Cooling caffeine and niacinamide treatment to brighten and depuff tired eyes.",
  },
  {
    id: "p5",
    slug: "overnight-repair-mask",
    name: "Overnight Repair Mask",
    category: "Mask",
    price: 8600,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&h=900&fit=crop",
    description: "An intensive sleeping mask that replenishes moisture and calms visible redness overnight.",
  },
  {
    id: "p6",
    slug: "daily-defense-spf-40",
    name: "Daily Defense SPF 40",
    category: "SPF",
    price: 5600,
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=900&h=900&fit=crop",
    description: "Weightless mineral protection with a soft-focus finish and no white cast.",
  },
];

export default function ShopPage() {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedMessage, setAddedMessage] = useState("");

  const formatKsh = (amount: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(amount);

  const updateQuantity = (id: string, nextValue: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(8, nextValue)),
    }));
  };

  const itemCount = useMemo(
    () => Object.values(quantities).reduce((total, qty) => total + qty, 0),
    [quantities],
  );
  const shippingFee = itemCount > 0 ? 900 : 0;

  const subtotal = useMemo(
    () =>
      PRODUCTS.reduce((total, product) => {
        const qty = quantities[product.id] ?? 0;
        return total + qty * product.price;
      }, 0),
    [quantities],
  );

  const handleCheckout = () => {
    if (itemCount === 0) return;
    router.push("/checkout");
  };

  const handleAddToBag = (product: Product, qty: number) => {
    const quantityToAdd = Math.max(1, qty);

    updateQuantity(product.id, quantityToAdd);
    addToCart({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      size: "Standard",
      quantity: quantityToAdd,
    });

    setAddedMessage(`${product.name} added to cart.`);
    window.setTimeout(() => setAddedMessage(""), 1800);
  };

  const goToProduct = (slug: string) => {
    router.push(`/shop/${slug}`);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-neutral-950 text-white">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/10 via-neutral-950/0 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-black/30" />
      </div>

      <section className="relative border-b border-white/10">
        <Header />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pb-12 pt-6 sm:pb-16 sm:pt-10">
          <p className="uppercase tracking-[0.18em] text-xs text-white/60 font-sans">Shop ANASHE</p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bricolage font-semibold tracking-tighter leading-[1.05] max-w-3xl">
            Clinical skincare essentials made for daily rituals.
          </h1>
          <p className="mt-4 max-w-2xl text-white/80 font-sans text-base sm:text-lg">
            Browse our complete lineup, choose your routine, and prepare your order in one clean checkout flow.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {addedMessage ? <p className="lg:col-span-3 text-sm text-emerald-200 font-sans">{addedMessage}</p> : null}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5 sm:gap-6">
            {PRODUCTS.map((product) => {
              const qty = quantities[product.id] ?? 0;
              return (
                <article
                  key={product.id}
                  className="border-gradient before:rounded-3xl rounded-3xl bg-white/[0.03] overflow-hidden cursor-pointer"
                  style={{ backdropFilter: "blur(6px) saturate(1.1)" }}
                  role="link"
                  tabIndex={0}
                  onClick={() => goToProduct(product.slug)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      goToProduct(product.slug);
                    }
                  }}
                >
                  <div className="relative h-52 overflow-hidden border-b border-white/10">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-2xl border-gradient before:rounded-2xl bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/80 font-sans">
                      {product.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-2xl font-bricolage font-semibold tracking-tight leading-tight">{product.name}</h2>
                      <p className="text-xl font-medium text-white">{formatKsh(product.price)}</p>
                    </div>
                    <p className="mt-3 text-sm text-white/75 leading-relaxed font-sans">{product.description}</p>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div className="inline-flex items-center rounded-2xl bg-white/5 border-gradient before:rounded-2xl">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            updateQuantity(product.id, qty - 1);
                          }}
                          className="h-10 w-10 inline-flex items-center justify-center text-white/80 hover:text-white transition"
                          aria-label={`Decrease quantity for ${product.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-white">{qty}</span>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            updateQuantity(product.id, qty + 1);
                          }}
                          className="h-10 w-10 inline-flex items-center justify-center text-white/80 hover:text-white transition"
                          aria-label={`Increase quantity for ${product.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAddToBag(product, qty);
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl bg-white text-neutral-900 px-4 py-2.5 text-sm font-medium hover:bg-white/90 transition font-sans"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        {qty > 0 ? "In Cart" : "Add to Bag"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside
            className="h-fit lg:sticky lg:top-8 border-gradient before:rounded-3xl rounded-3xl bg-white/[0.03] p-6"
            style={{ backdropFilter: "blur(6px) saturate(1.1)" }}
          >
            <div className="inline-flex items-center gap-2 rounded-2xl border-gradient before:rounded-2xl px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-white/80 bg-white/5 font-sans">
              <Sparkles className="h-3.5 w-3.5" />
              Cart Summary
            </div>

            <h3 className="mt-4 text-3xl font-bricolage font-semibold tracking-tight">Ready to buy?</h3>
            <p className="mt-2 text-sm text-white/70 font-sans">Add products to your bag and move to checkout when you are ready.</p>

            <div className="mt-6 space-y-3 text-sm font-sans">
              <div className="flex items-center justify-between text-white/80">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>
              <div className="flex items-center justify-between text-white/80">
                <span>Shipping</span>
                <span>{formatKsh(shippingFee)}</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex items-center justify-between text-base font-medium text-white">
                <span>Subtotal</span>
                <span>{formatKsh(subtotal + shippingFee)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={itemCount === 0}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-neutral-900 px-4 py-3 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 font-sans"
            >
              <ShoppingBag className="h-4 w-4" />
              Proceed to Checkout
            </button>

            <Link
              href="/"
              className="mt-3 w-full inline-flex items-center justify-center rounded-2xl border-gradient before:rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10 transition font-sans"
              style={{ backdropFilter: "blur(4px) saturate(1.25)" }}
            >
              Continue Shopping Story
            </Link>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}