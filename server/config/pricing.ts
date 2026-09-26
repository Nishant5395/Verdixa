
const readNumber = (value: string | undefined, fallback: number) => {
  if (value === undefined || value.trim() === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

export const getPricing = () => ({
  currency: (process.env.CURRENCY || "usd").trim().toLowerCase(),
  taxRate: readNumber(process.env.TAX_RATE, 0.08),
  deliveryFee: readNumber(process.env.DELIVERY_FEE, 1.99),
  freeDeliveryThreshold: readNumber(process.env.FREE_DELIVERY_THRESHOLD, 20),
});

export const MAX_QTY_PER_ITEM = 50;

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Discount is applied to the subtotal first; delivery threshold and tax are then
 * calculated on the discounted amount.
 */
export function computeTotals(subtotal: number, discount: number) {
  const p = getPricing();
  const sub = round2(subtotal);
  const disc = Math.min(round2(Math.max(discount, 0)), sub);
  const taxable = round2(sub - disc);
  const deliveryFee = taxable > p.freeDeliveryThreshold ? 0 : p.deliveryFee;
  const tax = round2(taxable * p.taxRate);
  const total = round2(taxable + deliveryFee + tax);
  return { subtotal: sub, discount: disc, deliveryFee, tax, total };
}
