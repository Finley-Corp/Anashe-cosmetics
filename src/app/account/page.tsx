import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "My Account | LUMA",
  description: "Manage your LUMA account, orders, and preferences.",
};

export default function AccountPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-neutral-50">
        <AccountClient />
      </main>
      <Footer />
    </>
  );
}
