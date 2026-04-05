import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/money";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Products</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Add, edit, or hide items in the storefront.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
        >
          New product
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.map((p) => (
              <tr key={p.id} className="bg-zinc-900/40">
                <td className="px-4 py-3 text-white">{p.name}</td>
                <td className="px-4 py-3 text-zinc-300">
                  {formatMoney(p.priceCents)}
                </td>
                <td className="px-4 py-3 text-zinc-300">{p.stock}</td>
                <td className="px-4 py-3">
                  {p.active ? (
                    <span className="text-emerald-400">Live</span>
                  ) : (
                    <span className="text-zinc-500">Hidden</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-rose-400 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 ? (
          <p className="px-4 py-10 text-center text-zinc-500">
            No products yet.{" "}
            <Link href="/admin/products/new" className="text-rose-400 underline">
              Create one
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
