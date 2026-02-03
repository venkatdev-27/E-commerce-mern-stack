import adminAxios from "./adminAxios";

/* ================================
   GET ALL PRODUCTS
================================ */
export const getProducts = async (params = {}) => {
  try {
    const { data } = await adminAxios.get("/products", { params });
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
};

/* ================================
   CREATE PRODUCT (FormData)
================================ */
export const createProduct = async (productFormData) => {
  try {
    const { data } = await adminAxios.post(
      "/products",
      productFormData
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create product"
    );
  }
};

/* ================================
   UPDATE PRODUCT (FormData)
================================ */
export const updateProduct = async (id, productFormData) => {
  try {
    const { data } = await adminAxios.put(
      `/products/${id}`,
      productFormData
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update product"
    );
  }
};

/* ================================
   DELETE PRODUCT
================================ */
export const deleteProduct = async (id) => {
  try {
    const { data } = await adminAxios.delete(`/products/${id}`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete product"
    );
  }
};
