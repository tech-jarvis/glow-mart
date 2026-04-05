"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { submitOrder } from "@/actions/orders";
import { useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/money";

export function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotalCents, clear } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      customerPhone: String(fd.get("phone") ?? ""),
      customerEmail: String(fd.get("email") ?? ""),
      addressLine1: String(fd.get("addressLine1") ?? ""),
      addressLine2: String(fd.get("addressLine2") ?? ""),
      city: String(fd.get("city") ?? ""),
      postalCode: String(fd.get("postalCode") ?? ""),
      country: String(fd.get("country") ?? ""),
      notes: String(fd.get("notes") ?? ""),
    };
    const cartLines = lines.map((l) => ({
      productId: l.productId,
      quantity: l.quantity,
    }));

    startTransition(async () => {
      const res = await submitOrder(cartLines, payload);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      clear();
      router.push(
        `/checkout/success?order=${encodeURIComponent(res.orderId)}`,
      );
    });
  }

  if (lines.length === 0) {
    return (
      <p className="text-sm text-rose-800">
        Your bag is empty.{" "}
        <a href="/shop" className="font-medium text-rose-700 underline">
          Continue shopping
        </a>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-rose-950">
            Phone number <span className="text-red-600">*</span>
          </span>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-rose-950 outline-none ring-rose-400/30 focus:ring-2"
            placeholder="WhatsApp or mobile"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-rose-950">
            Email <span className="text-rose-400">(optional)</span>
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-rose-950 outline-none ring-rose-400/30 focus:ring-2"
            placeholder="you@example.com"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-rose-950">
            Address line 1 <span className="text-red-600">*</span>
          </span>
          <input
            name="addressLine1"
            required
            autoComplete="address-line1"
            className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-rose-950 outline-none ring-rose-400/30 focus:ring-2"
            placeholder="House / flat, street"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-rose-950">
            Address line 2 <span className="text-rose-400">(optional)</span>
          </span>
          <input
            name="addressLine2"
            autoComplete="address-line2"
            className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-rose-950 outline-none ring-rose-400/30 focus:ring-2"
            placeholder="Landmark, area"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-rose-950">City</span>
          <input
            name="city"
            autoComplete="address-level2"
            className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-rose-950 outline-none ring-rose-400/30 focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-rose-950">PIN code</span>
          <input
            name="postalCode"
            autoComplete="postal-code"
            className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-rose-950 outline-none ring-rose-400/30 focus:ring-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-rose-950">Country</span>
          <input
            name="country"
            autoComplete="country-name"
            defaultValue="India"
            className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-rose-950 outline-none ring-rose-400/30 focus:ring-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-rose-950">
            Order notes <span className="text-rose-400">(optional)</span>
          </span>
          <textarea
            name="notes"
            rows={3}
            className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-rose-950 outline-none ring-rose-400/30 focus:ring-2"
            placeholder="Delivery instructions, gift message…"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-rose-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-rose-800">
          Subtotal{" "}
          <span className="font-semibold text-rose-950">
            {formatMoney(subtotalCents)}
          </span>
        </p>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-rose-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60"
        >
          {pending ? "Placing order…" : "Place order"}
        </button>
      </div>
    </form>
  );
}
