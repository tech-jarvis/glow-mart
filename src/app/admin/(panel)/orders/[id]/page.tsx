import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  const total = order.items.reduce(
    (s, i) => s + i.priceCentsSnapshot * i.quantity,
    0,
  );

  const phoneHref = `tel:${order.customerPhone.replace(/\s/g, "")}`;
  const emailHref = order.customerEmail
    ? `mailto:${order.customerEmail}`
    : null;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="text-sm text-zinc-400 hover:text-white"
      >
        ← Orders
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Order{" "}
            <span className="font-mono text-lg text-zinc-400">
              {order.id.slice(0, 8)}…
            </span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Placed {order.createdAt.toLocaleString()}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Customer
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-zinc-500">Phone</dt>
              <dd className="mt-0.5">
                <a
                  href={phoneHref}
                  className="font-medium text-rose-400 hover:underline"
                >
                  {order.customerPhone}
                </a>
                <span className="ml-2 text-xs text-zinc-600">(tap to call)</span>
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Email</dt>
              <dd className="mt-0.5">
                {emailHref ? (
                  <a
                    href={emailHref}
                    className="font-medium text-rose-400 hover:underline"
                  >
                    {order.customerEmail}
                  </a>
                ) : (
                  <span className="text-zinc-400">Not provided</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Shipping address
          </h2>
          <address className="mt-4 not-italic text-sm leading-relaxed text-zinc-200">
            {order.addressLine1}
            <br />
            {order.addressLine2 ? (
              <>
                {order.addressLine2}
                <br />
              </>
            ) : null}
            {[order.city, order.postalCode].filter(Boolean).join(", ")}
            <br />
            {order.country}
          </address>
        </div>
      </div>

      {order.notes ? (
        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-medium text-zinc-500">Notes</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-zinc-200">
            {order.notes}
          </p>
        </div>
      ) : null}

      <div className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Line items
        </h2>
        <ul className="mt-4 divide-y divide-zinc-800 rounded-xl border border-zinc-800">
          {order.items.map((i) => (
            <li
              key={i.id}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
            >
              <span className="text-white">{i.nameSnapshot}</span>
              <span className="text-zinc-400">
                × {i.quantity} ·{" "}
                {formatMoney(i.priceCentsSnapshot * i.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-right text-lg font-semibold text-white">
          Total {formatMoney(total)}
        </p>
      </div>
    </div>
  );
}
