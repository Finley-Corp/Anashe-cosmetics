"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Leaf,
  ShoppingBag,
  Sprout,
  Star,
  Truck,
  Award,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { addToCart, CART_UPDATED_EVENT, getCartCount } from "@/lib/cart";
import { Header } from "@/components/Header";

type ProductPageData = {
  slug: string;
  name: string;
  subtitle: string;
  badgeA: string;
  badgeB: string;
  price: number;
  compareAtPrice: number;
  category: string;
  mainImage: string;
  thumbnails: string[];
  rating: number;
  reviewCount: string;
  sizes: string[];
};

const PRODUCTS: ProductPageData[] = [
  {
    slug: "bio-renew-serum",
    name: "Bio-Renew Serum",
    subtitle:
      "A concentrated peptide and botanical complex designed to smooth texture, boost elasticity, and support long-term barrier resilience.",
    badgeA: "Best Seller",
    badgeB: "Derm Tested",
    price: 9800,
    compareAtPrice: 11200,
    category: "Serum",
    mainImage: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=1600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=320&q=80",
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=320&q=80",
      "https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?w=320&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=320&q=80",
    ],
    rating: 4.9,
    reviewCount: "1,240",
    sizes: ["30ml", "50ml", "75ml"],
  },
  {
    slug: "barrier-cloud-cream",
    name: "Barrier Cloud Cream",
    subtitle: "Rich moisture, featherlight finish. Built for all-day comfort and overnight repair.",
    badgeA: "Editor Pick",
    badgeB: "Sensitive-Skin Safe",
    price: 7200,
    compareAtPrice: 8400,
    category: "Moisturizer",
    mainImage: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=1600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=320&q=80",
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=320&q=80",
      "https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?w=320&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=320&q=80",
    ],
    rating: 4.8,
    reviewCount: "980",
    sizes: ["50ml", "75ml", "100ml"],
  },
  {
    slug: "moonwater-cleanse",
    name: "Moonwater Cleanse",
    subtitle: "A pH-balanced low-foam cleanser that purifies without compromising the lipid barrier.",
    badgeA: "Daily Essential",
    badgeB: "Microbiome Friendly",
    price: 4800,
    compareAtPrice: 5600,
    category: "Cleanser",
    mainImage: "https://images.unsplash.com/photo-1648203107138-9e9f9dc64662?w=1600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1648203107138-9e9f9dc64662?w=320&q=80",
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=320&q=80",
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=320&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=320&q=80",
    ],
    rating: 4.7,
    reviewCount: "760",
    sizes: ["120ml", "180ml", "250ml"],
  },
  {
    slug: "luminous-eye-veil",
    name: "Luminous Eye Veil",
    subtitle: "Cooling, brightening care with caffeine and niacinamide for tired under-eyes.",
    badgeA: "New Arrival",
    badgeB: "Fragrance Free",
    price: 6400,
    compareAtPrice: 7200,
    category: "Treatment",
    mainImage: "https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?w=1600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?w=320&q=80",
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=320&q=80",
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=320&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=320&q=80",
    ],
    rating: 4.8,
    reviewCount: "640",
    sizes: ["15ml", "25ml", "30ml"],
  },
  {
    slug: "overnight-repair-mask",
    name: "Overnight Repair Mask",
    subtitle: "An intensive sleeping treatment that replenishes moisture and calms visible redness.",
    badgeA: "Recovery Ritual",
    badgeB: "Overnight Use",
    price: 8600,
    compareAtPrice: 9800,
    category: "Mask",
    mainImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=320&q=80",
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=320&q=80",
      "https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?w=320&q=80",
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=320&q=80",
    ],
    rating: 4.9,
    reviewCount: "850",
    sizes: ["50ml", "80ml", "100ml"],
  },
  {
    slug: "daily-defense-spf-40",
    name: "Daily Defense SPF 40",
    subtitle: "Weightless broad-spectrum mineral defense with a soft-focus, no-cast finish.",
    badgeA: "Daily Shield",
    badgeB: "Broad Spectrum",
    price: 5600,
    compareAtPrice: 6400,
    category: "SPF",
    mainImage: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=1600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=320&q=80",
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=320&q=80",
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=320&q=80",
      "https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?w=320&q=80",
    ],
    rating: 4.8,
    reviewCount: "1,030",
    sizes: ["40ml", "60ml", "90ml"],
  },
];

