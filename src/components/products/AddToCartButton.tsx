"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

type Props = {
  productId: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl: string | null;
  stock: number;
};

export function AddToCartButton({
  productId,
  name,
  slug,
  priceCents,
  imageUrl,
  stock,
}: Props) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);

  if (stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className="w-full rounded-full bg-rose-100 px-6 py-3 text-sm font-medium text-rose-400"
      >
        Out of stock
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        addLine({
          productId,
          name,
          slug,
          priceCents,
          imageUrl,
          stock,
          quantity: 1,
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 2000);
      }}
      className="w-full rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
    >
      {added ? "Added to bag ✓" : "Add to bag"}
    </button>
  );
}
