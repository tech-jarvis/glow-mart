/** Prices are stored in the smallest unit (paisa; 100 = 1 PKR), same as before. */
export function formatMoney(cents: number, currency = "PKR"): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
