import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCatalogProductBySlug, getCatalogProducts } from "@/lib/catalog-db";
import ProductDetailClient from "./ProductDetailClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) return { title: "Product Not Found | Anashe" };
  return {
    title: `${product.name} | Anashe`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <Navbar />
      <main className="bg-[#F9F8F4] text-[#2C2C2C] pt-16 min-h-screen">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </>
  );
}