function formatKsh(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const product = PRODUCTS.find((item) => item.slug === slug);

  if (!product) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bricolage font-semibold">Product not found</h1>
          <p className="text-white/70 mt-2 font-sans">The product you are looking for is unavailable.</p>
          <Link href="/shop" className="inline-flex mt-6 rounded-2xl bg-white text-neutral-900 px-4 py-2.5 text-sm font-medium hover:bg-white/90 transition font-sans">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [bagCount, setBagCount] = useState(getCartCount());
  const [cartFeedback, setCartFeedback] = useState("");
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({
    ingredients: true,
    clinical: false,
    usage: false,
  });

  const popularSizeIndex = Math.min(1, product.sizes.length - 1);

  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize(popularSizeIndex);
    setQuantity(1);
    setCartFeedback("");
  }, [slug, popularSizeIndex]);

  useEffect(() => {
    const syncCount = () => setBagCount(getCartCount());
    syncCount();

    window.addEventListener("storage", syncCount);
    window.addEventListener(CART_UPDATED_EVENT, syncCount);

    return () => {
      window.removeEventListener("storage", syncCount);
      window.removeEventListener(CART_UPDATED_EVENT, syncCount);
    };
  }, []);

  const galleryImages = useMemo(() => [product.mainImage, ...product.thumbnails], [product.mainImage, product.thumbnails]);
  const selectedImageSrc = galleryImages[selectedImage] ?? product.mainImage;

  const currentPrice = useMemo(() => product.price + selectedSize * 700, [product.price, selectedSize]);
  const currentCompareAtPrice = useMemo(() => currentPrice + 1400, [currentPrice]);

  const handleAddToCart = () => {
    addToCart({
      slug: product.slug,
      name: product.name,
      price: currentPrice,
      image: selectedImageSrc,
      size: product.sizes[selectedSize],
      quantity,
    });

    setBagCount(getCartCount());
    setCartFeedback(`${quantity} x ${product.name} (${product.sizes[selectedSize]}) added to bag.`);
    window.setTimeout(() => setCartFeedback(""), 2200);
  };

  const togglePanel = (key: string) => {
    setOpenPanels((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <main className="bg-neutral-950 text-white antialiased selection:bg-white/20 min-h-screen">
      <section className="relative border-b border-white/10">
        <Header />
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 lg:pt-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="aspect-[4/3] w-full bg-white/5 rounded-lg overflow-hidden relative group border border-white/10">
              <img
                src={selectedImageSrc}
                alt={product.name}
                className="object-center transition-transform duration-700 ease-out group-hover:scale-105 w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {galleryImages.slice(0, 4).map((thumb, index) => (
                <button
                  key={`${thumb}-${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden transition-opacity border ${
                    selectedImage === index ? "border-emerald-300 opacity-100" : "border-white/10 opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View thumbnail ${index + 1}`}
                >
                  <img src={thumb} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 lg:mt-0 mt-8 relative">
            <div className="sticky top-24 space-y-8">
              <div className="space-y-3 border-b border-white/10 pb-6">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80">
                    {product.badgeA}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-200 bg-emerald-300/10">
                    {product.badgeB}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white font-bricolage">{product.name}</h1>

                <p className="text-base text-white/70 font-normal leading-relaxed">{product.subtitle}</p>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} className="w-4 h-4 fill-current stroke-none" />
                    ))}
                  </div>
                  <span className="text-sm text-white/70 hover:underline cursor-pointer">
                    {product.rating} ({product.reviewCount} Reviews)
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-medium text-white">{formatKsh(currentPrice)}</span>
                  <span className="text-base text-white/40 line-through font-light">{formatKsh(currentCompareAtPrice)}</span>
                  <span className="text-sm text-emerald-200 font-medium">Inclusive of all taxes</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white/70">Select Size</label>
                <div className="grid grid-cols-3 gap-3">
                  {product.sizes.map((size, index) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(index)}
                      className={`rounded-lg py-3 px-4 text-sm transition-colors relative ${
                        index === selectedSize
                          ? "border-2 border-emerald-300 bg-emerald-300/10 text-white"
                          : "border border-white/10 hover:border-emerald-300 text-white/70"
                      }`}
                    >
                      {size}
                      {index === popularSizeIndex ? (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-300 text-neutral-900 text-[10px] px-1.5 py-0.5 rounded">
                          Most Popular
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex gap-4">
                  <div className="flex items-center border border-white/10 rounded-lg w-32 justify-between px-3 h-12 bg-white/5">
                    <button
                      className="text-white/70 hover:text-white text-lg"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    >
                      -
                    </button>
                    <span className="text-base font-medium text-white">{quantity}</span>
                    <button
                      className="text-white/70 hover:text-white text-lg"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-white hover:bg-white/90 text-neutral-900 font-medium rounded-lg h-12 shadow-sm transition-all duration-300 flex items-center justify-center gap-2 group font-sans"
                  >
                    <span>Add to Cart</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border-gradient before:rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10 transition font-sans"
                  style={{ backdropFilter: "blur(4px) saturate(1.25)" }}
                >
                  Go to Checkout
                </button>

                {cartFeedback ? <p className="text-xs text-emerald-200 font-sans">{cartFeedback}</p> : null}

                <div className="flex items-center justify-center gap-4 text-xs text-white/60 pt-2 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    Clinical Grade
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span className="flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                    No Harsh Additives
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-300" />
                    Doorstep Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-white/[0.03] py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                <Heart className="w-6 h-6 text-emerald-200 stroke-[1.25]" />
              </div>
              <div>
                <h3 className="font-bricolage text-lg font-medium text-white mb-1">Barrier-Loving Actives</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Targets texture and dullness while preserving hydration and minimizing sensitivity.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                <Sprout className="w-6 h-6 text-emerald-200 stroke-[1.25]" />
              </div>
              <div>
                <h3 className="font-bricolage text-lg font-medium text-white mb-1">Botanical + Clinical Blend</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  A research-backed formula combining peptides, niacinamide, and fermentation-derived botanicals.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                <Award className="w-6 h-6 text-emerald-200 stroke-[1.25]" />
              </div>
              <div>
                <h3 className="font-bricolage text-lg font-medium text-white mb-1">Texture You Will Use Daily</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Lightweight, non-greasy finish that layers seamlessly in both morning and evening routines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-12 items-center">
            <div className="order-2 md:order-1 relative rounded-lg overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1600&q=80"
                alt="Laboratory precision process"
                className="hover:scale-[1.02] transition-all duration-700 w-full h-[500px] object-cover"
              />
              <div className="bg-gradient-to-t from-black/40 to-transparent absolute inset-0"></div>
              <div className="absolute bottom-6 left-6 text-white/90 text-sm font-medium flex items-center gap-1">
                <MapPin className="inline w-4 h-4" />
                Formulated in small clinical batches
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-3xl font-bricolage text-white tracking-tight">Precisely crafted. Never rushed.</h2>
              <p className="text-white/70 leading-relaxed">
                We start with active systems selected for compatibility, then calibrate percentages for efficacy, stability, and tolerance. Each batch is evaluated for texture, absorption, and finish.
              </p>
              <p className="text-white/70 leading-relaxed">
                The result is a product that feels luxurious but remains function-first: visible improvements in smoothness, moisture retention, and luminosity over consistent use.
              </p>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center text-emerald-200 font-medium border-b border-emerald-200/30 pb-0.5 hover:text-white hover:border-white transition-all"
                >
                  Read the full story <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-white/10 border-t pt-16 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bricolage text-white text-center mb-10 tracking-tight">Transparency in every drop</h2>

          <div className="bg-white/[0.03] rounded-xl border border-white/10 divide-y divide-white/10">
            <button
              onClick={() => togglePanel("ingredients")}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors group"
            >
              <div>
                <span className="block text-sm font-medium text-white">Key Ingredients</span>
                {openPanels.ingredients ? (
                  <span className="block text-sm text-white/70 mt-1">
                    Peptides, niacinamide, fermented botanicals, ceramides, and antioxidant-rich oils.
                  </span>
                ) : null}
              </div>
              <ChevronDown
                className={`w-5 h-5 text-white/50 group-hover:text-white transition-transform ${
                  openPanels.ingredients ? "rotate-180" : ""
                }`}
              />
            </button>

            <button
              onClick={() => togglePanel("clinical")}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors group"
            >
              <div>
                <span className="block text-sm font-medium text-white">Clinical Snapshot</span>
                {openPanels.clinical ? (
                  <span className="block text-sm text-white/70 mt-1">
                    4-week panel: 92% reported improved hydration and 87% saw smoother texture.
                  </span>
                ) : null}
              </div>
              <ChevronDown
                className={`w-5 h-5 text-white/50 group-hover:text-white transition-transform ${
                  openPanels.clinical ? "rotate-180" : ""
                }`}
              />
            </button>

            <button
              onClick={() => togglePanel("usage")}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors group"
            >
              <div>
                <span className="block text-sm font-medium text-white">Usage Instructions</span>
                {openPanels.usage ? (
                  <span className="block text-sm text-white/70 mt-1">
                    Apply 1-2 pumps to clean, damp skin. Follow with moisturizer and SPF in the morning.
                  </span>
                ) : null}
              </div>
              <ChevronDown
                className={`w-5 h-5 text-white/50 group-hover:text-white transition-transform ${
                  openPanels.usage ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bricolage text-white tracking-tight">Stories from real routines</h2>
            <Link href="#" className="text-sm font-medium text-white/70 hover:text-white">
              View all reviews
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "My skin feels calmer in the morning and makeup sits better. The texture is elegant and non-sticky.",
                initials: "AK",
                name: "Amina K.",
                city: "Nairobi",
              },
              {
                quote:
                  "I switched from a much pricier product and saw better hydration in just two weeks. It has become a staple.",
                initials: "LM",
                name: "Lilian M.",
                city: "Mombasa",
              },
              {
                quote:
                  "Packaging is premium, and the formula performs. My dry patches are significantly reduced.",
                initials: "JN",
                name: "Jared N.",
                city: "Kisumu",
              },
            ].map((review) => (
              <div key={review.name} className="bg-white/[0.03] p-6 rounded-lg border border-white/10 shadow-sm">
                <div className="flex text-amber-400 mb-3">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="w-3.5 h-3.5 fill-current stroke-none" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-4">"{review.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-emerald-200">
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">{review.name}</p>
                    <p className="text-[10px] text-white/50">Verified Buyer • {review.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <div className="fixed bottom-0 left-0 w-full bg-neutral-950/95 border-t border-white/10 p-4 lg:hidden z-50 shadow-[0_-4px_12px_-1px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <p className="text-xs text-white/60">{product.category}</p>
            <p className="font-medium text-white">{formatKsh(currentPrice)}</p>
          </div>
          <button onClick={handleAddToCart} className="bg-white text-neutral-900 px-8 py-3 rounded-lg font-medium text-sm w-auto shadow-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}