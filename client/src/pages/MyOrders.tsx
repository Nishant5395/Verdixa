// import { useEffect, useState } from "react";
// import type { Order } from "../types";
// import { useSearchParams } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { dummyDashboardOrdersData, statusColors } from "../assets/assets";
// import Loading from "../components/Loading";
// import { CalendarIcon, ChevronRightIcon, Link, PackageIcon } from "lucide-react";

// const MyOrders = () => {
//   const currency=import.meta.env.VITE_CURRENCY_SYMBOL || "$";
//   const [orders,setOrders]=useState<Order[]>([])
//   const [loading,setLoading]=useState(true)
//   const [activeTab,setActiveTab]=useState("all")
//   const [searchParams,setSearchParms]=useSearchParams()
//   const tabs=["all","Placed","Out for Delivery","Delivered"]
//   const {clearCart}=useCart()
//   const fetchOrders=async()=>{
//     setOrders(dummyDashboardOrdersData as any)setLoading(false)
//   }
//   useEffect(()=>{
//     if(searchParams.get("clearCart")){
//       clearCart();
//       setSearchParms({});
//       setTimeout(()=>{
//         fetchOrders()
//       },2000)
//     }else{
//       fetchOrders()
//     }
//     // setLoading(false)
//   },[activeTab])
//   return (
//     <div className="min-h-screen bg-app-cream mb-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-2xl font-semibold text-app-green mb-6">My Orders</h1>
//         {/* Tabs */}
//         <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
//           {tabs.map((tab)=>(
//             <button key={tab} onClick={()=>setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${activeTab===tab ? "bg-app-green text-white" : "bg-white text-app-text-light hover:bg-app-cream"}`}>
//               {tab==='all' ?"All Orders":tab}
//             </button>
//           ))}
//         </div>
//         {/* Orders List */}
//         {loading ? (
//           <Loading/>

//         ):orders.length===0 ? (
//           <div className="text-center py-16">
//             <PackageIcon className="size-16 text-app-border mx-auto mb-4"/>
//             <h2 className="text-lg font-medium text-app-green mb-2">No Orders yet</h2>
//             <p className="text-sm text-app-text-light mb-4">Start shopping to see your orders here</p>
//             <Link to="/products" className="inline-flex px-4 py-2 bg-app-green text-white text-sm rounded-lg">Start Shopping</Link>
//             </div>
//         ):(
//           <div className="space-y-4">
//             {orders.map((order)=>(
//               <Link key={order.id} to={`/orders/${order.id}`}
//               className="block max-w-4xl bg-white rounded-2xl p-5 hover:shadow transition-all">
//                 {/* order id,date & status */}
//                 <div className="flex items-start justify-between mb-3">
//                   {/* left */}
//                   <div>
//                     <p className="text-sm font-medium text-app-green">Order #{order.id.slice(-8).toUpperCase()}</p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <CalendarIcon className="size-3 text-app-text-light"/>
//                       <span className="text-xs text-app-text-light">{new Date(order.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
//                     </div>
//                   </div>
//                   {/* right */}
//                   <div className="flex items-center gap-2">
//                     <span className={`px-4 py-1 text-xs font-medium rounded-full ${statusColors[order.status]|| "bg-gray-100 text-gray-700"}`}>
//                       {order.status}
//                     </span>
//                     <ChevronRightIcon className="size-4 text-app-text-light"/>
//                   </div>
//                 </div>
//                 {/* Item thumbnails */}
//                 <div className="flex items-center gap-2 mb-3">{
//                   order.items.slice(0,4).map((item,i)=>(
//                     <img key={i} src={item.image} alt={item.name}
//                     className="size-12 sm:size-16 rounded-lg object-cover border border-app-border"/>
//                   ))}
//                   {
//                     order.items.length>4 && <div className="size-12 sm:size-16 rounded-lg bg-app-cream flex-center text-xs font-semibold text-app-text-light">+{order.items.length-4}</div>
//                   }</div>
//                   {/* total items & price */}
//                   <div className="flex justify-between items-center pt-3 text-sm">
//                     <span className="text-app-text-light">{order.items.length} items</span>
//                     <span className="font-semibold text-app-green">{currency}{order.total.toFixed(2)}</span>
//                   </div>
//               </Link>
//             ))}
//         )

//         }
//       </div>
    
//     </div>
//   )
// }

// export default MyOrders

import { useEffect, useMemo, useState } from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import type { Order } from "../types";

import { useCart } from "../context/CartContext";

import {
  statusColors
} from "../assets/assets";

import Loading from "../components/Loading";

import {
  CalendarIcon,
  ChevronRightIcon,
  Clock3Icon,
  PackageIcon,
  ShoppingBagIcon,
  TruckIcon,
} from "lucide-react";
import api from "../config/api";
import { toast } from "react-hot-toast";

