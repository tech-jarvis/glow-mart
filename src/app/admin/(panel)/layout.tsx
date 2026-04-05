import Link from "next/link";
import { adminLogout } from "@/actions/adminAuth";

export const dynamic = "force-dynamic";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b border-zinc-800 bg-zinc-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <span className="text-zinc-400">Admin · Glow Mart</span>
            <Link href="/admin" className="text-white hover:underline">
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="text-zinc-300 hover:text-white"
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="text-zinc-300 hover:text-white"
            >
              Orders
            </Link>
            <Link href="/" className="text-zinc-500 hover:text-zinc-300">
              View store
            </Link>
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </>
  );
}
