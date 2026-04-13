import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import RevealObserver from "@/components/RevealObserver";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop | LUMA",
  description: "Browse the full LUMA collection of premium furniture, lighting, and accessories.",
};

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <ShopClient />
        <Newsletter />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
