"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ProductJson } from "@/types/product";
import { mergeQuickProducts, searchProducts } from "@/lib/catalog";
import type { QuickProduct } from "@/lib/catalog";

type ProductsCatalogValue = {
  products: ProductJson[];
  quickBySlug: Record<string, QuickProduct>;
  getQuickProduct: (slug: string) => QuickProduct | undefined;
  searchCatalog: (query: string) => { label: string; href: string; type: string }[];
  isLoading: boolean;
  error: string | null;
};

const ProductsCatalogContext = createContext<ProductsCatalogValue | null>(null);

export function ProductsCatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ProductJson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as ProductJson[];
        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setProducts([]);
          setError(e instanceof Error ? e.message : "Failed to load catalog");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const quickBySlug = useMemo(
    () => mergeQuickProducts(products),
    [products]
  );

  const getQuickProduct = useCallback(
    (slug: string) => quickBySlug[slug],
    [quickBySlug]
  );

  const searchCatalog = useCallback(
    (query: string) => searchProducts(query, quickBySlug),
    [quickBySlug]
  );

  const value = useMemo(
    () => ({
      products,
      quickBySlug,
      getQuickProduct,
      searchCatalog,
      isLoading,
      error,
    }),
    [products, quickBySlug, getQuickProduct, searchCatalog, isLoading, error]
  );

  return (
    <ProductsCatalogContext.Provider value={value}>
      {children}
    </ProductsCatalogContext.Provider>
  );
}

export function useProductsCatalog() {
  const ctx = useContext(ProductsCatalogContext);
  if (!ctx) {
    throw new Error("useProductsCatalog must be used within ProductsCatalogProvider");
  }
  return ctx;
}

/** Optional: null when no provider (e.g. tests). */
export function useOptionalProductsCatalog(): ProductsCatalogValue | null {
  return useContext(ProductsCatalogContext);
}
