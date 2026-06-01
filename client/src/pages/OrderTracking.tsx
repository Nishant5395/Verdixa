import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Order } from "../types";

import Loading from "../components/Loading";

import {
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  PackageCheckIcon,
} from "lucide-react";

import OrderOTP from "../components/OrderTracking/OrderOTP";
import LiveMap from "../components/OrderTracking/LiveMap";
import OrderTimeLine from "../components/OrderTracking/OrderTimeLine";
import api from "../config/api";

const OrderTracking = () => {
  const currency =
    import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [liveLocation, setLiveLocation] =
    useState<{
      lat: number;
      lng: number;
    } | null>(null);

  useEffect(() => {
  api.get(`/orders/${id}`)
    .then((res) => {
      console.log("Order response:", res.data);
      setOrder(res.data.order);
    })
    .catch((err) => {
      console.log("Order fetch error:", err.response?.data);
      navigate("/orders");
    })
    .finally(() => setLoading(false));
}, [id, navigate]);

  //live location every 10 seconds
  useEffect(()=>{
    if(!order || ["Delivered","Cancelled","Placed"].includes(order.status))return;
    const fetchLocation=async()=>{
      try {
        const {data}=await api.get(`/orders/${id}/location`)
        if(data.liveLocation?.lat && data.liveLocation?.lng && data.liveLocation.updatedAt){
          setLiveLocation({
            lat:data.liveLocation.lat,
            lng:data.liveLocation.lng
          })
        }
        //Also update order status if it changed
        if(data.status && data.status !== order.status){
          setOrder((prev)=>prev ? {...prev,status:data.status}:prev)
        }
      } catch {
        
      }
    }
    fetchLocation()
    const interval=setInterval(fetchLocation,10000)
    return ()=>clearInterval(interval)
  },[id,order?.status])

  if (loading) return <Loading />;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-10 text-center max-w-md w-full">
          <PackageCheckIcon className="size-16 mx-auto text-zinc-300 mb-4" />

          <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
            Order not found
          </h2>

          <p className="text-zinc-500 mb-6">
            The order you are looking for
            does not exist.
          </p>

          <button
            onClick={() => navigate("/orders")}
            className="px-5 py-3 bg-app-green text-white rounded-xl font-medium hover:opacity-90 transition-all"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-app-green transition-colors mb-6"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Orders
        </button>

        {/* Header */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="text-sm text-zinc-500 mb-1">
                Tracking Order
              </p>

              <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">
                #
                {order.id
                  .slice(-8)
                  .toUpperCase()}
              </h1>

              <p className="text-sm text-zinc-500 mt-2">
                Placed on{" "}
                {new Date(
                  order.createdAt
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <span
              className={`px-5 py-2 rounded-full text-sm font-semibold w-fit ${
                order.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : order.status === "Cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* OTP */}
            <OrderOTP order={order} />

            {/* Live Map */}
            <LiveMap
              order={order}
              liveLocation={liveLocation}
            />

            {/* Timeline */}
            <OrderTimeLine order={order} />

            {/* Delivery Partner */}
            {order.deliveryPartner &&
              order.status !== "Delivered" &&
              order.status !== "Cancelled" && (
                <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-14 rounded-full bg-app-green flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-lg">
                          {order.deliveryPartner.name
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-semibold text-zinc-900">
                          {
                            order.deliveryPartner
                              .name
                          }
                        </h3>

                        <p className="text-sm text-zinc-500 capitalize">
                          {order
                            .deliveryPartner
                            .vehicleType ||
                            "Delivery"}{" "}
                          Partner
                        </p>
                      </div>
                    </div>

                    {order.deliveryPartner
                      .phone && (
                      <a
                        href={`tel:${order.deliveryPartner.phone}`}
                        className="size-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
                      >
                        <PhoneIcon className="size-5 text-app-green" />
                      </a>
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-5">
              <h3 className="text-base font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <MapPinIcon className="size-5 text-app-green" />
                Delivery Address
              </h3>

              <div className="text-sm text-zinc-600 leading-7">
                <p className="font-medium text-zinc-900">
                  {
                    order.shippingAddress
                      .label
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      .address
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      .city
                  }
                  ,{" "}
                  {
                    order.shippingAddress
                      .state
                  }{" "}
                  -{" "}
                  {
                    order.shippingAddress
                      .zip
                  }
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-5">
              <h3 className="text-base font-semibold text-zinc-900 mb-5">
                Order Items (
                {order.items.length})
              </h3>

              <div className="space-y-4">
                {order.items.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-14 rounded-xl object-cover border border-zinc-200"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-zinc-900 truncate">
                          {item.name}
                        </h4>

                        <p className="text-xs text-zinc-500 mt-1">
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-zinc-900">
                        {currency}
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* Pricing */}
              <div className="mt-6 pt-5 border-t border-zinc-200 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">
                    Subtotal
                  </span>

                  <span className="font-medium">
                    {currency}
                    {order.subtotal.toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">
                    Delivery Fee
                  </span>

                  <span className="font-medium">
                    {order.deliveryFee ===
                    0
                      ? "Free"
                      : `${currency}${order.deliveryFee.toFixed(
                          2
                        )}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">
                    Tax
                  </span>

                  <span className="font-medium">
                    {currency}
                    {order.tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between pt-4 border-t border-zinc-200 text-base font-semibold text-zinc-900">
                  <span>Total</span>

                  <span className="text-app-green">
                    {currency}
                    {order.total.toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;