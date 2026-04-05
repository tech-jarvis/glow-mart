"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendNewOrderEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

const lineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

const checkoutSchema = z
  .object({
    customerPhone: z.string().trim().min(5, "Phone number is required"),
    customerEmail: z.string().trim().optional(),
    addressLine1: z.string().trim().min(3, "Address is required"),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().optional(),
    postalCode: z.string().trim().optional(),
    country: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  })
  .superRefine((val, ctx) => {
    const e = val.customerEmail;
    if (e && e.length > 0) {
      const r = z.string().email().safeParse(e);
      if (!r.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid email address",
          path: ["customerEmail"],
        });
      }
    }
  });

export type CheckoutLineInput = z.infer<typeof lineSchema>;

export async function submitOrder(
  lines: CheckoutLineInput[],
  raw: z.infer<typeof checkoutSchema>,
): Promise<{ ok: false; error: string } | { ok: true; orderId: string }> {
  const parsedLines = z.array(lineSchema).safeParse(lines);
  if (!parsedLines.success || parsedLines.data.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const fields = checkoutSchema.safeParse(raw);
  if (!fields.success) {
    const flat = fields.error.flatten();
    const first =
      flat.fieldErrors.customerEmail?.[0] ??
      flat.fieldErrors.customerPhone?.[0] ??
      flat.fieldErrors.addressLine1?.[0] ??
      flat.formErrors[0] ??
      "Please check your details.";
    return { ok: false, error: first };
  }

  const data = fields.data;
  const email =
    data.customerEmail && data.customerEmail.length > 0
      ? data.customerEmail
      : null;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const productIds = [...new Set(parsedLines.data.map((l) => l.productId))];
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, active: true },
      });
      const byId = new Map(products.map((p) => [p.id, p]));

      let orderTotalCents = 0;
      const orderItems: {
        productId: string;
        quantity: number;
        priceCentsSnapshot: number;
        nameSnapshot: string;
        lineTotalCents: number;
      }[] = [];

      for (const line of parsedLines.data) {
        const p = byId.get(line.productId);
        if (!p) {
          throw new Error("A product in your cart is no longer available.");
        }
        if (p.stock < line.quantity) {
          throw new Error(`Not enough stock for “${p.name}”.`);
        }
        const lineTotalCents = p.priceCents * line.quantity;
        orderTotalCents += lineTotalCents;
        orderItems.push({
          productId: p.id,
          quantity: line.quantity,
          priceCentsSnapshot: p.priceCents,
          nameSnapshot: p.name,
          lineTotalCents,
        });
      }

      const created = await tx.order.create({
        data: {
          customerPhone: data.customerPhone,
          customerEmail: email,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || null,
          city: data.city || null,
          postalCode: data.postalCode || null,
          country: data.country || null,
          notes: data.notes || null,
          items: {
            create: orderItems.map(
              ({ productId, quantity, priceCentsSnapshot, nameSnapshot }) => ({
                productId,
                quantity,
                priceCentsSnapshot,
                nameSnapshot,
              }),
            ),
          },
        },
        include: { items: true },
      });

      for (const line of parsedLines.data) {
        await tx.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: line.quantity } },
        });
      }

      return { created, orderItems, orderTotalCents };
    });

    revalidatePath("/admin/orders");

    await sendNewOrderEmail({
      orderId: order.created.id,
      customerPhone: order.created.customerPhone,
      customerEmail: order.created.customerEmail,
      addressLine1: order.created.addressLine1,
      addressLine2: order.created.addressLine2,
      city: order.created.city,
      postalCode: order.created.postalCode,
      country: order.created.country,
      items: order.orderItems.map((i) => ({
        name: i.nameSnapshot,
        quantity: i.quantity,
        lineTotalCents: i.lineTotalCents,
      })),
      orderTotalCents: order.orderTotalCents,
    });

    return { ok: true, orderId: order.created.id };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not place order.";
    return { ok: false, error: message };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}
