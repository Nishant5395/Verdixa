// import { useEffect, useMemo, useState } from "react";
// import type { Product } from "../types";
// import {
//   Link,
//   useSearchParams,
// } from "react-router-dom";
// import { dummyProducts } from "../assets/assets";
// import {
//   Home,
//   Search,
//   SlidersHorizontal,
//   Sparkles,
// } from "lucide-react";

// import Loading from "../components/Loading";
// import ProductCard from "../components/ProductCard";
// import api from "../config/api";
// import { toast } from "react-hot-toast";

// const SearchResults = () => {
//   const [products, setProducts] = useState<
//     Product[]
//   >([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [sort, setSort] =
//     useState("relevance");

//   const [searchParams] =
//     useSearchParams();

//   const query =
//     searchParams.get("q") || "";

//   useEffect(() => {
//     if(!query) return;
//     setLoading(true)
//     api.get(`/products?search=${encodeURIComponent(query)}`).then((res)=>setProducts(res.data.products)).catch((error:any)=>{toast.error(error.response?.data?.messsage || error.message)}).finally(()=>setLoading(false))
//   }, [query]);

//   const sortedProducts = useMemo(() => {
//     const updatedProducts = [...products];

//     switch (sort) {
//       case "price_low":
//         updatedProducts.sort(
//           (a, b) =>
//             a.price - b.price
//         );
//         break;

//       case "price_high":
//         updatedProducts.sort(
//           (a, b) =>
//             b.price - a.price
//         );
//         break;

//       case "rating":
//         updatedProducts.sort(
//           (a, b) =>
//             b.rating - a.rating
//         );
//         break;

//       case "name":
//         updatedProducts.sort((a, b) =>
//           a.name.localeCompare(
//             b.name
//           )
//         );
//         break;

//       default:
//         break;
//     }

//     return updatedProducts;
//   }, [products, sort]);

//   return (
//     <div className="min-h-screen bg-zinc-50">
      
//       {/* Hero */}
//       <div className="bg-linear-to-r from-app-green to-app-green-light text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
//           {/* Breadcrumb */}
//           <nav className="flex items-center gap-2 text-sm text-white/80 mb-6">
//             <Link
//               to="/"
//               className="hover:text-white transition-colors"
//             >
//               <Home className="size-4" />
//             </Link>

//             <span>/</span>

//             <span className="font-medium text-white">
//               Search Results
//             </span>
//           </nav>

//           {/* Heading */}
//           <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            
//             <div>
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm mb-4">
//                 <Sparkles className="size-4" />
//                 Smart Product Search
//               </div>

//               <h1 className="text-3xl md:text-4xl font-bold">
//                 Results for{" "}
//                 <span className="text-app-cream">
//                   "{query}"
//                 </span>
//               </h1>

//               <p className="text-white/80 mt-2 text-sm md:text-base">
//                 {loading
//                   ? "Searching products..."
//                   : `${sortedProducts.length} product${
//                       sortedProducts.length !== 1
//                         ? "s"
//                         : ""
//                     } found`}
//               </p>
//             </div>

//             {/* Sort */}
//             {!loading &&
//               sortedProducts.length > 0 && (
//                 <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-sm">
//                   <SlidersHorizontal className="size-4 text-app-green" />

//                   <select
//                     value={sort}
//                     onChange={(e) =>
//                       setSort(
//                         e.target.value
//                       )
//                     }
//                     className="bg-transparent text-sm text-app-green font-medium outline-none"
//                   >
//                     <option value="relevance">
//                       Relevance
//                     </option>

//                     <option value="price_low">
//                       Price: Low to High
//                     </option>

//                     <option value="price_high">
//                       Price: High to Low
//                     </option>

//                     <option value="rating">
//                       Top Rated
//                     </option>

//                     <option value="name">
//                       A-Z
//                     </option>
//                   </select>
//                 </div>
//               )}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
//         {loading ? (
//           <Loading />
//         ) : sortedProducts.length === 0 ? (
          
//           /* Empty State */
//           <div className="bg-white rounded-3xl border border-app-border shadow-sm py-20 px-6 text-center">
            
//             <div className="size-20 rounded-full bg-app-cream flex items-center justify-center mx-auto mb-6">
//               <Search className="size-10 text-app-green" />
//             </div>

//             <h2 className="text-2xl font-semibold text-app-green mb-3">
//               No results found
//             </h2>

