import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";

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
  XCircleIcon,
} from "lucide-react";
import api from "../config/api";
import { toast } from "react-hot-toast";
import { errorMessage } from "../utils/errorMessage";

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

  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const cancelOrder = async (e: MouseEvent, orderId: string) => {
    e.preventDefault(); // this card is a <Link>; don't navigate to the order page
    e.stopPropagation();
    if (!window.confirm("Cancel this order? This can't be undone.")) return;
    setCancellingId(orderId);
    try {
      const { data } = await api.put(`/orders/${orderId}/cancel`);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      toast.success("Order cancelled");
    } catch (error) {
      toast.error(errorMessage(error, "Could not cancel this order"));
    } finally {
      setCancellingId(null);
    }
  };

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

                    {["Placed", "Confirmed", "Assigned"].includes(order.status) && (
                      <button
                        onClick={(e) => cancelOrder(e, order.id)}
                        disabled={cancellingId === order.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <XCircleIcon className="size-3.5" />
                        {cancellingId === order.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}

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