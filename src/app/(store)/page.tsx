import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-[#fffafc] to-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-amber-100/50 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-600">
            Glow Mart
          </p>
          <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight text-rose-950 sm:text-5xl">
            Accessories that feel as good as they look
          </h1>
          <p className="mt-4 max-w-xl text-lg text-rose-800/90">
            Discover beauty essentials, delicate jewellery, and timeless
            watches—curated for everyday glow. New pieces arrive regularly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              Shop the collection
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-6 py-3 text-sm font-semibold text-rose-900 transition hover:border-rose-300"
            >
              View bag
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-rose-950">
              Featured picks
            </h2>
            <p className="mt-1 text-sm text-rose-700">
              A small taste of the store—add more from the admin panel anytime.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden text-sm font-medium text-rose-700 underline-offset-4 hover:underline sm:inline"
          >
            See all
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 px-6 py-12 text-center text-rose-800">
            No products yet. Sign in to{" "}
            <Link href="/admin/login" className="font-medium underline">
              admin
            </Link>{" "}
            to add your first items.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
