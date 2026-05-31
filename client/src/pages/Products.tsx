// import { useEffect, useState } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import type { Product } from "../types";
// import { categoriesData, dummyProducts } from "../assets/assets";
// import { ChevronDown, Home, SlidersHorizontal, XIcon } from "lucide-react";
// import ProductCard from "../components/ProductCard";
// import Loading from "../components/Loading";
// import FilterPanel from "../components/FilterPanel";

// const Products = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [products, setProducts] = useState<Product[]>([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

//   const category = searchParams.get("category") || "";
//   const organic = searchParams.get("organic") || "";
//   const sort = searchParams.get("sort") || "";
//   const page = searchParams.get("page") || "1";
//   const minPrice = searchParams.get("minPrice") || "";
//   const maxPrice = searchParams.get("maxPrice") || "";

//   const fetchProducts = async () => {
//     setLoading(true);

//     let filteredProducts = [...dummyProducts];

//     // Category filter
//     if (category) {
//       filteredProducts = filteredProducts.filter(
//         (p) => p.category === category
//       );
//     }

//     // Organic filter
//    if (organic === "true") {
//   filteredProducts = filteredProducts.filter(
//     (p) => p.isOrganic === true
//   );
// }

//     // Min price filter
//     if (minPrice) {
//       filteredProducts = filteredProducts.filter(
//         (p) => p.price >= Number(minPrice)
//       );
//     }

//     // Max price filter
//     if (maxPrice) {
//       filteredProducts = filteredProducts.filter(
//         (p) => p.price <= Number(maxPrice)
//       );
//     }

//     // Sorting
//     switch (sort) {
//       case "price_asc":
//         filteredProducts.sort((a, b) => a.price - b.price);
//         break;

//       case "price_desc":
//         filteredProducts.sort((a, b) => b.price - a.price);
//         break;

//       case "rating":
//         filteredProducts.sort((a, b) => b.rating - a.rating);
//         break;

//       case "name":
//         filteredProducts.sort((a, b) =>
//           a.name.localeCompare(b.name)
//         );
//         break;

//       default:
//         break;
//     }

//     setProducts(filteredProducts);

//     // Example pagination
//     setTotalPages(Math.ceil(filteredProducts.length / 8));

//     setLoading(false);
//   };

//   const updateFilter = (key: string, value: string) => {
//     const newParams = new URLSearchParams(searchParams);

//     if (value) {
//       newParams.set(key, value);
//     } else {
//       newParams.delete(key);
//     }

//     // Reset page when filter changes
//     if (key !== "page") {
//       newParams.delete("page");
//     }

//     setSearchParams(newParams);
//   };

//   const clearFilters = () => {
//     setSearchParams({});
//   };

//   const activeCategory = categoriesData.find(
//     (c) => c.slug === category
//   );

//   const hasFilters =
//     category || organic || minPrice || maxPrice;

//   useEffect(() => {
//     fetchProducts();
//   }, [category, organic, sort, page, minPrice, maxPrice]);

//   return (
//     <div className="min-h-screen bg-zinc-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

//         {/* Breadcrumb */}
//         <nav className="flex items-center gap-2 text-sm text-app-light mb-6">
//           <Link
//             to="/"
//             className="hover:text-app-green transition-colors"
//           >
//             <Home className="size-4" />
//           </Link>

//           <span>/</span>

//           <span className="text-app-green font-medium">
//             {activeCategory
//               ? activeCategory.name
//               : "All Products"}
//           </span>
//         </nav>

//         <div className="flex gap-8 xl:gap-10">

//           {/* Sidebar Desktop */}
//           <aside className="hidden lg:block w-64 shrink-0">
//             <div className="bg-white rounded-3xl p-5 sticky top-24 border border-zinc-200 shadow-sm">
//               <FilterPanel categories={categoriesData} category={category} organic={organic} minPrice={minPrice} maxPrice={maxPrice} updateFilter={updateFilter} clearFilters={clearFilters} hasFilters={hasFilters}/>

