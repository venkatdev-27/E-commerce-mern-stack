import axiosInstance from "./axiosInstance";

/* =========================
   PRODUCTS API
========================= */

// Get products with filters, sort, pagination
export const getProducts = async (params = {}) => {
  return axiosInstance.get("/products", { params });
};

/* =========================
   🔍 REAL SEARCH (TEXT SEARCH)
========================= */
export const searchProducts = async (query) => {
  return axiosInstance.get("/products/search", {
    params: { q: query },
  });
};

/* =========================
   SINGLE PRODUCT
========================= */
export const getProductById = async (id) => {
  return axiosInstance.get(`/products/${id}`);
};

/* =========================
   META FILTERS
========================= */
export const getBrands = async () => {
  return axiosInstance.get("/products/meta/brands");
};
