import Link from "next/link";
import { CartBadge } from "./CartBadge";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rose-100/80 bg-[#fffafc]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-semibold tracking-wide text-rose-950">
            Glow Mart
          </span>
          <span className="text-xs text-rose-600/80">
            Beauty · Watches · Jewellery
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-rose-900">
          <Link
            href="/shop"
            className="rounded-full px-3 py-1.5 transition hover:bg-rose-100"
          >
            Shop
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full px-3 py-1.5 transition hover:bg-rose-100"
          >
            Cart
            <CartBadge />
          </Link>
        </nav>
      </div>
    </header>
  );
}