//               {hasFilters && (
//                 <button
//                   onClick={clearFilters}
//                   className="text-sm text-red-500 hover:underline"
//                 >
//                   Clear Filters
//                 </button>
//               )}
//             </div>
//           </aside>

//           {/* Main Content */}
//           <main className="flex-1">

//             {/* Header */}
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h1 className="text-2xl font-semibold text-app-green">
//                   {activeCategory
//                     ? activeCategory.name
//                     : "All Products"}
//                 </h1>

//                 <p className="text-sm text-app-text-light mt-0.5">
//                   {products.length} product
//                   {products.length !== 1 && "s"} found
//                 </p>
//               </div>

//               <div className="flex flex-col lg:items-center gap-3">

//                 {/* Mobile Filter Button */}
//                 <button
//                   onClick={() => setMobileFilterOpen(true)}
//                   className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm bg-white rounded-xl border border-app-border hover:bg-app-cream transition-colors"
//                 >
//                   <SlidersHorizontal className="size-4" />
//                   Filters
//                 </button>

//                 {/* Sort */}
//                 <div className="relative">
//                   <select
//                     value={sort}
//                     onChange={(e) =>
//                       updateFilter("sort", e.target.value)
//                     }
//                     className="appearance-none pl-3 pr-8 py-2 text-sm bg-white rounded-xl border border-app-border focus:border-app-green outline-none cursor-pointer"
//                   >
//                     <option value="">Newest</option>

//                     <option value="price_asc">
//                       Price: Low-High
//                     </option>

//                     <option value="price_desc">
//                       Price: High-Low
//                     </option>

//                     <option value="rating">
//                       Top Rated
//                     </option>

//                     <option value="name">
//                       A-Z
//                     </option>
//                   </select>

//                   <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 text-app-text-light pointer-events-none" />
//                 </div>
//               </div>
//             </div>

//             {/* Product Grid */}
//             {loading ? (
//               <Loading />
//             ) : products.length === 0 ? (
//               <div className="text-center py-16">
//                 <p className="text-lg font-semibold text-app-green mb-2">
//                   No Products Found
//                 </p>

//                 <p className="text-sm text-app-text-light mb-4">
//                   Try adjusting your filters or search terms
//                 </p>

//                 <button
//                   onClick={clearFilters}
//                   className="px-5 py-2 text-sm font-medium bg-app-green text-white rounded-xl hover:bg-app-green-light transition-colors"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-8">
//                 {products
//                   .filter((product) => product.stock > 0)
//                   .map((product) => (
//                     <ProductCard
//                       key={product._id}
//                       product={product}
//                     />
//                   ))}
//               </div>
//             )}

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-center gap-2 mt-16">
//                 {Array.from({ length: totalPages }).map(
//                   (_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => {
//                         updateFilter(
//                           "page",
//                           String(i + 1)
//                         );

//                         window.scrollTo(0, 0);
//                       }}
//                       className={`size-9 rounded-lg text-sm font-medium transition-colors ${
//                         page === String(i + 1)
//                           ? "bg-app-green text-white"
//                           : "bg-white text-app-text-light hover:bg-app-cream"
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   )
//                 )}
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
//      {mobileFilterOpen && (
//   <>
//       <div className="fixed inset-0 bg-black/40 z-50" onClick={()=>setMobileFilterOpen(false)}/>
//       <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-[32px] max-h-[85vh] overflow-y-auto shadow-2xl border-t border-zinc-200 animate-slide-in-up">
//         <div className="flex items-center justify-between p-4 border-b border-app-border">
//           <h3 className="text-lg font-semibold text-app-green">Filters</h3>
//           <button onClick={()=>setMobileFilterOpen(false)} className="p-2 hover:bg-app-cream rounded-lg">
//             <XIcon className="size-5"/>
//           </button>
//         </div>
//         <div className="p-4">
//            <FilterPanel categories={categoriesData} category={category} organic={organic} minPrice={minPrice} maxPrice={maxPrice} updateFilter={updateFilter} clearFilters={clearFilters} hasFilters={hasFilters}/>
//         </div>
//       </div>
//       </>
// )}
//     </div>
//   );
// };

