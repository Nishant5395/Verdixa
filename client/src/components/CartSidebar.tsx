// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { ArrowRightIcon, MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon, XIcon } from "lucide-react";

// const CartSidebar = () => {
//   const currency=import.meta.env.VITE_CURRENCY_SYMBOL || "$";
//   const {items,updateQuantity,removeFromCart,cartTotal,isCartOpen,setIsCartOpen}=useCart()
//   const navigate=useNavigate()
//   if(!isCartOpen) return null

//   const deliveryFee=cartTotal > 20 ? 0:1.99;
//   const grandTotal=cartTotal + deliveryFee;
//   return (
//     <>
//     {/* overlay */}
//       <div onClick={()=>setIsCartOpen(false)} className="fixed inset-0 bg-black/40 z-50 transition-opacity"/>
//    {/* sidebar */}
//       <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
//         {/* Header */}
//     <div className="flex items-center justify-between p-5 border-b border-app-border">
//         <div className="flex items-center gap-2">
//           <ShoppingBagIcon className="size-5"/>
//           <h2 className="text-lg font-medium">Your Cart</h2>
//           <span className="px-2 py-0.5 text-xs font-semibold bg-app-cream rounded-full">{items.length} items</span>
//         </div>
//         <button onClick={()=>setIsCartOpen(false)}
//           className="p-2 rounded-xl hover:bg-app-cream transition-colors">
//           <XIcon className="size-5"/>
//         </button>
//     </div>
//     {/* Items */}
//     <div className="flex-1 overflow-y-auto p-5 space-y-4">
//       {items.length==0 ?(
//         <div className="flex flex-col items-center justify-center h-full text-center">
//           <ShoppingBagIcon className="size-16 text-app-border mb-4"/>
//           <h3 className="text-lg font-medium mb-1">Your cart is empty</h3>
//           </div>
//       ):(
//         items.map((item)=>(
//           <div key={item.product._id} className="flex gap-3 bg-app-cream/60 rounded-xl p-3" >
//             <img src={item.product.image} alt={item.product.name}
//             className="size-16 rounded-lg object-cover shrink-0"/>
//             <div className="flex-1 min-w-0">
//               <h4 className="text-sm font-semibold truncate">{item.product.name}</h4>
//               <p className="text-xs text-app-text-light">{currency}{item.product.price.toFixed(2)}/{item.product.unit}</p>
//               <div className="flex items-center justify-between mt-2">
//                 <div className="flex items-center gap-1.5">
//                   <button onClick={()=>updateQuantity(item.product._id,item.quantity-1)} 
//                     className="size-7 rounded-lg bg-white border border-app-border flex-center">
//                       <MinusIcon className="size-3"/>
//                     </button>

//                     <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>

//                   <button onClick={()=>updateQuantity(item.product._id,item.quantity+1)} 
//                     className="size-7 rounded-lg bg-white border border-app-border flex-center">
//                       <PlusIcon className="size-3"/>
//                     </button>

//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-semibold">
//                     {currency}{(item.product.price*item.quantity).toFixed(2)}
//                   </span>
//                   <button onClick={()=>removeFromCart(item.product._id)}
//                     className="p-1 text-app-text-light hover:text-app-error transition-colors">
//                       <Trash2Icon className="size-4"/>
//                     </button>

//                 </div>
//               </div>
//               </div>
//             </div>
//         ))
//       )}
//     </div>
//     {/* Footer */}
//     {items.length > 0 && (
//       <div className="p-5 border-t border-app-border space-y-3">
//         <div className="flex justify-between text-sm">
//           <span className="text-app-text-light">Subtotal</span>
//           <span className="font-medium">{currency}{cartTotal.toFixed(2)}</span>

//         <div className="flex justify-between text-sm">
//           <span className="text-app-text-light">Delivery</span>
//           <span className="font-medium">{deliveryFee===0 ? <span className="text-app-success">Free</span>: `${currency}${deliveryFee.toFixed(2)}`}</span>
//           {deliveryFee>0 && <p className="text-xs text-app-text-light text-center">Free Delivery on orders over {currency}20!</p>}

