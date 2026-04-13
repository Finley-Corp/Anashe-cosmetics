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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <NewArrivals />
        <Shop />
        <Collections />
        <Journal />
        <Newsletter />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