//             <p className="text-app-text-light max-w-md mx-auto leading-relaxed mb-6">
//               We couldn't find any products
//               matching{" "}
//               <span className="font-medium text-app-green">
//                 "{query}"
//               </span>
//               . Try searching with different
//               keywords or browse our categories.
//             </p>

//             <Link
//               to="/products"
//               className="inline-flex items-center gap-2 px-6 py-3 bg-app-green text-white rounded-2xl font-medium hover:bg-app-green-light transition-colors"
//             >
//               Browse Products
//             </Link>
//           </div>
//         ) : (
//           <>
            
//             {/* Search Summary */}
//             <div className="flex items-center justify-between mb-6">
//               <p className="text-sm text-app-text-light">
//                 Showing{" "}
//                 <span className="font-semibold text-app-green">
//                   {sortedProducts.length}
//                 </span>{" "}
//                 search results
//               </p>
//             </div>

//             {/* Products Grid */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
//               {sortedProducts.map(
//                 (product) => (
//                   <ProductCard
//                     key={product.id}
//                     product={product}
//                   />
//                 )
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchResults;

import { useEffect, useMemo, useState } from "react";
import type { Product } from "../types";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  Home,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import api from "../config/api";
import { toast } from "react-hot-toast";

const SearchResults = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("relevance");

  const [searchParams] = useSearchParams();

  const query =
    searchParams.get("q")?.trim() || "";

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data } = await api.get(
          `/products?search=${encodeURIComponent(
            query
          )}`
        );

        setProducts(data?.products || []);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to search products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const sortedProducts = useMemo(() => {
    const updatedProducts = products
      .filter(
        (product) => product.stock > 0
      )
      .slice();

    switch (sort) {
      case "price_low":
        updatedProducts.sort(
          (a, b) => a.price - b.price
        );
        break;

      case "price_high":
        updatedProducts.sort(
          (a, b) => b.price - a.price
        );
        break;

      case "rating":
        updatedProducts.sort(
          (a, b) => b.rating - a.rating
        );
        break;

      case "name":
        updatedProducts.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      default:
        break;
    }

    return updatedProducts;
  }, [products, sort]);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero */}
      <div className="bg-linear-to-r from-app-green to-app-green-light text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/80 mb-6">
            <Link
              to="/"
              className="hover:text-white transition-colors"
            >
              <Home className="size-4" />
            </Link>

            <span>/</span>

            <span className="font-medium text-white">
              Search Results
            </span>
          </nav>

          {/* Heading */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm mb-4">
                <Sparkles className="size-4" />
                Smart Product Search
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">
                Results for{" "}
                <span className="text-app-cream">
                  "{query}"
                </span>
              </h1>

              <p className="text-white/80 mt-2 text-sm md:text-base">
                {loading
                  ? "Searching products..."
                  : `${sortedProducts.length} product${
                      sortedProducts.length !== 1
                        ? "s"
                        : ""
                    } found`}
              </p>
            </div>

            {/* Sort */}
            {!loading &&
              sortedProducts.length > 0 && (
                <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <SlidersHorizontal className="size-4 text-app-green" />

                  <select
                    value={sort}
                    onChange={(e) =>
                      setSort(
                        e.target.value
                      )
                    }
                    className="bg-transparent text-sm text-app-green font-medium outline-none"
                  >
                    <option value="relevance">
                      Relevance
                    </option>

                    <option value="price_low">
                      Price: Low to High
                    </option>

                    <option value="price_high">
                      Price: High to Low
                    </option>

                    <option value="rating">
                      Top Rated
                    </option>

                    <option value="name">
                      A-Z
                    </option>
                  </select>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <Loading />
        ) : sortedProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-app-border shadow-sm py-20 px-6 text-center">
            <div className="size-20 rounded-full bg-app-cream flex items-center justify-center mx-auto mb-6">
              <Search className="size-10 text-app-green" />
            </div>

            <h2 className="text-2xl font-semibold text-app-green mb-3">
              No results found
            </h2>

            <p className="text-app-text-light max-w-md mx-auto leading-relaxed mb-6">
              We couldn't find any products
              matching{" "}
              <span className="font-medium text-app-green">
                "{query}"
              </span>
              . Try searching with different
              keywords or browse our
              categories.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-app-green text-white rounded-2xl font-medium hover:bg-app-green-light transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* Search Summary */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-app-text-light">
                Showing{" "}
                <span className="font-semibold text-app-green">
                  {sortedProducts.length}
                </span>{" "}
                search results
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
              {sortedProducts.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;