import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/money";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Orders</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Review details and contact customers by phone or email.
      </p>
      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {orders.map((o) => {
              const total = o.items.reduce(
                (s, i) => s + i.priceCentsSnapshot * i.quantity,
                0,
              );
              return (
                <tr key={o.id} className="bg-zinc-900/40">
                  <td className="px-4 py-3 text-zinc-300">
                    {o.createdAt.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    <div className="font-medium text-white">{o.customerPhone}</div>
                    {o.customerEmail ? (
                      <div className="text-xs text-zinc-500">{o.customerEmail}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    {o.items.reduce((s, i) => s + i.quantity, 0)} pcs
                  </td>
                  <td className="px-4 py-3 text-zinc-200">
                    {formatMoney(total)}
                  </td>
                  <td className="px-4 py-3 capitalize text-amber-400/90">
                    {o.status}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-rose-400 hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {orders.length === 0 ? (
          <p className="px-4 py-10 text-center text-zinc-500">
            No orders yet. They will appear here after customers check out.
          </p>
        ) : null}
      </div>
    </div>
  );
}
