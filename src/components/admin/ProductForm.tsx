import { createProduct, updateProduct } from "@/actions/adminProducts";
import type { Product } from "@prisma/client";

function rupeesFromCents(cents: number) {
  return (cents / 100).toFixed(2);
}

export function ProductForm({
  product,
}: {
  product?: Product;
}) {
  const isEdit = Boolean(product);
  const action = isEdit
    ? updateProduct.bind(null, product!.id)
    : createProduct;

  return (
    <form action={action} className="max-w-xl space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-zinc-300">Name</span>
        <input
          name="name"
          required
          defaultValue={product?.name}
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none ring-rose-500/40 focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-300">Description</span>
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={product?.description}
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none ring-rose-500/40 focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-300">
          Price (INR, rupees)
        </span>
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={product ? rupeesFromCents(product.priceCents) : ""}
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none ring-rose-500/40 focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-300">
          Image URL (optional)
        </span>
        <input
          name="imageUrl"
          type="url"
          defaultValue={product?.imageUrl ?? ""}
          placeholder="https://images.unsplash.com/..."
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none ring-rose-500/40 focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-300">Category</span>
        <input
          name="category"
          defaultValue={product?.category ?? ""}
          placeholder="Jewellery, Beauty, Watches…"
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none ring-rose-500/40 focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-zinc-300">Stock</span>
        <input
          name="stock"
          type="number"
          min="0"
          required
          defaultValue={product?.stock ?? 0}
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none ring-rose-500/40 focus:ring-2"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input
          name="active"
          type="checkbox"
          defaultChecked={product?.active ?? true}
          className="rounded border-zinc-600"
        />
        Visible in store
      </label>
      <button
        type="submit"
        className="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-500"
      >
        {isEdit ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
