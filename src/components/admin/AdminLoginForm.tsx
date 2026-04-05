"use client";

import { useActionState, useCallback, useRef, useState } from "react";
import { adminLogin } from "@/actions/adminAuth";

const LENGTH = 4;

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, {});
  const [digits, setDigits] = useState<string[]>(() => Array(LENGTH).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const setAt = useCallback((index: number, value: string) => {
    const d = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = d;
      return next;
    });
    if (d && index < LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }, []);

  const onKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    },
    [digits],
  );

  const onPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    const next = Array(LENGTH)
      .fill("")
      .map((_, i) => pasted[i] ?? "");
    setDigits(next);
    const focusIndex = Math.min(pasted.length, LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  }, []);

  const pinValue = digits.join("");
  const canSubmit = pinValue.length === LENGTH;

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <input type="hidden" name="pin" value={pinValue} readOnly />

      <div className="flex flex-col items-center gap-3">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-2xl font-semibold text-white shadow-lg ring-2 ring-rose-400/30"
          aria-hidden
        >
          GM
        </div>
        <p className="text-center text-sm text-zinc-400">
          Enter admin PIN to continue
        </p>
        <div
          className="flex justify-center gap-2 sm:gap-3"
          onPaste={onPaste}
        >
          {Array.from({ length: LENGTH }, (_, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="password"
              inputMode="numeric"
              autoComplete="off"
              autoFocus={i === 0}
              maxLength={1}
              value={digits[i]}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              aria-label={`Digit ${i + 1} of ${LENGTH}`}
              className="h-12 w-10 rounded-lg border border-zinc-600 bg-zinc-950 text-center font-mono text-xl text-white outline-none ring-rose-500/50 transition focus:border-rose-500 focus:ring-2 sm:h-14 sm:w-12 sm:text-2xl"
            />
          ))}
        </div>
      </div>

      {state?.error ? (
        <p className="text-center text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || !canSubmit}
        className="w-full rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "Signing in…" : "Continue"}
      </button>
      {process.env.NODE_ENV !== "production" ? (
        <p className="text-center text-xs text-zinc-600">
          Dev default PIN: <span className="font-mono text-zinc-500">0000</span>{" "}
          (set <span className="font-mono">ADMIN_PIN</span> on the server for
          production).
        </p>
      ) : (
        <p className="text-center text-xs text-zinc-600">
          Enter the PIN configured for this store.
        </p>
      )}
    </form>
  );
}
