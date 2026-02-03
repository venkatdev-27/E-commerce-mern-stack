import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchOrders, clearOrders } from "@/store/orderSlice";
import { submitReview } from "@/api/order.api";
import { Package, Clock, Search, Star } from "lucide-react";

const MyOrdersPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useAppSelector(
    (state) => state.orders
  );

  const [ratingOrder, setRatingOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [toast, setToast] = useState(null);

  // 🔥 Always load fresh orders
  useEffect(() => {
    dispatch(fetchOrders());

    return () => {
      // cleanup stale data when leaving page
      dispatch(clearOrders());
    };
  }, [dispatch]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Clock className="w-6 h-6 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <Package size={40} className="text-red-400 mb-4" />
        <p className="text-red-500 mb-6">{error}</p>
        <button
          onClick={() => dispatch(fetchOrders())}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ---------------- EMPTY ---------------- */
  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-6 rounded-full shadow-sm mb-6">
          <Package size={48} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          No orders yet
        </h2>
        <p className="text-gray-500 mb-8 max-w-md">
          You haven’t placed any orders yet.
        </p>
        <Link
          to="/shop"
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Orders
            </h1>
            <p className="text-gray-500 text-sm">
              Track and manage your purchases
            </p>
          </div>

          {/* Search UI (future use) */}
          <div className="relative w-64 hidden md:block">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search order..."
              className="pl-9 pr-4 py-2 w-full border rounded-xl text-sm"
              disabled
            />
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const items = Array.isArray(order.items)
              ? order.items
              : [];

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border"
              >
                {/* HEADER */}
                <div className="bg-gray-50 px-5 py-3 flex justify-between text-sm border-b">
                  <div>
                    <span className="block text-xs text-gray-500">
                      Placed On
                    </span>
                    <span className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </span>
                  </div>

                 

                  <div>
                    <span className="block text-xs text-gray-500">
                      Order ID
                    </span>
                    <span className="font-mono text-gray-600">
                      {order.orderNumber}
                    </span>
                  </div>
                </div>

                {/* STATUS */}
                <div className="p-4">
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === "Delivered"
                          ? "bg-green-50 text-green-700"
                          : order.status === "Cancelled"
                          ? "bg-red-50 text-red-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      <Package size={14} /> {order.status}
                    </span>
                  </div>

                  {/* ITEMS */}
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          <p className="font-bold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() =>
                        navigate(`/orders/${order._id}`)
                      }
                      className="px-4 py-2 border rounded-xl text-sm font-semibold"
                    >
                      Track Order
                    </button>

                    {order.status === "Delivered" && !order.hasReviewed && (
                      <button
                        onClick={() => setRatingOrder(order)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2"
                      >
                        <Star size={16} /> Review
                      </button>
                    )}

                    {order.status === "Delivered" && order.hasReviewed && (
                      <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-semibold flex items-center gap-2">
                        <Star size={16} className="fill-current" /> Reviewed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rating Modal */}
        {ratingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Rate Your Order
              </h3>
              <p className="text-gray-600 mb-6">
                How was your experience with order {ratingOrder.orderNumber}?
              </p>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setRatingOrder(null);
                    setRating(0);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await submitReview(ratingOrder._id, rating);
                      setToast({ message: "Thank you for your review!", type: "success" });
                      setTimeout(() => setToast(null), 3000);
                      // Refresh orders to show updated hasReviewed status
                      dispatch(fetchOrders());
                      setRatingOrder(null);
                      setRating(0);
                    } catch (error) {
                      console.error("Review submission failed:", error);
                      setToast({ message: "Failed to submit review. Please try again.", type: "error" });
                      setTimeout(() => setToast(null), 3000);
                    }
                  }}
                  disabled={rating === 0}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50">
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
