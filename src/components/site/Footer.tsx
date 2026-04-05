import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-rose-100 bg-rose-50/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-medium text-rose-950">Glow Mart</p>
          <p className="mt-1 max-w-md text-sm text-rose-800/80">
            Curated accessories and beauty picks. Questions about an order?
            We&apos;ll reach out from the details you share at checkout.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-rose-800">
          <Link href="/shop" className="underline-offset-4 hover:underline">
            Shop
          </Link>
          <a
            href="mailto:support@glowmartofficial.com"
            className="underline-offset-4 hover:underline"
          >
            support@glowmartofficial.com
          </a>
        </div>
      </div>
      <div className="border-t border-rose-100/80 py-4 text-center text-xs text-rose-600">
        © {new Date().getFullYear()} Glow Mart · glowmartofficial.com
      </div>
    </footer>
  );
}
