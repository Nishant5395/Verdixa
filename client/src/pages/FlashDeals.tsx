
import { useEffect, useMemo, useState } from "react";
import type { Product } from "../types";

//import { dummyProducts } from "../assets/assets";

import {
  Zap,
} from "lucide-react";

import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import api from "../config/api";
import { toast } from "react-hot-toast";

const FlashDeals = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* ---------------- FETCH PRODUCTS ---------------- */

  useEffect(() => {
    api.get("/products/flash-deals").then((res)=>setProducts(res.data.products)).catch((error:any)=>toast.error(error.response.data.message || error?.message)).finally(()=>setLoading(false))
  }, []);

  /* ---------------- RANDOM DEAL STATS ---------------- */

  const totalSavings = useMemo(() => {
    return products.reduce(
      (sum, item: any) =>
        sum +
        (item.originalPrice -
          item.price),
      0
    );
  }, [products]);

  return (
    <div className="min-h-screen bg-zinc-50">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-app-ink text-app-cream">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="font-serif italic text-app-gold text-lg sm:text-xl mb-4">
              Marked down today, gone tomorrow.
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Today's Deals
            </h1>

            <p className="text-app-cream/70 text-base sm:text-lg leading-relaxed max-w-2xl mb-10">
              Discounted fresh produce, dairy, snacks, and daily essentials.
              Stock is limited to what's already marked down in the warehouse.
            </p>

            <div className="flex flex-wrap gap-x-10 gap-y-5 border-t border-app-cream/15 pt-6">
              <div>
                <p className="text-3xl font-serif text-app-gold">{products.length}</p>
                <p className="text-sm text-app-cream/60 mt-1">Active deals</p>
              </div>

              <div>
                <p className="text-3xl font-serif text-app-gold">
                  {currency}
                  {totalSavings.toFixed(0)}
                </p>
                <p className="text-sm text-app-cream/60 mt-1">Total savings available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">
              Today's Hot Deals
            </h2>

            <p className="text-zinc-500 mt-2">
              Premium grocery products at
              discounted prices.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-app-gold-light text-app-gold-dark text-sm font-medium self-start sm:self-auto">
            <Zap className="size-4 fill-app-gold-dark" />
            Offers Updated Daily
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <Loading />
        ) : products.length === 0 ? (

          /* EMPTY STATE */
          <div className="bg-white border border-zinc-200 rounded-4xl py-24 text-center shadow-sm">
            
            <div className="size-20 rounded-full bg-app-gold-light flex items-center justify-center mx-auto mb-6">
              <Zap className="size-10 text-app-gold-dark" />
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 mb-3">
              No Flash Deals Right Now
            </h2>

            <p className="text-zinc-500 max-w-md mx-auto leading-relaxed">
              We’re preparing new exciting
              discounts for you. Check back
              again soon for fresh offers.
            </p>
          </div>
        ) : (

          /* PRODUCT GRID */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 xl:gap-7">
            {products.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default FlashDeals;