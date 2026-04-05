import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, active: true },
  });
  if (!product) return { title: "Product" };
  return {
    title: `${product.name} · Glow Mart`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, active: true },
  });
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/shop"
        className="text-sm font-medium text-rose-700 underline-offset-4 hover:underline"
      >
        ← Back to shop
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-rose-100 bg-rose-50">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-rose-400">
              No image
            </div>
          )}
        </div>
        <div>
          {product.category ? (
            <p className="text-sm font-medium uppercase tracking-wide text-rose-600">
              {product.category}
            </p>
          ) : null}
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-rose-950 sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-rose-800">
            {formatMoney(product.priceCents)}
          </p>
          <p className="mt-6 whitespace-pre-line text-rose-900/90">
            {product.description}
          </p>
          <p className="mt-4 text-sm text-rose-700">
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Currently out of stock"}
          </p>
          <div className="mt-8 max-w-md">
            <AddToCartButton
              productId={product.id}
              name={product.name}
              slug={product.slug}
              priceCents={product.priceCents}
              imageUrl={product.imageUrl}
              stock={product.stock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
