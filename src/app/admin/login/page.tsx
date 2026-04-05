import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = { title: "Admin sign in · Glow Mart" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <h1 className="text-xl font-semibold text-white">Glow Mart admin</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Who&apos;s managing the store?
        </p>
        <AdminLoginForm />
        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
