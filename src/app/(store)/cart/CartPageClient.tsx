"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/money";

export function CartPageClient() {
  const { lines, setQuantity, removeLine, subtotalCents } = useCart();

  if (lines.length === 0) {
    return (
      <p className="mt-8 rounded-2xl border border-dashed border-rose-200 bg-white px-6 py-12 text-center text-rose-800">
        Your bag is empty.{" "}
        <Link href="/shop" className="font-medium text-rose-700 underline">
          Browse the shop
        </Link>
      </p>
    );
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-3">
      <ul className="space-y-4 lg:col-span-2">
        {lines.map((line) => (
          <li
            key={line.productId}
            className="flex gap-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm"
          >
            <Link
              href={`/product/${line.slug}`}
              className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-rose-50"
            >
              {line.imageUrl ? (
                <Image
                  src={line.imageUrl}
                  alt={line.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-xs text-rose-400">
                  —
                </span>
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${line.slug}`}
                className="font-medium text-rose-950 hover:underline"
              >
                {line.name}
              </Link>
              <p className="mt-1 text-sm text-rose-700">
                {formatMoney(line.priceCents)} each
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-rose-800">
                  Qty
                  <input
                    type="number"
                    min={1}
                    max={line.stock}
                    value={line.quantity}
                    onChange={(e) =>
                      setQuantity(
                        line.productId,
                        Number.parseInt(e.target.value, 10) || 1,
                      )
                    }
                    className="w-16 rounded-lg border border-rose-200 px-2 py-1"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeLine(line.productId)}
                  className="text-sm font-medium text-rose-600 underline-offset-2 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-right text-sm font-semibold text-rose-900">
              {formatMoney(line.priceCents * line.quantity)}
            </div>
          </li>
        ))}
      </ul>
      <div className="h-fit rounded-2xl border border-rose-100 bg-rose-50/60 p-6">
        <p className="text-sm text-rose-800">Subtotal</p>
        <p className="mt-1 text-2xl font-semibold text-rose-950">
          {formatMoney(subtotalCents)}
        </p>
        <p className="mt-2 text-xs text-rose-700">
          Shipping &amp; payment collection can be coordinated after we confirm
          your order by phone or email.
        </p>
        <Link
          href="/checkout"
          className="mt-6 flex w-full items-center justify-center rounded-full bg-rose-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
        >
          Checkout
        </Link>
        <Link
          href="/shop"
          className="mt-3 block text-center text-sm font-medium text-rose-700 underline-offset-2 hover:underline"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
