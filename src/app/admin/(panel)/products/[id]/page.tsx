import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProduct } from "@/actions/adminProducts";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const del = deleteProduct.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-sm text-zinc-400 hover:text-white"
      >
        ← Products
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-white">Edit product</h1>
        <form action={del}>
          <button
            type="submit"
            className="rounded-lg border border-red-900/80 bg-red-950/50 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-950"
          >
            Delete
          </button>
        </form>
      </div>
      <p className="mt-1 text-sm text-zinc-500">
        Store URL:{" "}
        <Link
          href={`/product/${product.slug}`}
          className="text-rose-400 hover:underline"
        >
          /product/{product.slug}
        </Link>
      </p>
      <div className="mt-8">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
