"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateOrderStatus } from "@/actions/orders";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const known = STATUSES.some((s) => s.value === status);

  return (
    <label className="block text-sm text-zinc-400">
      Order status
      <select
        key={status}
        defaultValue={status}
        disabled={pending}
        onChange={(e) => {
          const v = e.target.value;
          startTransition(async () => {
            await updateOrderStatus(orderId, v);
            router.refresh();
          });
        }}
        className="mt-1 block w-full max-w-xs rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none ring-rose-500/40 focus:ring-2 disabled:opacity-50"
      >
        {!known ? (
          <option value={status} className="capitalize">
            {status}
          </option>
        ) : null}
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {pending ? (
        <span className="mt-1 block text-xs text-zinc-500">Saving…</span>
      ) : null}
    </label>
  );
}
