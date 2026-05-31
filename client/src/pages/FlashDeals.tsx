// import { useEffect, useState } from "react";
// import type { Product } from "../types";
// import { dummyProducts } from "../assets/assets";
// import { Zap } from "lucide-react";
// import Loading from "../components/Loading";
// import ProductCard from "../components/ProductCard";

// const FlashDeals = () => {
//   const [products,setProducts]=useState<Product[]>([])
//   const [loading,setLoading]=useState(true)
//   useEffect(()=>{
//     setProducts(dummyProducts.filter((p:any)=>p.stock>0))
//     setTimeout(()=>setLoading(false),1000)
//   })
//   return (
//     <div className="min-h-screen bg-app-cream">
//      <div className="bg-linear-to-r from-app-orange to-app-orange-dark text-white py-10">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <div className="flex-center gap-2 mb-3">
//           <Zap className="size-6 fill-white"/>
//           <h1 className="text-3xl font-semibold">Flash Deals</h1>
//           <Zap/>
//         </div>
//         <p className="text-white/80 max-w-md mx-auto">Limited-time offers on your favorite organic products.Grab them before they're gone!</p>
//       </div>
//      </div>
//      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{loading?(<Loading/>):(
//       products.length===0 ?(
//         <div className="text-center py-16">
//           <Zap className="size-16 text-app-border mx-auto mb-4"/>
//           <h2 className="text-lg font-semibold text-app-green mb-2">No deals right now</h2>
//           <p className="text-sm text-app-text-light">Check back soon for amazing offers!</p>
//         </div>
//       ):(
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
//           {products.map((product)=>product.stock>0 && (
//             <ProductCard key={product._id} product={product}/>
//           ))}
//         </div>
//       )
//      )}</div>
//     </div>
//   )
// }

// export default FlashDeals
import { useEffect, useMemo, useState } from "react";
import type { Product } from "../types";

import { dummyProducts } from "../assets/assets";

import {
  Clock3,
  Flame,
  Sparkles,
  Zap,
} from "lucide-react";

import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";

const FlashDeals = () => {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* ---------------- FETCH PRODUCTS ---------------- */

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      // Only discounted & in-stock products
      const flashProducts =
        dummyProducts.filter(
          (p: any) =>
            p.stock > 0 &&
            p.discount > 0
        );

      setProducts(flashProducts);

      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
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
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 text-white">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 size-72 bg-yellow-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 size-96 bg-red-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

          <div className="max-w-3xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm font-medium mb-6">
              <Sparkles className="size-4" />
              Limited Time Exclusive Offers
            </div>

            {/* Title */}
            <div className="flex items-center gap-3 mb-5">
              <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                <Zap className="size-7 fill-white" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Flash Deals
              </h1>
            </div>

            {/* Description */}
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
              Grab unbeatable discounts on
              fresh groceries, organic
              vegetables, dairy products,
              snacks, and daily essentials —
              before the deals disappear.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">

              <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="size-4 text-yellow-300" />

                  <span className="text-sm font-medium">
                    Active Deals
                  </span>
                </div>

                <p className="text-2xl font-bold">
                  {products.length}
                </p>
              </div>

              <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Clock3 className="size-4 text-yellow-300" />

                  <span className="text-sm font-medium">
                    Ending Soon
                  </span>
                </div>

                <p className="text-2xl font-bold">
                  24h
                </p>
              </div>

              <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="size-4 text-yellow-300" />

                  <span className="text-sm font-medium">
                    Total Savings
                  </span>
                </div>

                <p className="text-2xl font-bold">
                  $
                  {totalSavings.toFixed(
                    0
                  )}
                </p>
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

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-medium self-start sm:self-auto">
            <Zap className="size-4 fill-orange-500" />
            Offers Updated Daily
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <Loading />
        ) : products.length === 0 ? (

          /* EMPTY STATE */
          <div className="bg-white border border-zinc-200 rounded-[32px] py-24 text-center shadow-sm">
            
            <div className="size-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
              <Zap className="size-10 text-orange-500" />
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
                  key={product._id}
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