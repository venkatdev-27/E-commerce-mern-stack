import adminAxios from "./adminAxios";

/* ================================
   GET ALL ORDERS
================================ */
export const getOrders = async (params = {}) => {
  try {
    const { data } = await adminAxios.get("/orders", { params });
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch orders"
    );
  }
};

/* ================================
   GET SINGLE ORDER
================================ */
export const getOrderById = async (id) => {
  try {
    const { data } = await adminAxios.get(`/orders/${id}`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch order"
    );
  }
};

/* ================================
   UPDATE ORDER STATUS
================================ */
export const updateOrderStatus = async (id, status) => {
  try {
    const { data } = await adminAxios.put(`/orders/${id}/status`, { status });
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update order status"
    );
  }
};
