import { prisma } from "../config/prisma.js";
import { scoreMatch } from "./fuzzy.js";

export type CatalogItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  unit: string | null;
  stock: number;
};

// A tiny in-memory copy of the catalogue (id, name, price...) used for instant suggestions.
// It refreshes every minute and whenever a product is created / edited / deleted.
const TTL_MS = 60_000;
let cache: { at: number; items: CatalogItem[] } | null = null;

export async function getCatalog(): Promise<CatalogItem[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.items;
  const rows = await prisma.product.findMany({
    select: { id: true, name: true, category: true, price: true, image: true, unit: true, stock: true },
  });
  const items: CatalogItem[] = rows.map((r) => ({ ...r, stock: r.stock ?? 0 }));
  cache = { at: Date.now(), items };
  return items;
}

export const invalidateCatalog = () => {
  cache = null;
};

/** Best matches for a query, best first. Category matches count a bit less than name matches. */
export function rankCatalog(items: CatalogItem[], query: string, limit: number): CatalogItem[] {
  return items
    .map((item) => ({
      item,
      score: Math.max(
        scoreMatch(query, item.name),
        scoreMatch(query, item.category.replace(/-/g, " ")) * 0.6
      ),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, limit)
    .map((r) => r.item);
}
