"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import {
  clearAdminCookie,
  setAdminCookie,
  signAdminToken,
} from "@/lib/auth";

export async function adminLogin(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (!hash) {
    return { error: "Server is not configured for admin login." };
  }

  const ok = await bcrypt.compare(password, hash);
  if (!ok) {
    return { error: "Invalid password." };
  }

  const token = await signAdminToken();
  await setAdminCookie(token);
  redirect("/admin");
}

export async function adminLogout() {
  await clearAdminCookie();
  redirect("/admin/login");
}
