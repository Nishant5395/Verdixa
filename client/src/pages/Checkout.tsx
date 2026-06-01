// import { useNavigate } from "react-router-dom";
// import { dummyAddressData } from "../assets/assets";

// import { useState } from "react";
// import { useCart } from "../context/CartContext";
// import type { Address } from "../types";
// import { ArrowLeft, CheckIcon, ChevronRightIcon, CreditCardIcon, MapPinIcon } from "lucide-react";
// import CheckoutAddress from "../components/Checkout/CheckoutAddress";
// import CheckoutPayment from "../components/Checkout/CheckoutPayment";
// import CheckoutReview from "../components/Checkout/CheckoutReview";

// const Checkout = () => {
//   const navigate=useNavigate()
//   const currency=import.meta.env.VITE_CURRENCY_SYMBOL||'$';
//   const {items,cartTotal}=useCart()
//   const {user}={user:{addresses:dummyAddressData}}
// const [step,setStep]=useState("address")
// const [loading,setLoading]=useState(false)
// const [address,setAddress]=useState<Address>({
//   id:"",
//   label:"Home",
//   address:"",
//   city:"",
//   state:"",
//   zip:"",
//   isDefault:false,
//   lat:0,
//   lng:0,
// })
// const [paymentMethod,setPaymentMethod]=useState('card')
// const deliveryFee=cartTotal >20 ? : 1.99;
// const tax=cartTotal*0.08;
// const total=cartTotal + deliveryFee+tax;
// const steps:{key:string;label:string;icon:typeof MapPinIcon}[]=[
//   {key:"address",label:"Address",icon:MapPinIcon},
//   {key:"payment",label:"Payment",icon:CreditCardIcon},
//   {key:"review",label:"Review",icon:CheckIcon},
// ]
// const handlePlaceOrder=async()=>{
//   setLoading(true)
//   navigate("/orders")
// }
// useState(()=>{
//   if(user?.addresses?.length){
//     const defaultAddr=user.addresses.find((a)=>a.isDefault)||user.addresses[0]
//     setAddress({
//       id:defaultAddr?.id,
//   label:defaultAddr?.label,
//   address:defaultAddr?.address,
//   city:defaultAddr?.city,
//   state:defaultAddr?.state,
//   zip:defaultAddr?.zip,
//   isDefault:defaultAddr?.isDefault,
//   lat:defaultAddr?.lat,
//   lng:defaultAddr?.lng,

//     })
//   }
// })
// if(items.length===0){
//   return(
//     <div className="min-h-screen bg-app-cream flex-center">
//       <div className="text-center">
//         <h2 className="text-xl font-semibold text-app-green mb-2">Your cart is empty</h2>
        
//        <p className="text-xl font-semibold text-app-green mb-2"></p>
//         <button onClick={()=>navigate('/products')} className="px-5 py-2.5 bg-app-green text-white text-sm font-medium rounded-xl hover:bg-app-green-light transition-colors">Browse Products</button>
//       </div>
//     </div>
//   )
// }
//   return (
//     <div className="min-h-screen bg-app-cream">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Back Button */}
//         <button onClick={()=>navigate(-1)} className="flex items-center gap-2 text-sm text-app-text-light hover:text-app-green mb-6 transition-colors">
//           <ArrowLeft className="size-4"/>Back
//         </button>
//         <h1 className="text-2xl font-semibold text-app-green mb-8">Checkout</h1>
//         {/* Steps */}
//         <div className="flex items-center gap-2 mb-8">
//           {steps.map((s,i)=>(
//             <div>
//             <button onClick={()=>setStep(s.key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${step===s.key?"bg-app-green text-white":"bg-app-text-light"}`}>
//            <s.icon className="size-4"/>{s.label}
//            {i<steps.length-1 && <ChevronRightIcon className="size-4 text-app-text-light"/>}
//             </button>
//           </div>
            
//           ))}
          
//         </div>
//         <div className="grid md:grid-cols-3 gap-6">

//           {/* main form */}
// <div className="md:col-span-2">
//   {step==="address" && <CheckoutAddress address={address} setAddress={setAddress} setStep={setStep} user={user}/>}
//   {step==="payment" && <CheckoutPayment paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} setStep={setStep} />}
//   {step==="review" && <CheckoutReview address={address} items={items} handlePlaceOrder={handlePlaceOrder} loading={loading} total={total}/>}
// </div>
//           {/* Order Summary Sidebar */}
//           <div className="bg-white rounded-2xl p-5 h-fit sticky top-24">
//             <h3 className="text-sm font-semibold text-app-green mb-4">Order Summary</h3>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-app-text-light">Subtotal ({items.length} items)</span>
//                 <span>{currency}{cartTotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-app-text-light">Delivery</span>
//                 <span>{deliveryFee===0 ? <span className="text-app-success">Free</span>:`${currency}${deliveryFee.toFixed(2)}`}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-app-text-light">Tax</span>
//                 <span>{currency}{tax.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between pt-3 border-t border-app-border text-base font-semibold">
//                 <span >Total</span>
//                 <span className="text-app-green">{currency}{total.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Checkout
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckIcon,
  ChevronRightIcon,
  CreditCardIcon,
  MapPinIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "lucide-react";


import { useCart } from "../context/CartContext";

import type { Address } from "../types";

