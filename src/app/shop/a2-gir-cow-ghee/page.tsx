import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailClient from "./ProductDetailClient";

export const metadata: Metadata = {
  title: "Traditional A2 Gir Cow Ghee | LUMA",
  description:
    "Hand-churned Bilona A2 Gir Cow Ghee with rich aroma, grainy texture, and pure farm-to-jar nutrition.",
};

export default function A2GirCowGheePage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F9F8F4] text-[#2C2C2C] pt-16">
        <ProductDetailClient />
      </main>
      <Footer />
    </>
  );
}

