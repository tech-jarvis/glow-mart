import { CartPageClient } from "./CartPageClient";

export const metadata = { title: "Your bag" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-rose-950">
        Your bag
      </h1>
      <CartPageClient />
    </div>
  );
}
