// import { Link, useNavigate, useParams } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { useEffect, useState } from "react";
// import type { Product } from "../types";
// import { dummyProducts } from "../assets/assets";
// import Loading from "../components/Loading";
// import { ArrowLeftIcon, ArrowRightIcon, HomeIcon, LeafIcon, MinusIcon, PlusIcon, ShoppingCartIcon, Star, StarIcon } from "lucide-react";
// import DummyReviewsSection from "../assets/DummyReviewsSection";
// import ProductCard from "../components/ProductCard";

// const ProductPage = () => {
//   const currency=import.meta.env.VITE_CURRENCY_SYMBOL || "$";
//   const {id}=useParams()
//   const navigate=useNavigate()
//   const {items,addToCart,updateQuantity,removeFromCart}=useCart()
//   const [product,setProduct]=useState<Product | null>(null)
//   const [relatedProduts,setRelatedProducts]=useState<Product[]>([])
//   const [loading,setLoading]=useState(true);
//   const [loacalQuantity,setLocalQuantity]=useState(1)
//   useEffect(()=>{
//     setLoading(true)
//     setLocalQuantity(1);
//     window.scrollTo(0,0)
//     const product=dummyProducts.find((p)=>p._id !==id)
//     setProduct(product!)
//     setRelatedProducts(dummyProducts.filter((p)=>p._id !==id))
//     setLoading(false)
//   },[id,navigate])
//   if(loading)return <Loading/>
//   if(!product) return null;
//   const cartItem=items.find((item)=>item.product._id===product._id)
//   const inCart=!!cartItem;
//   const displayQuantity=inCart ? cartItem.quantity:loacalQuantity
// const handleMinus=()=>{
//   if(inCart){
//     if(cartItem.quantity >1)updateQuantity(product._id,cartItem.quantity-1)
//       else removeFromCart(product._id)
//   }{
//     setLocalQuantity(Math.max(1,loacalQuantity-1))
//   }
// }
// const handlePlus=()=>{
//   if(inCart){
//     updateQuantity(product._id,cartItem.quantity+1)
     
//   }
//   else{
//  setLocalQuantity(loacalQuantity+1)
//   }
// }
//   const categoryLabel=product.category.replace(/-/g," ");
//   return (

//     <div className="min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Breadcrumb */}
//         <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
//           <Link to='/' className="hover:text-app-green transition-colors">
//           <HomeIcon className="size-4"/>
//           </Link>
//           <span>/</span>
//           <Link to='/products' className="hover:text-app-green transition-colors">
//          Products
//           </Link>
//           <span>/</span>
//           <Link to={`/products?category=${product.category}`}
//            className="hover:text-app-green transition-colors capitalize">
//           {categoryLabel}
//           </Link>
//           <span>/</span>
//           <span className="text-app-green font-medium truncate max-w-[200px]">{product.name}</span>
//         </nav>
//         {/* Back button */}
//         <button onClick={()=> navigate(-1)} className="mb-6 flex items-center gap-1.5 text-sm text-app-text-light hover:text-app-green transition-colors">
//           <ArrowLeftIcon className="size-4"/>Back
//         </button>
//         {/* Product Details Section */}
//         <div className="bg-white/50 rounded-2xl overflow-hidden">
//         <div className="grid md:grid-cols gap-0">
//           {/* left side-Image */}
//           <div className="relative flex-center p-8 md:p-12 min-h-[320px] md:min-h-[480px]">
//             <img src={product.image} alt={product.name} className="max-h-[360px] w-auto object-contain"/>
//              {/* Badges */}
//             <div className="absolute top-5 left-5 flex flex-wrap gap-1.5">
//             {product.isOrganic && (
//               <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-app-green text-white rounded-full">
//                 <LeafIcon className="w-3 h-3"/>
//                 Organic
//               </span>
//             )}
//             {product.discount>0 && (
//               <span className="px-2.5 py-1 text-xs font-semibold bg-app-orange text-white rounded-full">
//                 {product.discount}% OFF
//               </span>
//             )}
//           </div>
//           </div>
//          {/* right side -Details */}
//          <div className="p-6 md:p-10 flex flex-col justify-center">
//           <span className="text-xs font-medium text-app-text-light tracking-wider mb-2 capitalize">{categoryLabel}
//           </span>
//           <h1 className="text-2xl md:text-3xl font-semibold text-app-green mb-3">{product.name}</h1>
//           {/* Rating */}
//           {product.rating>0 &&(
//             <div className="flex items-center gap-2 mb-5">
//               <div className="flex items-center gap-0.5">{[1,2,3,4,5].map((star)=>(
//                 <StarIcon key={star} className={`w-4 h-4 ${star<=Math.round(product.rating)? "text-app-warning fill-app-warning":"text-app-border"}`}/>
//               ))}</div>
//               <span className="text-sm font-medium">{product.rating}</span>
//               <span className="text-sm text-app-text-light">({product.reviewCount} reviews)</span>
//             </div>
//           )}
//           {/* Price */}
//           <div className="flex items-baseline gap-3 mb-5">

