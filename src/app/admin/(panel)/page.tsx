import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, newOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "new" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Quick overview of Glow Mart.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Products</p>
          <p className="mt-1 text-3xl font-semibold text-white">
            {productCount}
          </p>
          <Link
            href="/admin/products"
            className="mt-3 inline-block text-sm text-rose-400 hover:underline"
          >
            Manage →
          </Link>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Orders</p>
          <p className="mt-1 text-3xl font-semibold text-white">
            {orderCount}
          </p>
          <Link
            href="/admin/orders"
            className="mt-3 inline-block text-sm text-rose-400 hover:underline"
          >
            View orders →
          </Link>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">New orders</p>
          <p className="mt-1 text-3xl font-semibold text-amber-400">
            {newOrders}
          </p>
          <p className="mt-3 text-xs text-zinc-500">
            Status &quot;new&quot; — follow up with customers.
          </p>
        </div>
      </div>
    </div>
  );
}
