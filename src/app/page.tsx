import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import NewArrivals from "@/components/NewArrivals";
import Shop from "@/components/Shop";
import Collections from "@/components/Collections";
import Journal from "@/components/Journal";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import { getCatalogProducts } from "@/lib/catalog-db";

export default async function Home() {
  const products = await getCatalogProducts();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <NewArrivals />
        <Shop products={products} />
        <Collections />
        <Journal />
        <Newsletter />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
