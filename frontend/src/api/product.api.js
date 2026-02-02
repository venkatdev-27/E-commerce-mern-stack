import axiosInstance from "@/api/axiosInstance";

/* =========================
   PRODUCTS API
========================= */

// Get products with filters, sort, pagination
export const getProducts = (params = {}) => {
  return axiosInstance.get("/products", { params });
};

/* =========================
   🔍 REAL SEARCH (TEXT SEARCH)
========================= */
export const searchProducts = (query) => {
  if (!query) {
    return Promise.resolve({ success: true, data: [] });
  }

  return axiosInstance.get("/products/search", {
    params: { q: query },
  });
};

/* =========================
   SINGLE PRODUCT
========================= */
export const getProductById = (id) => {
  if (!id) {
    return Promise.reject(new Error("Product ID is required"));
  }

  return axiosInstance.get(`/products/${id}`);
};

/* =========================
   META FILTERS
========================= */
export const getBrands = () => {
  return axiosInstance.get("/products/meta/brands");
};

/* =========================
   🏠 HOME PAGE (OPTIMIZED)
========================= */
export const getHomePageData = () => {
  return axiosInstance.get("/home");
};
