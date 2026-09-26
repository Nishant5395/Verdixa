import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { Plus, Star } from "lucide-react";
import { useCart } from "../context/CartContext";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₹";

  const { addToCart } = useCart()

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      
      {/* Product Image */}
      <div className="relative bg-zinc-50 aspect-square overflow-hidden">
        
        <img
          src={Array.isArray(product.image) ? product.image[0] : product.image}
          alt={product.name}
          className="w-full h-full object-contain p-5 group-hover:scale-110 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-[11px] font-bold bg-orange-500 text-white rounded-full shadow-md">
              {product.discount}% OFF
            </span>
          </div>
        )}

        {/* Add Button Floating */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95"
        >
          <Plus className="size-5" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        
        {/* Category */}
        <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="text-sm sm:text-base font-semibold text-zinc-800 line-clamp-2 leading-snug min-h-[44px]">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full">
              <Star className="size-3 fill-orange-400 text-orange-400" />

              <span className="text-xs font-semibold text-orange-500">
                {product.rating}
              </span>
            </div>

            <span className="text-xs text-zinc-400">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-end justify-between mt-4">
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-zinc-900">
                {currency}
                {product.price.toFixed(1)}
              </span>

              {product.originalPrice > product.price && (
                <span className="text-sm text-zinc-400 line-through">
                  {currency}
                  {product.originalPrice.toFixed(1)}
                </span>
              )}
            </div>

            <span className="text-xs text-zinc-500 mt-0.5">
              per {product.unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;