import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import { HttpError } from "../utils/errors.js";
import { getCatalog, invalidateCatalog, rankCatalog } from "../utils/catalog.js";
import { normalizeText, scoreMatch } from "../utils/fuzzy.js";

const withDiscount = <T extends { price: number; originalPrice?: number | null }>(p: T) => {
  const discount =
    p.originalPrice && p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : 0;
  return { ...p, discount };
};

const asString = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const asNumber = (v: unknown) => {
  if (typeof v !== "string" || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

// Accepts every sort name the client uses (and the old ones) so nothing breaks.
const SORTS: Record<string, Prisma.ProductOrderByWithRelationInput[]> = {
  price_asc: [{ price: "asc" }],
  "price-low": [{ price: "asc" }],
  price_low: [{ price: "asc" }],
  price_desc: [{ price: "desc" }],
  "price-high": [{ price: "desc" }],
  price_high: [{ price: "desc" }],
  rating: [
    { rating: { sort: "desc", nulls: "last" } },
    { reviewCount: { sort: "desc", nulls: "last" } },
  ],
  name: [{ name: "asc" }],
  newest: [{ createdAt: "desc" }],
};
const DEFAULT_ORDER: Prisma.ProductOrderByWithRelationInput[] = [{ createdAt: "desc" }];

// GET /api/products/flash-deals
export const getFlashDeals = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { originalPrice: "desc" },
  });
  res.json({ products: products.map(withDiscount).slice(0, 8) });
};

/**
 * GET /api/products
 * Query: category, search, minPrice, maxPrice, organic=true, inStock=true, minRating,
 *        sort (price_asc | price_desc | rating | name | newest), page, limit
 *
 * - With `page`  -> paginated: { products, total, page, pages, limit }
 * - Without it   -> everything (max 500), exactly like before, so existing screens keep working
 * - With `search` -> ranked by relevance; if nothing matches, typos are tolerated and
 *                    `didYouMean` tells the client what was actually searched
 */
export const getProducts = async (req: Request, res: Response) => {
  const category = asString(req.query.category);
  const search = asString(req.query.search).slice(0, 80);
  const sort = asString(req.query.sort);
  const minPrice = asNumber(req.query.minPrice);
  const maxPrice = asNumber(req.query.maxPrice);
  const minRating = asNumber(req.query.minRating);

  const paginated = req.query.page !== undefined;
  const page = Math.max(1, Math.floor(asNumber(req.query.page) ?? 1));
  const limit = paginated
    ? Math.min(60, Math.max(1, Math.floor(asNumber(req.query.limit) ?? 12)))
    : 500;

  // Filters that don't depend on the search text
  const base: Prisma.ProductWhereInput = {};
  if (category && category !== "all") base.category = category;
  if (req.query.organic === "true") base.isOrganic = true;
  if (req.query.inStock === "true") base.stock = { gt: 0 };
  if (minRating !== undefined) base.rating = { gte: minRating };
  if (minPrice !== undefined || maxPrice !== undefined) {
    base.price = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
    };
  }

  const orderBy = SORTS[sort] ?? DEFAULT_ORDER;
  const respond = (products: any[], total: number, extra: Record<string, unknown> = {}) =>
    res.json({
      products: products.map(withDiscount),
      total,
      page: paginated ? page : 1,
      pages: paginated ? Math.max(1, Math.ceil(total / limit)) : 1,
      limit,
      ...extra,
    });

  // ---------- no search text: plain filtered listing ----------
  if (!search) {
    const [total, products] = await Promise.all([
      prisma.product.count({ where: base }),
      prisma.product.findMany({
        where: base,
        orderBy,
        skip: paginated ? (page - 1) * limit : 0,
        take: limit,
      }),
    ]);
    return respond(products, total);
  }

  // ---------- search: every word must match name, category or description ----------
  const tokens = normalizeText(search).split(" ").filter(Boolean).slice(0, 6);
  const searchWhere: Prisma.ProductWhereInput = {
    ...base,
    AND: tokens.map((t) => ({
      OR: [
        { name: { contains: t, mode: "insensitive" as const } },
        { category: { contains: t, mode: "insensitive" as const } },
        { description: { contains: t, mode: "insensitive" as const } },
      ],
    })),
  };

  const explicitSort = Boolean(SORTS[sort]);

  if (explicitSort) {
    const [total, products] = await Promise.all([
      prisma.product.count({ where: searchWhere }),
      prisma.product.findMany({
        where: searchWhere,
        orderBy,
        skip: paginated ? (page - 1) * limit : 0,
        take: limit,
      }),
    ]);
    if (total > 0) return respond(products, total);
  } else {
    // relevance order: rank the matches ourselves, then page through them
    const matches = await prisma.product.findMany({ where: searchWhere, take: 300 });
    if (matches.length > 0) {
      const ranked = matches
        .map((p) => ({ p, score: scoreMatch(search, p.name) || 1 }))
        .sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name))
        .map((r) => r.p);
      const start = paginated ? (page - 1) * limit : 0;
      return respond(ranked.slice(start, start + limit), ranked.length);
    }
  }

  // ---------- nothing matched: try to forgive typos ("bananna" -> "banana") ----------
  if (search.length >= 3) {
    const catalog = await getCatalog();
    const close = rankCatalog(catalog, search, 40);
    if (close.length > 0) {
      const ids = close.map((c) => c.id);
      const found = await prisma.product.findMany({ where: { ...base, id: { in: ids } } });
      const position = new Map(ids.map((id, i) => [id, i]));
      found.sort((a, b) => position.get(a.id)! - position.get(b.id)!);
      if (found.length > 0) {
        const start = paginated ? (page - 1) * limit : 0;
        return respond(found.slice(start, start + limit), found.length, {
          didYouMean: close[0].name,
        });
      }
    }
  }

  return respond([], 0);
};