//             <span className="text-3xl md:text-4xl font-semibold text-app-green">{currency}{product.price.toFixed(2)}</span>
//             {product.originalPrice > product.price && (
//               <span className="text-lg text-app-text-light line-through">{currency}{product.originalPrice.toFixed(2)}</span>
//             )}
//           </div>
//           {/* Description */}
//           <p className="text-sm text-app-text-light leading-relaxed mb-6">{product.description}</p>
//           {/* Stock */}
//           <div className="mb-6">{product.stock >0 ?(
//             <span className="text-sm text-app-success font-medium"> In Stock ({product.stock} available)</span>
//           ):(
//             <span className="text-sm text-app-error font-medium">Out of Stock</span>
//           )}</div>
//           {/* Quantity + Add to Cart */}
//           <div className="flex items-center gap-3">
//             <div className="flex items-center border border-app-border rounded-xl overflow-hidden">
//               <button onClick={handleMinus} className="p-3 hover:bg-app-cream transition-colors">
//                 <MinusIcon className="w-4 h-4"/>
//               </button>
//               <span className="px-5 text-sm font-semibold min-w-[40px] text-center">{displayQuantity}</span>
//               <button onClick={handlePlus} className="p-3 hover:bg-app-cream transition-colors">
//                 <PlusIcon className="w-4 h-4"/>
//               </button>
//             </div>
//             {/* Add to Cart */}
//             <button 
//             onClick={()=>{
//               if(!inCart) addToCart(product,loacalQuantity)
//             }}
//           disabled={product.stock===0}
//           className={`flex-1 py-3 font-semibold rounded-xl transition-colors flex-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${inCart? "bg-app-cream text-app-green border border-app-green":"bg-app-orange text-white hover:bg-app-orange-dark"}`}
//             >
//               <ShoppingCartIcon className="w-4 h-4"/>
//               {inCart ? "Added to Cart" : "Add to Cart"}

//             </button>
//           </div>
//          </div>
          
//         </div>
//         </div>
//         {/* Customer Reviews */}
//         {product.reviewCount >0 && <DummyReviewsSection product={product}/>}

//         { /* Related Products */}
//         {relatedProduts.length>0 && (
//           <section className="mt-12 mb-44">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h2 className="text-2xl font-semibold text-app-green">Related Products</h2>
//                 <p className="text-sm text-app-text-light mt-1">More from {categoryLabel}</p>
//               </div>
//               <Link className="text-sm font-semibold text-app-orange hover:text-app-orange-dark flex items-center gap-1 transition-colors" to={`/products?category=${product.category}`}>View All <ArrowRightIcon className="size-4"/></Link>
//             </div>
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-8">
//               {relatedProduts.slice(0,5).map((rp)=>(
//                 <ProductCard key={rp._id}product={rp}/>
//               ))}

//             </div>
//           </section>
//         )}
//       </div>
      
