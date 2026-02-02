import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { placeOrder, getOrders, getOrderById } from "@/api";
import { logout } from "@/store/authSlice";

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

/* =========================
   PLACE ORDER (FIXED)
========================= */
export const placeOrderAsync = createAsyncThunk(
  "orders/place",
  async (
    { items, totalAmount, paymentMethod, shippingAddress },
    { rejectWithValue, dispatch }
  ) => {
    try {
      // 🔥 CRITICAL GUARD (fixes your error)
      if (!items || !Array.isArray(items) || items.length === 0) {
  throw new Error("Cart items are required");
}


      const res = await placeOrder({
        items,
        totalAmount,
        paymentMethod,
        shippingAddress,
      });

      if (!res || !res.order) {
        throw new Error("Invalid order response");
      }

      return res.order;
    } catch (err) {
      if (err.message === "Unauthorized") {
        dispatch(logout());
      }
      return rejectWithValue(err.message || "Failed to place order");
    }
  }
);

/* =========================
   FETCH ALL ORDERS
========================= */
export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await getOrders();

      if (!res || !Array.isArray(res.orders)) {
        throw new Error("Invalid orders response");
      }

      return res.orders;
    } catch (err) {
      if (err.message === "Unauthorized") {
        dispatch(logout());
      }
      return rejectWithValue(err.message || "Failed to fetch orders");
    }
  }
);

/* =========================
   FETCH ORDER BY ID
========================= */
export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (orderId, { rejectWithValue, dispatch }) => {
    try {
      const res = await getOrderById(orderId);

      if (!res || !res.order) {
        throw new Error("Invalid order response");
      }

      return res.order;
    } catch (err) {
      if (err.message === "Unauthorized") {
        dispatch(logout());
      }
      return rejectWithValue(err.message || "Failed to fetch order");
    }
  }
);

/* =========================
   SLICE
========================= */
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
