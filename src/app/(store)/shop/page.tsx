import { ProductCard } from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Shop",
};

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-rose-950">
        Shop
      </h1>
      <p className="mt-2 max-w-2xl text-rose-800">
        Beauty, watches, jewellery, and more—handpicked for Glow Mart.
      </p>
      {products.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-rose-200 bg-white px-6 py-12 text-center text-rose-800">
          We&apos;re stocking the shelves. Check back soon, or visit the admin
          panel to publish products.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
