"use client";

import { useActionState } from "react";
import { adminLogin } from "@/actions/adminAuth";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, {});

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-zinc-300">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white outline-none ring-rose-500/40 focus:ring-2"
        />
      </label>
      {state?.error ? (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
