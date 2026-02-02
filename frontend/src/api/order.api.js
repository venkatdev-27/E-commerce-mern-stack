import axiosInstance from '@/api/axiosInstance';

/* =========================
   ORDERS API
========================= */
export const placeOrder = ({ items, totalAmount, paymentMethod, shippingAddress }) =>
  axiosInstance.post("/orders", {
    items,          // ✅ MUST be "items"
    totalAmount,    // ✅ MUST be "totalAmount"
    paymentMethod,
    shippingAddress,
  });

export const getOrders = () =>
  axiosInstance.get("/orders");

export const getOrderById = (orderId) =>
  axiosInstance.get(`/orders/${orderId}`);

export const submitReview = (orderId, rating) =>
  axiosInstance.post(`/orders/${orderId}/review`, { rating });