//     </div>
//   )

// }
// export default ProductPage

import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HeartIcon,
  HomeIcon,
  LeafIcon,
  MinusIcon,
  PlusIcon,
  Share2Icon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  StarIcon,
  TruckIcon,
} from "lucide-react";

import type { Product } from "../types";

import { dummyProducts } from "../assets/assets";

import { useCart } from "../context/CartContext";

import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";

import DummyReviewsSection from "../assets/DummyReviewsSection";

const ProductPage = () => {
  const currency =
    import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  const { id } = useParams();

  const navigate = useNavigate();

  const {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [relatedProducts, setRelatedProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [localQuantity, setLocalQuantity] =
    useState(1);

  /* ---------------- FETCH PRODUCT ---------------- */

  useEffect(() => {
    setLoading(true);

    setLocalQuantity(1);

    window.scrollTo(0, 0);

    const foundProduct =
      dummyProducts.find(
        (p) => p._id === id
      ) || null;

    setProduct(foundProduct);

    if (foundProduct) {
      const related =
        dummyProducts
          .filter(
            (p) =>
              p.category ===
                foundProduct.category &&
              p._id !== foundProduct._id
          )
          .slice(0, 5);

      setRelatedProducts(related);
    }

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [id]);

  /* ---------------- STATES ---------------- */

  if (loading) return <Loading />;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">
            Product Not Found
          </h2>

          <p className="text-zinc-500 mb-6">
            The product you are looking
            for does not exist.
          </p>

          <button
            onClick={() =>
              navigate("/products")
            }
            className="px-6 py-3 rounded-2xl bg-app-green text-white font-medium hover:opacity-90 transition-all"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- CART ---------------- */

  const cartItem = items.find(
    (item) =>
      item.product._id === product._id
  );

  const inCart = !!cartItem;

  const displayQuantity = inCart
    ? cartItem.quantity
    : localQuantity;

  /* ---------------- HANDLERS ---------------- */

  const handleMinus = () => {
    if (inCart && cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(
          product._id,
          cartItem.quantity - 1
        );
      } else {
        removeFromCart(product._id);
      }
    } else {
      setLocalQuantity((prev) =>
        Math.max(1, prev - 1)
      );
    }
  };

  const handlePlus = () => {
    if (inCart && cartItem) {
      updateQuantity(
        product._id,
        cartItem.quantity + 1
      );
    } else {
      setLocalQuantity(
        (prev) => prev + 1
      );
    }
  };

  const categoryLabel =
    product.category.replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-zinc-50">

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
          <Link
            to="/"
            className="hover:text-app-green transition-colors"
          >
            <HomeIcon className="size-4" />
          </Link>

          <span>/</span>

          <Link
            to="/products"
            className="hover:text-app-green transition-colors"
          >
            Products
          </Link>

          <span>/</span>

          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-app-green transition-colors capitalize"
          >
            {categoryLabel}
          </Link>

          <span>/</span>

          <span className="text-app-green font-medium truncate max-w-[180px]">
            {product.name}
          </span>
        </nav>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-app-green transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </button>

        {/* PRODUCT SECTION */}
        <section className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm">

          <div className="grid lg:grid-cols-2">

            {/* LEFT IMAGE */}
            <div className="relative bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-8 md:p-14 min-h-[420px]">

              {/* Badges */}
              <div className="absolute top-5 left-5 flex flex-wrap gap-2 z-10">

                {product.isOrganic && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold shadow-sm">
                    <LeafIcon className="size-3" />
                    Organic
                  </span>
                )}

                {product.discount > 0 && (
                  <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-semibold shadow-sm">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <button className="absolute top-5 right-5 size-11 rounded-full bg-white shadow-md border border-zinc-200 flex items-center justify-center hover:bg-red-50 transition-colors">
                <HeartIcon className="size-5 text-zinc-700" />
              </button>

              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[420px] object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* RIGHT DETAILS */}
            <div className="p-6 md:p-10 flex flex-col justify-center">

              {/* Category */}
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-500 mb-3">
                {categoryLabel}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 leading-tight mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-3 mb-6">

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <StarIcon
                          key={star}
                          className={`size-4 ${
                            star <=
                            Math.round(
                              product.rating
                            )
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-zinc-300"
                          }`}
                        />
                      )
                    )}
                  </div>

                  <span className="text-sm font-semibold text-zinc-800">
                    {product.rating}
                  </span>

                  <span className="text-sm text-zinc-500">
                    (
                    {
                      product.reviewCount
                    }{" "}
                    reviews)
                  </span>
                </div>
              )}

              {/* PRICE */}
              <div className="flex items-end gap-3 mb-6">

                <span className="text-4xl font-bold text-app-green">
                  {currency}
                  {product.price.toFixed(2)}
                </span>

                {product.originalPrice >
                  product.price && (
                  <span className="text-lg text-zinc-400 line-through">
                    {currency}
                    {product.originalPrice.toFixed(
                      2
                    )}
                  </span>
                )}
              </div>

              {/* DESCRIPTION */}
              <p className="text-zinc-600 leading-relaxed mb-7">
                {product.description}
              </p>

              {/* FEATURES */}
              <div className="grid grid-cols-2 gap-4 mb-7">

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <TruckIcon className="size-5 text-app-green" />

                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      Fast Delivery
                    </p>

                    <p className="text-xs text-zinc-500">
                      Within 30 mins
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <ShieldCheckIcon className="size-5 text-app-green" />

                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      Quality Assured
                    </p>

                    <p className="text-xs text-zinc-500">
                      Fresh & authentic
                    </p>
                  </div>
                </div>
              </div>

              {/* STOCK */}
              <div className="mb-7">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                    In Stock •{" "}
                    {product.stock} available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-600 text-sm font-semibold">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-4">

                {/* QUANTITY */}
                <div className="flex items-center border border-zinc-200 rounded-2xl overflow-hidden bg-white">

                  <button
                    onClick={handleMinus}
                    className="px-4 py-3 hover:bg-zinc-100 transition-colors"
                  >
                    <MinusIcon className="size-4" />
                  </button>

                  <span className="w-14 text-center font-semibold text-zinc-900">
                    {displayQuantity}
                  </span>

                  <button
                    onClick={handlePlus}
                    className="px-4 py-3 hover:bg-zinc-100 transition-colors"
                  >
                    <PlusIcon className="size-4" />
                  </button>
                </div>

                {/* ADD TO CART */}
                <button
                  onClick={() => {
                    if (!inCart) {
                      addToCart(
                        product,
                        localQuantity
                      );
                    }
                  }}
                  disabled={
                    product.stock === 0
                  }
                  className={`flex-1 py-3.5 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                    inCart
                      ? "bg-green-100 text-app-green border border-green-200"
                      : "bg-app-orange text-white hover:bg-orange-600 shadow-lg shadow-orange-200"
                  }`}
                >
                  <ShoppingCartIcon className="size-5" />

                  {inCart
                    ? "Added to Cart"
                    : "Add to Cart"}
                </button>

                {/* SHARE */}
                <button className="size-14 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-100 transition-colors flex items-center justify-center">
                  <Share2Icon className="size-5 text-zinc-700" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        {product.reviewCount > 0 && (
          <DummyReviewsSection
            product={product}
          />
        )}

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-14 mb-20">

            <div className="flex items-center justify-between mb-7">

              <div>
                <h2 className="text-3xl font-bold text-zinc-900">
                  Related Products
                </h2>

                <p className="text-zinc-500 mt-2">
                  More fresh products from{" "}
                  {categoryLabel}
                </p>
              </div>

              <Link
                to={`/products?category=${product.category}`}
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
              >
                View All
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 xl:gap-7">
              {relatedProducts.map(
                (rp) => (
                  <ProductCard
                    key={rp._id}
                    product={rp}
                  />
                )
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductPage;