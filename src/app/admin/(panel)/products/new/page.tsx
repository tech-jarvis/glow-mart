import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <Link
        href="/admin/products"
        className="text-sm text-zinc-400 hover:text-white"
      >
        ← Products
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-white">New product</h1>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