// GET /api/products/suggestions?q=ban   (used by the search-as-you-type dropdown)
export const getSuggestions = async (req: Request, res: Response) => {
  const q = asString(req.query.q).slice(0, 60);
  if (!q) return res.json({ suggestions: [], query: q });

  const catalog = await getCatalog();
  const suggestions = rankCatalog(
    catalog.filter((p) => p.stock > 0),
    q,
    8
  );

  res.set("Cache-Control", "public, max-age=30");
  res.json({ suggestions, query: q });
};

// GET /api/products/:id
export const getProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id as string } });
  if (!product) throw new HttpError(404, "Product not found");
  res.json({ product: withDiscount(product) });
};

// Only these fields can be written by the admin form (no more raw req.body -> database).
// No .default() on `description` here: this object is reused via .partial() for updates,
// and a default would wipe an existing description to "" whenever an edit omits it.
const productFields = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  description: z.string().trim().max(2000),
  price: z.coerce.number().positive("Price must be greater than 0"),
  originalPrice: z.coerce.number().min(0).optional(),
  image: z.string().trim().min(1, "Image is required"),
  category: z.string().trim().min(1, "Category is required"),
  unit: z.string().trim().max(50).optional(),
  stock: z.coerce.number().int("Stock must be a whole number").min(0),
  isOrganic: z.coerce.boolean().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewCount: z.coerce.number().int().min(0).optional(),
});

//POST /api/products
export const createProduct = async (req: Request, res: Response) => {
  const data = productFields.extend({ description: productFields.shape.description.default("") }).parse(req.body);
  const product = await prisma.product.create({ data });
  invalidateCatalog();
  res.status(201).json({ product });
};

//PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
  const data = productFields.partial().parse(req.body);
  const existing = await prisma.product.findUnique({ where: { id: req.params.id as string } });
  if (!existing) throw new HttpError(404, "Product not found");
  const product = await prisma.product.update({ where: { id: existing.id }, data });
  invalidateCatalog();
  res.json({ product });
};

//DELETE /api/products/:id  (soft delete: the product is kept but set to out of stock)
export const deleteProduct = async (req: Request, res: Response) => {
  const existing = await prisma.product.findUnique({ where: { id: req.params.id as string } });
  if (!existing) throw new HttpError(404, "Product not found");
  await prisma.product.update({ where: { id: existing.id }, data: { stock: 0 } });
  invalidateCatalog();
  res.json({ message: "Product Updated" });
};
