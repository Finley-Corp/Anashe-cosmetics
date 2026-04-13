import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import RevealObserver from "@/components/RevealObserver";
import ShopClient from "./ShopClient";
import { getCatalogProducts } from "@/lib/catalog-db";

export const metadata: Metadata = {
  title: "Shop | Anashe",
  description: "Browse the full Anashe collection of premium furniture, lighting, and accessories.",
};

export default async function ShopPage() {
  const products = await getCatalogProducts();

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <ShopClient products={products} />
        <Newsletter />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
