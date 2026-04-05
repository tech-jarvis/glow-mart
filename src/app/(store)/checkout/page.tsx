import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-rose-950">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-rose-800">
        Phone number and address are required. Email helps us send updates but
        is optional.
      </p>
      <div className="mt-8 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
