import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Cart | LUMA",
  description: "Review your LUMA selections before checkout.",
};

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-white">
        <CartClient />
      </main>
      <Footer />
    </>
  );
}
