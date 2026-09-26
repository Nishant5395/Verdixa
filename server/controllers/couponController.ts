import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/errors.js";
import { evaluateCoupon } from "../utils/coupon.js";

const codeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9_-]{3,20}$/, "Code must be 3-20 characters: letters, numbers, - or _");

// Note: no .default() here on purpose. The same field list is reused (as .partial()) for
// updates, and a default would silently reset untouched fields when editing a coupon.
const fields = {
  code: codeSchema,
  description: z.string().trim().max(200),
  discountType: z.enum(["PERCENT", "FLAT"], { message: "Discount type must be PERCENT or FLAT" }),
  discountValue: z.coerce.number().positive("Discount value must be greater than 0"),
  minOrderValue: z.coerce.number().min(0),
  maxDiscount: z.coerce.number().positive().nullable(),
  usageLimit: z.coerce.number().int().positive().nullable(),
  perUserLimit: z.coerce.number().int().min(1),
  firstOrderOnly: z.boolean(),
  startsAt: z.coerce.date().nullable(),
  expiresAt: z.coerce.date().nullable(),
  isActive: z.boolean(),
};

const createSchema = z.object({
  code: fields.code,
  discountType: fields.discountType,
  discountValue: fields.discountValue,
  description: fields.description.optional(),
  minOrderValue: fields.minOrderValue.optional(),
  maxDiscount: fields.maxDiscount.optional(),
  usageLimit: fields.usageLimit.optional(),
  perUserLimit: fields.perUserLimit.optional(),
  firstOrderOnly: fields.firstOrderOnly.optional(),
  startsAt: fields.startsAt.optional(),
  expiresAt: fields.expiresAt.optional(),
  isActive: fields.isActive.optional(),
});

const updateSchema = z.object(fields).partial();

/** Cross-field rules, checked on the final (merged) values. */
function checkRules(c: {
  discountType?: string | null;
  discountValue?: number | null;
  startsAt?: Date | null;
  expiresAt?: Date | null;
}) {
  if (c.discountType === "PERCENT" && (c.discountValue ?? 0) > 100) {
    throw new HttpError(400, "A percentage discount can't be more than 100");
  }
  if (c.startsAt && c.expiresAt && c.expiresAt <= c.startsAt) {
    throw new HttpError(400, "Expiry date must be after the start date");
  }
}

const isDuplicate = (error: any) => error?.code === "P2002";

// GET /api/coupons/available  (any logged in customer)
// Coupons this user can actually use right now, for the "Available offers" list at checkout.
export const getAvailableCoupons = async (req: Request, res: Response) => {
  const now = new Date();
  const candidates = await prisma.coupon.findMany({
    where: {
      isActive: true,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const usable = [];
  for (const c of candidates) {
    // A huge subtotal means only user-specific rules (first order, per-user limit, usage limit) can fail
    const result = await evaluateCoupon(prisma, c.code, req.user!.id, Number.MAX_SAFE_INTEGER / 1e6);
    if (result.valid) {
      usable.push({
        code: c.code,
        description: c.description,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderValue: c.minOrderValue,
        maxDiscount: c.maxDiscount,
        firstOrderOnly: c.firstOrderOnly,
        expiresAt: c.expiresAt,
      });
    }
  }
  res.json({ coupons: usable });
};

// GET /api/coupons  (admin)
export const getAllCoupons = async (_req: Request, res: Response) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ coupons });
};

// POST /api/coupons  (admin)
export const createCoupon = async (req: Request, res: Response) => {
  const data = createSchema.parse(req.body);
  checkRules(data);
  try {
    const coupon = await prisma.coupon.create({ data });
    res.status(201).json({ coupon });
  } catch (error) {
    if (isDuplicate(error)) throw new HttpError(409, "A coupon with this code already exists");
    throw error;
  }
};

// PUT /api/coupons/:id  (admin)
export const updateCoupon = async (req: Request, res: Response) => {
  const data = updateSchema.parse(req.body);
  const existing = await prisma.coupon.findUnique({ where: { id: req.params.id as string } });
  if (!existing) throw new HttpError(404, "Coupon not found");

  checkRules({
    discountType: data.discountType ?? existing.discountType,
    discountValue: data.discountValue ?? existing.discountValue,
    startsAt: data.startsAt === undefined ? existing.startsAt : data.startsAt,
    expiresAt: data.expiresAt === undefined ? existing.expiresAt : data.expiresAt,
  });

  try {
    const coupon = await prisma.coupon.update({ where: { id: existing.id }, data });
    res.json({ coupon });
  } catch (error) {
    if (isDuplicate(error)) throw new HttpError(409, "A coupon with this code already exists");
    throw error;
  }
};

// DELETE /api/coupons/:id  (admin)
// Past orders only store the coupon code as text, so deleting a coupon never breaks them.
export const deleteCoupon = async (req: Request, res: Response) => {
  const existing = await prisma.coupon.findUnique({ where: { id: req.params.id as string } });
  if (!existing) throw new HttpError(404, "Coupon not found");
  await prisma.coupon.delete({ where: { id: existing.id } });
  res.json({ message: "Coupon deleted" });
};
