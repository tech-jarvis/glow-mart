"use server";

import { timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import {
  clearAdminCookie,
  setAdminCookie,
  signAdminToken,
} from "@/lib/auth";

function normalizePin(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 12);
}

function pinsEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

export async function adminLogin(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const pin = normalizePin(String(formData.get("pin") ?? ""));
  const envPin = process.env.ADMIN_PIN;
  const expected = normalizePin(
    envPin === undefined || envPin.trim() === "" ? "0000" : envPin,
  );

  if (expected.length < 4 || expected.length > 12) {
    return { error: "Server is not configured for admin login." };
  }

  if (pin.length !== expected.length || !pinsEqual(pin, expected)) {
    return { error: "Wrong PIN. Try again." };
  }

  const token = await signAdminToken();
  await setAdminCookie(token);
  redirect("/admin");
}

export async function adminLogout() {
  await clearAdminCookie();
  redirect("/admin/login");
}