import CheckoutAddress from "../components/Checkout/CheckoutAddress";
import CheckoutPayment from "../components/Checkout/CheckoutPayment";
import CheckoutReview from "../components/Checkout/CheckoutReview";
import api from "../config/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/authContext";

const Checkout = () => {
  const navigate = useNavigate();

  const currency =
    import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  const { items, cartTotal,clearCart } = useCart();

  const{ user} = useAuth()

  const [step, setStep] = useState<
    "address" | "payment" | "review"
  >("address");

  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState<Address>({
    id: "",
    label: "Home",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
    lat: 0,
    lng: 0,
  });

  const [paymentMethod, setPaymentMethod] =
    useState("card");

  // Delivery & Tax
  const deliveryFee = cartTotal > 20 ? 0 : 1.99;

  const tax = cartTotal * 0.08;

  const total = cartTotal + deliveryFee + tax;

  // Checkout Steps
  const steps = [
    {
      key: "address",
      label: "Address",
      icon: MapPinIcon,
    },
    {
      key: "payment",
      label: "Payment",
      icon: CreditCardIcon,
    },
    {
      key: "review",
      label: "Review",
      icon: CheckIcon,
    },
  ];

  // Default Address
  useEffect(() => {
    if (user?.addresses?.length) {
      const defaultAddr =
        user.addresses.find((a) => a.isDefault) ||
        user.addresses[0];

      setAddress({
        id: defaultAddr.id,
        label: defaultAddr.label,
        address: defaultAddr.address,
        city: defaultAddr.city,
        state: defaultAddr.state,
        zip: defaultAddr.zip,
        isDefault: defaultAddr.isDefault,
        lat: defaultAddr.lat,
        lng: defaultAddr.lng,
      });
    }
  }, []);

  // Place Order
  const handlePlaceOrder = async () => {
    try {
     const orderData={
      items:items.map((item)=>({
        product:item.product.id,
        quantity:item.quantity,

      })),
      shippingAddress:address,
      paymentMethod
     }
     const {data}=await api.post('/orders',orderData)
     console.log(data)
     if(data.url){
      window.location.href=data.url;
      return;
     }
     clearCart()
     toast.success("Order placed successfully!");
     navigate(`/orders/${data.order.id}`)
    } catch (error:any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
      scrollTo(0,0);
    }
  };

  // Empty Cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="bg-white border border-zinc-200 shadow-sm rounded-3xl p-10 max-w-md w-full text-center">
          <div className="size-20 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-5">
            <TruckIcon className="size-9 text-zinc-400" />
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            Your cart is empty
          </h2>

          <p className="text-sm text-zinc-500 mb-6">
            Looks like you haven’t added anything yet.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="w-full py-3 rounded-2xl bg-app-green text-white font-semibold hover:opacity-90 transition-all"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-app-green transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">
              Checkout
            </h1>

            <p className="text-sm text-zinc-500 mt-1">
              Complete your order securely
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheckIcon className="size-4 text-green-600" />
              Secure Payment
            </div>

            <div className="flex items-center gap-1.5">
              <TruckIcon className="size-4 text-app-orange" />
              Fast Delivery
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center overflow-x-auto gap-3 mb-8 pb-2">
          {steps.map((s, i) => {
            const Icon = s.icon;

            const active = step === s.key;

            return (
              <div
                key={s.key}
                className="flex items-center gap-3"
              >
                <button
                  onClick={() =>
                    setStep(
                      s.key as
                        | "address"
                        | "payment"
                        | "review"
                    )
                  }
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all border ${
                    active
                      ? "bg-app-green text-white border-app-green shadow-lg shadow-green-100"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-app-green/40"
                  }`}
                >
                  <Icon className="size-4" />
                  {s.label}
                </button>

                {i < steps.length - 1 && (
                  <ChevronRightIcon className="size-4 text-zinc-300 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-5 md:p-7">
              {step === "address" && (
                <CheckoutAddress
                  address={address}
                  setAddress={setAddress}
                  setStep={setStep}
                  user={user}
                />
              )}

              {step === "payment" && (
                <CheckoutPayment
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  setStep={setStep}
                />
              )}

              {step === "review" && (
                <CheckoutReview
                  address={address}
                  items={items}
                  handlePlaceOrder={handlePlaceOrder}
                  loading={loading}
                  total={total}
                />
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            {/* Order Summary */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-zinc-900 mb-5">
                Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-4 mb-5">
                {items.slice(0, 3).map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="size-14 rounded-xl object-cover border border-zinc-200"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-800 truncate">
                        {item.product.name}
                      </p>

                      <p className="text-xs text-zinc-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-zinc-900">
                      {currency}
                      {(
                        item.product.price *
                        item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="space-y-3 text-sm border-t border-zinc-200 pt-4">
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

                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-green-600 font-medium">
                        Free
                      </span>
                    ) : (
                      `${currency}${deliveryFee.toFixed(
                        2
                      )}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">
                    Tax
                  </span>

                  <span>
                    {currency}
                    {tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between pt-4 border-t border-zinc-200 text-base font-bold">
                  <span>Total</span>

                  <span className="text-app-green">
                    {currency}
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Delivery Note */}
              <div className="mt-5 rounded-2xl bg-green-50 border border-green-100 p-4">
                <p className="text-xs text-green-700 leading-relaxed">
                  Your order qualifies for secure
                  delivery tracking and live updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;