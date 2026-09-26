import type { Coupon, Prisma } from "../generated/prisma/client.js";
import { round2 } from "../config/pricing.js";

// Works with both the normal prisma client and a transaction client.
type Db = Prisma.TransactionClient;

export const normalizeCouponCode = (code: unknown) => String(code ?? "").trim().toUpperCase();

export type CouponResult =
  | { valid: true; coupon: Coupon; discount: number }
  | { valid: false; message: string };

const invalid = (message: string): CouponResult => ({ valid: false, message });

/** Orders that count towards "first order" / per-user limits (not cancelled, not abandoned). */
const countedOrders: Prisma.OrderWhereInput = {
  status: { not: "Cancelled" },
  NOT: [{ paymentMethod: "card", isPaid: false }],
};

/**
 * Checks a coupon against a cart subtotal for one user and works out the discount.
 * The subtotal must be computed on the server from database prices, never taken from the client.
 */
export async function evaluateCoupon(
  db: Db,
  code: unknown,
  userId: string,
  subtotal: number
): Promise<CouponResult> {
  const normalized = normalizeCouponCode(code);
  if (!normalized) return invalid("Enter a coupon code");

  const coupon = await db.coupon.findUnique({ where: { code: normalized } });
  if (!coupon || !coupon.isActive) return invalid("Invalid coupon code");

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) return invalid("This coupon is not active yet");
  if (coupon.expiresAt && coupon.expiresAt < now) return invalid("This coupon has expired");
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return invalid("This coupon has been fully redeemed");
  }
  if (subtotal < coupon.minOrderValue) {
    return invalid(`Add items worth ${round2(coupon.minOrderValue - subtotal)} more to use this coupon`);
  }

  if (coupon.firstOrderOnly) {
    const previous = await db.order.count({ where: { userId, ...countedOrders } });
    if (previous > 0) return invalid("This coupon is only valid on your first order");
  }

  const timesUsed = await db.order.count({
    where: { userId, couponCode: coupon.code, ...countedOrders },
  });
  if (timesUsed >= coupon.perUserLimit) return invalid("You have already used this coupon");

  let discount =
    coupon.discountType === "FLAT" ? coupon.discountValue : (subtotal * coupon.discountValue) / 100;
  if (coupon.maxDiscount !== null && coupon.maxDiscount > 0) {
    discount = Math.min(discount, coupon.maxDiscount);
  }
  discount = round2(Math.min(discount, subtotal));
  if (discount <= 0) return invalid("This coupon does not apply to your cart");

  return { valid: true, coupon, discount };
}

/**
 * Atomically counts one redemption. Returns false if the usage limit was hit in the
 * meantime (two people redeeming the last use at the same moment).
 */
export async function redeemCoupon(db: Db, couponId: string): Promise<boolean> {
  const affected = await db.$executeRaw`
    UPDATE "Coupon"
    SET "usedCount" = "usedCount" + 1
    WHERE "id" = ${couponId}
      AND ("usageLimit" IS NULL OR "usedCount" < "usageLimit")`;
  return affected === 1;
}
