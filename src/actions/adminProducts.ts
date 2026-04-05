"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/slug";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

function parsePriceToCents(raw: string): number {
  const n = Number.parseFloat(raw.replace(/,/g, ""));
  if (!Number.isFinite(n) || n < 0) {
    throw new Error("Invalid price");
  }
  return Math.round(n * 100);
}

async function uniqueSlug(base: string, excludeId?: string) {
  const slug = slugify(base) || "product";
  let candidate = slug;
  let n = 2;
  for (;;) {
    const existing = await prisma.product.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${slug}-${n}`;
    n += 1;
  }
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceCents = parsePriceToCents(String(formData.get("price") ?? ""));
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim() || null;
  const stock = Number.parseInt(String(formData.get("stock") ?? "0"), 10);
  const active = formData.get("active") === "on";

  if (!name || !description) {
    throw new Error("Name and description are required");
  }

  const slug = await uniqueSlug(name);
  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      priceCents,
      imageUrl,
      category,
      stock: Number.isFinite(stock) ? Math.max(0, stock) : 0,
      active,
    },
  });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceCents = parsePriceToCents(String(formData.get("price") ?? ""));
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim() || null;
  const stock = Number.parseInt(String(formData.get("stock") ?? "0"), 10);
  const active = formData.get("active") === "on";

  if (!name || !description) {
    throw new Error("Name and description are required");
  }

  const slug = await uniqueSlug(name, id);
  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      priceCents,
      imageUrl,
      category,
      stock: Number.isFinite(stock) ? Math.max(0, stock) : 0,
      active,
    },
  });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
