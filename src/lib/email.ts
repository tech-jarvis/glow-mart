import { Resend } from "resend";
import { formatMoney } from "./money";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendNewOrderEmail(input: {
  orderId: string;
  customerPhone: string;
  customerEmail: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  items: { name: string; quantity: number; lineTotalCents: number }[];
  orderTotalCents: number;
}) {
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!to) {
    console.warn("ORDER_NOTIFY_EMAIL not set; skipping order email");
    return { sent: false as const, reason: "no_recipient" };
  }
  if (!resend) {
    console.warn("RESEND_API_KEY not set; skipping order email");
    return { sent: false as const, reason: "no_resend" };
  }

  const from =
    process.env.RESEND_FROM ?? "Glow Mart <onboarding@resend.dev>";

  const lines = input.items
    .map(
      (i) =>
        `• ${i.name} × ${i.quantity} — ${formatMoney(i.lineTotalCents)}`,
    )
    .join("\n");

  const address = [
    input.addressLine1,
    input.addressLine2,
    [input.city, input.postalCode].filter(Boolean).join(" "),
    input.country,
  ]
    .filter(Boolean)
    .join("\n");

  const subject = `New order #${input.orderId.slice(0, 8)} — Glow Mart`;
  const text = [
    `New order on Glow Mart`,
    ``,
    `Order ID: ${input.orderId}`,
    `Phone: ${input.customerPhone}`,
    input.customerEmail ? `Email: ${input.customerEmail}` : `Email: (not provided)`,
    ``,
    `Shipping address:`,
    address,
    ``,
    `Items:`,
    lines,
    ``,
    `Total: ${formatMoney(input.orderTotalCents)}`,
  ].join("\n");

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    text,
  });

  if (error) {
    console.error("Resend error:", error);
    return { sent: false as const, reason: "resend_error", error };
  }

  return { sent: true as const };
}