const MyOrders = () => {
  const currency =
    import.meta.env
      .VITE_CURRENCY_SYMBOL || "$";

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("all");

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const { clearCart } = useCart();

  const tabs = [
    "all",
    "Placed",
    "Out for Delivery",
    "Delivered",
  ];

  /* ---------------- FETCH ORDERS ---------------- */

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params=activeTab !== "all" ? `?status=${activeTab}` : "";
      const {data}=await api.get(`/orders${params}`)
      setOrders(data.orders)
    } catch (error:any) {
      toast.error(error.response?.data?.message || error?.message);
      
    }finally{
      setLoading(false);
    }
  };

  /* ---------------- EFFECT ---------------- */

  useEffect(() => {
    if (searchParams.get("clearCart")) {
      clearCart();

      setSearchParams({});

      fetchOrders();
    } else {
      fetchOrders();
    }
  }, [activeTab]);

  /* ---------------- TOTALS ---------------- */

  const totalSpent = useMemo(() => {
    return orders.reduce(
      (sum, order) =>
        sum + order.total,
      0
    );
  }, [orders]);

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">

      {/* PAGE CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">
              My Orders
            </h1>

            <p className="text-zinc-500 mt-2">
              Track your recent grocery
              purchases and deliveries.
            </p>
          </div>

          {/* STATS */}
          <div className="flex flex-wrap gap-4">

            <div className="bg-white border border-zinc-200 rounded-2xl px-5 py-4 shadow-sm min-w-35">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBagIcon className="size-4 text-app-green" />

                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  Orders
                </span>
              </div>

              <p className="text-2xl font-bold text-zinc-900">
                {orders.length}
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl px-5 py-4 shadow-sm min-w-35">
              <div className="flex items-center gap-2 mb-2">
                <TruckIcon className="size-4 text-app-green" />

                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  Total Spent
                </span>
              </div>

              <p className="text-2xl font-bold text-zinc-900">
                {currency}
                {totalSpent.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab)
              }
              className={`px-5 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab
                  ? "bg-app-green text-white shadow-lg shadow-green-100"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {tab === "all"
                ? "All Orders"
                : tab}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (

          /* EMPTY STATE */
          <div className="bg-white border border-zinc-200 rounded-4xl py-20 px-6 text-center shadow-sm">

            <div className="size-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
              <PackageIcon className="size-10 text-orange-500" />
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 mb-3">
              No Orders Yet
            </h2>

            <p className="text-zinc-500 max-w-md mx-auto mb-8 leading-relaxed">
              Looks like you haven’t
              placed any orders yet.
              Start shopping fresh
              groceries and essentials.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-app-green text-white font-semibold hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (

          /* ORDERS LIST */
          <div className="space-y-5">

            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-white border border-zinc-200 rounded-[28px] p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >

                {/* TOP */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">

                  {/* LEFT */}
                  <div>
                    <p className="text-lg font-bold text-zinc-900">
                      Order #
                      {order.id
                        .slice(-8)
                        .toUpperCase()}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-zinc-500">

                      <CalendarIcon className="size-4" />

                      <span className="text-sm">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-US",
                          {
                            month:
                              "short",
                            day: "numeric",
                            year:
                              "numeric",
                          }
                        )}
                      </span>

                      <span>•</span>

                      <Clock3Icon className="size-4" />

                      <span className="text-sm">
                        Estimated
                        delivery in 30
                        mins
                      </span>
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className="flex items-center gap-3">

                    <span
                      className={`px-4 py-2 rounded-full text-xs font-semibold ${
                        statusColors[
                          order.status
                        ] ||
                        "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {order.status}
                    </span>

                    <ChevronRightIcon className="size-5 text-zinc-400" />
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">

                  {order.items
                    .slice(0, 5)
                    .map((item, i) => (
                      <img
                        key={i}
                        src={item.image}
                        alt={item.name}
                        className="size-16 rounded-2xl object-cover border border-zinc-200 bg-zinc-50 shrink-0"
                      />
                    ))}

                  {order.items.length >
                    5 && (
                    <div className="size-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-sm font-semibold text-zinc-500 shrink-0">
                      +
                      {order.items.length -
                        5}
                    </div>
                  )}
                </div>

                {/* BOTTOM */}
                <div className="flex items-center justify-between pt-5 mt-5 border-t border-zinc-100">

                  <div>
                    <p className="text-sm text-zinc-500">
                      {order.items.length}{" "}
                      item
                      {order.items.length >
                        1 && "s"}
                    </p>

                    <p className="text-xs text-zinc-400 mt-1">
                      Paid securely via
                      online payment
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-zinc-500 mb-1">
                      Total Amount
                    </p>

                    <p className="text-2xl font-bold text-app-green">
                      {currency}
                      {order.total.toFixed(
                        2
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;