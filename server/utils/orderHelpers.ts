import { prisma } from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

export const ORDER_STATUSES = [
  "Placed",
  "Confirmed",
  "Assigned",
  "Packed",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
] as const;

export const TERMINAL_STATUSES: string[] = ["Delivered", "Cancelled"];
export const ACTIVE_DELIVERY_STATUSES = ["Assigned", "Packed", "Out for Delivery"];

// A customer can cancel their own order up until the store starts packing it.
// After that, packing/picking may already be underway, so it goes through support/admin.
export const CUSTOMER_CANCELLABLE_STATUSES = ["Placed", "Confirmed", "Assigned"];

/** Card orders that were never paid are hidden everywhere (they are abandoned checkouts). */
export const visibleOrdersFilter: Prisma.OrderWhereInput = {
  NOT: [{ paymentMethod: "card", isPaid: false }],
};

/** Returns a new statusHistory array with one more entry (never mutates the original). */
export function appendHistory(current: unknown, status: string, note: string): any[] {
  const list = Array.isArray(current) ? [...current] : [];
  list.push({ status, note, timestamp: new Date() });
  return list;
}


export async function releaseOrderResources(orderId: string): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const claimed = await tx.order.updateMany({
      where: { id: orderId, stockReserved: true },
      data: { stockReserved: false },
    });
    if (claimed.count === 0) return false;

    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order) return false;

    const items = Array.isArray(order.items) ? (order.items as any[]) : [];
    for (const item of items) {
      if (!item?.product || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
      await tx.product.updateMany({
        where: { id: item.product },
        data: { stock: { increment: item.quantity } },
      });
    }

    if (order.couponCode) {
      await tx.$executeRaw`UPDATE "Coupon" SET "usedCount" = GREATEST("usedCount" - 1, 0) WHERE "code" = ${order.couponCode}`;
    }
    return true;
  });
}

/** Marks a card order as paid. Returns true only for the call that actually flipped it. */
export async function markOrderPaid(orderId: string): Promise<boolean> {
  const result = await prisma.order.updateMany({
    where: { id: orderId, isPaid: false },
    data: { isPaid: true },
  });
  return result.count === 1;
}

/** Cleans up an unpaid card order: gives the stock back, then removes the order. */
export async function abandonUnpaidOrder(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.isPaid || order.paymentMethod !== "card") return;
  await releaseOrderResources(orderId);
  await prisma.order.deleteMany({ where: { id: orderId, isPaid: false } });
}
