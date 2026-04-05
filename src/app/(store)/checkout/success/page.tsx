import Link from "next/link";

type Props = { searchParams: Promise<{ order?: string }> };

export const metadata = { title: "Order placed" };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;
  const short = order ? order.slice(0, 8) : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl"
        aria-hidden
      >
        ✓
      </div>
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-semibold text-rose-950">
        Thank you!
      </h1>
      <p className="mt-3 text-rose-800">
        Your order has been placed. We&apos;ll contact you soon to confirm
        delivery and payment.
      </p>
      {short ? (
        <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-900">
          Reference: <span className="font-mono font-medium">{short}…</span>
        </p>
      ) : null}
      <p className="mt-4 text-xs text-rose-600">
        The store owner receives an email notification for each new order when
        Resend is configured.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
      >
        Back to shop
      </Link>
    </div>
  );
}