//           <div className="flex justify-between text-base font-semibold border-t border-app-border pt-3">
//             <span>Total</span>
//             <span>{currency}{grandTotal.toFixed(2)}</span>
//           </div>
//           <button onClick={()=>{setIsCartOpen(false); navigate('/checkout');window.scrollTo(0,0)}}
//             className="w-full py-3 bg-app-orange text-white font-semibold rounded-xl hover:bg-app-orange-dark transition-colors flex-center gap-2 active:scale-[0.98]">Proceed to checkout <ArrowRightIcon className="size-4"/></button>
//         </div>
        
//     )}
//       </div>
//     </>
//   )
// }

// export default CartSidebar

import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";

const CartSidebar = () => {
  const currency =
    import.meta.env.VITE_CURRENCY_SYMBOL || "₹";

  const {
    items,
    updateQuantity,
    removeFromCart,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const deliveryFee = cartTotal > 500 ? 0 : 49;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <ShoppingBagIcon className="size-5 text-orange-500" />
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900">
                Your Cart
              </h2>

              <p className="text-xs text-zinc-500">
                {items.length} item
                {items.length !== 1 && "s"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl hover:bg-zinc-100 transition-colors"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50">

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                <ShoppingBagIcon className="size-10 text-zinc-400" />
              </div>

              <h3 className="text-lg font-semibold text-zinc-800 mb-1">
                Your cart is empty
              </h3>

              <p className="text-sm text-zinc-500 max-w-xs">
                Add fresh groceries and essentials to get started.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product._id}
                className="bg-white rounded-2xl p-3 shadow-sm border border-zinc-100 flex gap-3"
              >
                {/* Image */}
                <img
                  src={
                    Array.isArray(item.product.image)
                      ? item.product.image[0]
                      : item.product.image
                  }
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 bg-zinc-50"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-zinc-800 line-clamp-2">
                    {item.product.name}
                  </h4>

                  <p className="text-xs text-zinc-500 mt-1">
                    {currency}
                    {item.product.price.toFixed(2)}
                    /{item.product.unit}
                  </p>

                  <div className="flex items-center justify-between mt-3">

                    {/* Quantity */}
                    <div className="flex items-center gap-2 bg-zinc-100 rounded-xl px-2 py-1">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product._id,
                            item.quantity - 1
                          )
                        }
                        className="w-7 h-7 rounded-lg bg-white hover:bg-zinc-200 flex items-center justify-center transition"
                      >
                        <MinusIcon className="size-3" />
                      </button>

                      <span className="text-sm font-medium w-5 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product._id,
                            item.quantity + 1
                          )
                        }
                        className="w-7 h-7 rounded-lg bg-white hover:bg-zinc-200 flex items-center justify-center transition"
                      >
                        <PlusIcon className="size-3" />
                      </button>
                    </div>

                    {/* Price + Delete */}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-800 text-sm">
                        {currency}
                        {(
                          item.product.price *
                          item.quantity
                        ).toFixed(2)}
                      </span>

                      <button
                        onClick={() =>
                          removeFromCart(
                            item.product._id
                          )
                        }
                        className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-200 bg-white p-5 space-y-4">

            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Subtotal
                </span>

                <span className="font-medium">
                  {currency}
                  {cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Delivery
                </span>

                <span className="font-medium">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">
                      Free
                    </span>
                  ) : (
                    `${currency}${deliveryFee}`
                  )}
                </span>
              </div>

              {deliveryFee > 0 && (
                <p className="text-xs text-zinc-500">
                  Free delivery on orders over{" "}
                  {currency}500
                </p>
              )}

              <div className="border-t border-zinc-200 pt-3 flex justify-between text-base font-semibold">
                <span>Total</span>

                <span>
                  {currency}
                  {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate("/checkout");
                window.scrollTo(0, 0);
              }}
              className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-95"
            >
              Proceed to Checkout
              <ArrowRightIcon className="size-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;