"use client";

import { useCart } from "@/components/cart/CartProvider";

export function CartBadge() {
  const { totalQuantity } = useCart();
  if (totalQuantity <= 0) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
      {totalQuantity > 99 ? "99+" : totalQuantity}
    </span>
  );
}
