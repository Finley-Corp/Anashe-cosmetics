"use client";

import { CartProvider } from "@/context/CartContext";
import { ProductsCatalogProvider } from "@/context/ProductsCatalogContext";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <ProductsCatalogProvider>{children}</ProductsCatalogProvider>
    </CartProvider>
  );
}
