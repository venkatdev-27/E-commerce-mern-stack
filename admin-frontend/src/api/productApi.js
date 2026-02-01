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
   CREATE PRODUCT
================================ */
export const createProduct = async (product) => {
  try {
    const { data } = await adminAxios.post("/products", product);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create product"
    );
  }
};

/* ================================
   UPDATE PRODUCT
================================ */
export const updateProduct = async (id, product) => {
  try {
    const { data } = await adminAxios.put(`/products/${id}`, product);
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
