"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import type { CartLine } from "@/types/cart";

const STORAGE_KEY = "glow-mart-cart";

type CartContextValue = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clear: () => void;
  totalQuantity: number;
  subtotalCents: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadInitial(): CartLine[] {
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setLines(loadInitial());
      setHydrated(true);
    });
  }, [startTransition]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addLine = useCallback(
    (line: Omit<CartLine, "quantity"> & { quantity?: number }) => {
      const qty = line.quantity ?? 1;
      setLines((prev) => {
        const i = prev.findIndex((l) => l.productId === line.productId);
        if (i === -1) {
          return [
            ...prev,
            {
              productId: line.productId,
              name: line.name,
              slug: line.slug,
              priceCents: line.priceCents,
              imageUrl: line.imageUrl,
              stock: line.stock,
              quantity: Math.min(qty, line.stock),
            },
          ];
        }
        const next = [...prev];
        const merged = next[i];
        const nextQty = Math.min(merged.quantity + qty, line.stock);
        next[i] = { ...merged, quantity: nextQty, stock: line.stock };
        return next;
      });
    },
    [],
  );

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.productId === productId);
      if (i === -1) return prev;
      if (quantity <= 0) {
        return prev.filter((l) => l.productId !== productId);
      }
      const next = [...prev];
      const row = next[i];
      next[i] = {
        ...row,
        quantity: Math.min(quantity, row.stock),
      };
      return next;
    });
  }, []);

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const totalQuantity = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines],
  );

  const subtotalCents = useMemo(
    () => lines.reduce((s, l) => s + l.priceCents * l.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      addLine,
      setQuantity,
      removeLine,
      clear,
      totalQuantity,
      subtotalCents,
    }),
    [
      lines,
      addLine,
      setQuantity,
      removeLine,
      clear,
      totalQuantity,
      subtotalCents,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
