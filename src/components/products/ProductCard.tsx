import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/money";

export type ProductCardProduct = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl: string | null;
  category: string | null;
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition hover:border-rose-200 hover:shadow-md"
    >
      <div className="relative aspect-[4/5] bg-rose-50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-rose-400">
            No image
          </div>
        )}
        {product.category ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-rose-800 shadow-sm backdrop-blur">
            {product.category}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h2 className="font-medium text-rose-950 line-clamp-2">{product.name}</h2>
        <p className="text-sm font-semibold text-rose-700">
          {formatMoney(product.priceCents)}
        </p>
      </div>
    </Link>
  );
}
