"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "anashe-cart-v1";

export type CartLine = {
  lineId: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  variantLabel: string;
  quantity: number;
};

export type AddToCartInput = {
  productId: string;
  name: string;
  price: number;
  image: string;
  variantLabel: string;
  quantity?: number;
};

function makeLineId(productId: string, variantLabel: string) {
  return `${productId}::${variantLabel.trim().toLowerCase()}`;
}

type CartContextValue = {
  lines: CartLine[];
  isReady: boolean;
  itemCount: number;
  subtotal: number;
  toast: string | null;
  addItem: (input: AddToCartInput) => void;
  removeLine: (lineId: string) => void;
  setLineQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadFromStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(lines: CartLine[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* ignore quota */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLines(loadFromStorage());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    persist(lines);
  }, [lines, isReady]);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, 2800);
  }, []);

  const addItem = useCallback(
    (input: AddToCartInput) => {
      const qty = Math.max(1, input.quantity ?? 1);
      const lineId = makeLineId(input.productId, input.variantLabel);
      setLines((prev) => {
        const idx = prev.findIndex((l) => l.lineId === lineId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            quantity: next[idx].quantity + qty,
          };
          return next;
        }
        return [
          ...prev,
          {
            lineId,
            productId: input.productId,
            name: input.name,
            price: input.price,
            image: input.image,
            variantLabel: input.variantLabel,
            quantity: qty,
          },
        ];
      });
      showToast(`${input.name} added to cart`);
    },
    [showToast]
  );

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const setLineQuantity = useCallback((lineId: string, quantity: number) => {
    const q = Math.max(0, Math.floor(quantity));
    if (q === 0) {
      setLines((prev) => prev.filter((l) => l.lineId !== lineId));
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.lineId === lineId ? { ...l, quantity: q } : l))
    );
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines]
  );

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.price * l.quantity, 0),
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      isReady,
      itemCount,
      subtotal,
      toast,
      addItem,
      removeLine,
      setLineQuantity,
      clearCart,
    }),
    [lines, isReady, itemCount, subtotal, toast, addItem, removeLine, setLineQuantity, clearCart]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300"
          role="status"
        >
          {toast}
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
