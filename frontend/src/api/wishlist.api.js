import axiosInstance from './axiosInstance';

/* =========================
   WISHLIST API
========================= */
export const getWishlist = () =>
  axiosInstance.get("/wishlist");

export const addToWishlist = (productId) =>
  axiosInstance.post("/wishlist/add", { productId });

export const removeFromWishlist = (productId) =>
  axiosInstance.delete(`/wishlist/remove/${productId}`);
