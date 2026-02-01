import adminAxios from "./adminAxios";

/* ================================
   GET ALL CATEGORIES
================================ */
export const getCategories = async () => {
  try {
    const { data } = await adminAxios.get("/categories");
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch categories"
    );
  }
};

/* ================================
   CREATE CATEGORY
================================ */
export const createCategory = async (category) => {
  try {
    const config = category instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};

    const { data } = await adminAxios.post("/categories", category, config);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create category"
    );
  }
};

/* ================================
   UPDATE CATEGORY
================================ */
export const updateCategory = async (id, category) => {
  try {
    const config = category instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};

    const { data } = await adminAxios.put(`/categories/${id}`, category, config);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update category"
    );
  }
};

/* ================================
   DELETE CATEGORY
================================ */
export const deleteCategory = async (id) => {
  try {
    const { data } = await adminAxios.delete(`/categories/${id}`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete category"
    );
  }
};
