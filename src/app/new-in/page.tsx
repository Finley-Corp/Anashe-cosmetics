import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import RevealObserver from "@/components/RevealObserver";
import { getProductsBySegment } from "@/lib/catalog-db";

export const metadata: Metadata = {
  title: "New In | Anashe",
  description: "Explore the latest skincare arrivals from our curated brand lineup.",
};

export default async function NewInPage() {
  const products = await getProductsBySegment("new-in");

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="max-w-[1440px] mx-auto px-6 pt-14 pb-10 border-b border-neutral-100">
          <h1 className="text-4xl lg:text-5xl font-medium tracking-tighter">New In</h1>
          <p className="text-sm text-neutral-500 mt-3 max-w-xl">Fresh drops in skincare, just added to the collection.</p>
        </section>

        <section className="max-w-[1440px] mx-auto px-6 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/shop/${product.slug}`} className="group block">
                <div className="aspect-square rounded-xl overflow-hidden border border-neutral-100 bg-neutral-50 mb-4 relative">
                  <Image src={product.image} alt={product.name} fill className="object-cover group-hover:opacity-0 transition-opacity duration-500 absolute inset-0 z-10" />
                  <Image src={product.hoverImage} alt={`${product.name} alternate`} fill className="object-cover absolute inset-0 scale-105" />
                </div>
                <p className="text-xs uppercase tracking-wide text-neutral-400 mb-1">{product.category}</p>
                <h3 className="text-sm font-semibold text-neutral-900">{product.name}</h3>
                <p className="text-xs text-neutral-500 mt-1">KSh {product.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