// export default Products;

import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import type { Product } from "../types";

import {
  categoriesData,
  dummyProducts,
} from "../assets/assets";

import {
  ChevronDown,
  Home,
  SlidersHorizontal,
  XIcon,
  SparklesIcon,
} from "lucide-react";

import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import FilterPanel from "../components/FilterPanel";

const PRODUCTS_PER_PAGE = 8;

const Products = () => {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [products, setProducts] = useState<
    Product[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [totalPages, setTotalPages] =
    useState(1);

  const [
    mobileFilterOpen,
    setMobileFilterOpen,
  ] = useState(false);

  /* ---------------- QUERY PARAMS ---------------- */

  const category =
    searchParams.get("category") || "";

  const organic =
    searchParams.get("organic") || "";

  const sort =
    searchParams.get("sort") || "";

  const page = Number(
    searchParams.get("page") || "1"
  );

  const minPrice =
    searchParams.get("minPrice") || "";

  const maxPrice =
    searchParams.get("maxPrice") || "";

  /* ---------------- FETCH PRODUCTS ---------------- */

  const fetchProducts = async () => {
    setLoading(true);

    let filteredProducts = [
      ...dummyProducts,
    ];

    // Category
    if (category) {
      filteredProducts =
        filteredProducts.filter(
          (p) =>
            p.category === category
        );
    }

    // Organic
    if (organic === "true") {
      filteredProducts =
        filteredProducts.filter(
          (p) => p.isOrganic === true
        );
    }

    // Min Price
    if (minPrice) {
      filteredProducts =
        filteredProducts.filter(
          (p) =>
            p.price >= Number(minPrice)
        );
    }

    // Max Price
    if (maxPrice) {
      filteredProducts =
        filteredProducts.filter(
          (p) =>
            p.price <= Number(maxPrice)
        );
    }

    // Sorting
    switch (sort) {
      case "price_asc":
        filteredProducts.sort(
          (a, b) =>
            a.price - b.price
        );
        break;

      case "price_desc":
        filteredProducts.sort(
          (a, b) =>
            b.price - a.price
        );
        break;

      case "rating":
        filteredProducts.sort(
          (a, b) =>
            b.rating - a.rating
        );
        break;

      case "name":
        filteredProducts.sort((a, b) =>
          a.name.localeCompare(
            b.name
          )
        );
        break;

      default:
        break;
    }

    // Pagination
    const start =
      (page - 1) * PRODUCTS_PER_PAGE;

    const end =
      start + PRODUCTS_PER_PAGE;

    setTotalPages(
      Math.ceil(
        filteredProducts.length /
          PRODUCTS_PER_PAGE
      )
    );

    setProducts(
      filteredProducts.slice(start, end)
    );

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [
    category,
    organic,
    sort,
    page,
    minPrice,
    maxPrice,
  ]);

  /* ---------------- HELPERS ---------------- */

  const updateFilter = (
    key: string,
    value: string
  ) => {
    const params =
      new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset page when filter changes
    if (key !== "page") {
      params.delete("page");
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const activeCategory =
    categoriesData.find(
      (c) => c.slug === category
    );

  const hasFilters = Boolean(
  category ||
  organic ||
  minPrice ||
  maxPrice
);

  /* ---------------- JSX ---------------- */

  return (
    <div className="min-h-screen bg-zinc-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link
            to="/"
            className="hover:text-orange-500 transition-colors"
          >
            <Home className="size-4" />
          </Link>

          <span>/</span>

          <span className="font-medium text-zinc-800">
            {activeCategory
              ? activeCategory.name
              : "All Products"}
          </span>
        </nav>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-green-950 via-green-900 to-green-800 p-8 sm:p-10 mb-8">
          
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
            <div className="absolute right-10 top-10 size-48 rounded-full bg-orange-400 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-orange-300 text-sm font-medium mb-5 backdrop-blur-sm">
              <SparklesIcon className="size-4" />
              Fresh Groceries Delivered Fast
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              {activeCategory
                ? activeCategory.name
                : "Premium Grocery Collection"}
            </h1>

            <p className="text-white/70 mt-4 text-base sm:text-lg max-w-xl leading-relaxed">
              Discover fresh fruits,
              vegetables, dairy, snacks,
              and essentials delivered
              straight to your doorstep.
            </p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex gap-8 xl:gap-10">

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-white rounded-[28px] border border-zinc-200 shadow-sm p-5">
              <FilterPanel
                categories={categoriesData}
                category={category}
                organic={organic}
                minPrice={minPrice}
                maxPrice={maxPrice}
                updateFilter={
                  updateFilter
                }
                clearFilters={
                  clearFilters
                }
                hasFilters={hasFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">

            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">

              {/* Left */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                  {activeCategory
                    ? activeCategory.name
                    : "All Products"}
                </h2>

                <p className="text-zinc-500 mt-1 text-sm">
                  Showing{" "}
                  <span className="font-semibold text-zinc-800">
                    {
                      products.length
                    }
                  </span>{" "}
                  premium products
                </p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">

                {/* Mobile Filter */}
                <button
                  onClick={() =>
                    setMobileFilterOpen(
                      true
                    )
                  }
                  className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-zinc-200 shadow-sm hover:bg-zinc-50 transition-all"
                >
                  <SlidersHorizontal className="size-4" />

                  <span className="text-sm font-medium">
                    Filters
                  </span>
                </button>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) =>
                      updateFilter(
                        "sort",
                        e.target.value
                      )
                    }
                    className="appearance-none bg-white border border-zinc-200 rounded-2xl pl-4 pr-10 py-3 text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all"
                  >
                    <option value="">
                      Newest
                    </option>

                    <option value="price_asc">
                      Price: Low → High
                    </option>

                    <option value="price_desc">
                      Price: High → Low
                    </option>

                    <option value="rating">
                      Top Rated
                    </option>

                    <option value="name">
                      Name A-Z
                    </option>
                  </select>

                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="bg-white border border-zinc-200 rounded-[32px] py-20 text-center shadow-sm">
                
                <h3 className="text-2xl font-bold text-zinc-800 mb-3">
                  No Products Found
                </h3>

                <p className="text-zinc-500 mb-6">
                  Try changing your
                  filters or category.
                </p>

                <button
                  onClick={
                    clearFilters
                  }
                  className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 xl:gap-7">
                {products
                  .filter(
                    (product) =>
                      product.stock > 0
                  )
                  .map((product) => (
                    <ProductCard
                      key={
                        product._id
                      }
                      product={
                        product
                      }
                    />
                  ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-14 flex-wrap">
                {Array.from({
                  length: totalPages,
                }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      updateFilter(
                        "page",
                        String(i + 1)
                      )
                    }
                    className={`size-11 rounded-2xl text-sm font-semibold transition-all ${
                      page === i + 1
                        ? "bg-green-950 text-white shadow-lg"
                        : "bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() =>
              setMobileFilterOpen(
                false
              )
            }
          />

          {/* Drawer */}
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-[32px] max-h-[85vh] overflow-y-auto border-t border-zinc-200 shadow-2xl animate-slide-in-up">

            {/* Header */}
            <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-zinc-200">
              
              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  Filters
                </h3>

                <p className="text-xs text-zinc-500">
                  Refine your search
                </p>
              </div>

              <button
                onClick={() =>
                  setMobileFilterOpen(
                    false
                  )
                }
                className="size-10 rounded-xl hover:bg-zinc-100 flex items-center justify-center transition-colors"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <FilterPanel
                categories={categoriesData}
                category={category}
                organic={organic}
                minPrice={minPrice}
                maxPrice={maxPrice}
                updateFilter={
                  updateFilter
                }
                clearFilters={
                  clearFilters
                }
                hasFilters={hasFilters}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;