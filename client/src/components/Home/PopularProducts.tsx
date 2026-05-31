// import { useEffect, useState } from "react";
// import { dummyProducts } from "../../assets/assets";
// import { Link } from "react-router-dom";
// import { ArrowRightIcon } from "lucide-react";
// import ProductCard from "../ProductCard";
// import type { Product } from "../../types";

// const PopularProducts = () => {
//     const [products,setProducts]=useState<Product[]>([])
//     useEffect(()=>{
//         setProducts(dummyProducts.slice(0,10))
//     })
//   return (
//     <section className="pb-16">
//         <div className="max-w-7xl mx-auto">
//             <div className="flex items-center justify-between mb-8">
//             <div>
//                 <h2 className="text-2xl font-semibold">Popular Products</h2>
//                 <p className="text-sm text-app-text-light mt-1">Top-rated products this season</p>
//             </div>
//             <Link to="/products" className="text-sm font-semibold text-app-orange hover:text-app-orange-dark flex items-center gap-1 transition-colors">
//             View All <ArrowRightIcon className="size-4"/>

//             </Link>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-8">
//            {products.map((product)=>(
//             <ProductCard key={product._id} product={product}/>
//            ))}

//         </div>
//       </div>
//     </section>
//   )
// }

// export default PopularProducts
import { useEffect, useState } from "react";
import { dummyProducts } from "../../assets/assets";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import ProductCard from "../ProductCard";
import type { Product } from "../../types";

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(dummyProducts.slice(0, 10));
  }, []);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">
              Popular Products
            </h2>

            <p className="text-sm sm:text-base text-zinc-500 mt-2">
              Most ordered groceries this week
            </p>
          </div>

          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
          >
            View All
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>

        {/* Mobile Button */}
        <div className="flex justify-center mt-10 sm:hidden">
          <Link
            to="/products"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
          >
            View All Products
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;