import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/api";
import { logout } from "./authSlice";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

/* =========================
   FETCH WISHLIST
========================= */
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await getWishlist();
      return res.products;
    } catch (err) {
      // If unauthorized, logout the user
      if (err.message === "Unauthorized") {
        dispatch(logout());
      }
      return rejectWithValue(err.message || "Failed to fetch wishlist");
    }
  }
);

/* =========================
   ADD TO WISHLIST
========================= */
export const addToWishlistAsync = createAsyncThunk(
  "wishlist/add",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const res = await addToWishlist(productId);
      return res.products; // ✅ backend truth
    } catch (err) {
      // If unauthorized, logout the user
      if (err.message === "Unauthorized") {
        dispatch(logout());
      }
      return rejectWithValue(err.message || "Failed to add to wishlist");
    }
  }
);

/* =========================
   REMOVE FROM WISHLIST
========================= */
export const removeFromWishlistAsync = createAsyncThunk(
  "wishlist/remove",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const res = await removeFromWishlist(productId);
      return res.products; // ✅ backend truth
    } catch (err) {
      // If unauthorized, logout the user
      if (err.message === "Unauthorized") {
        dispatch(logout());
      }
      return rejectWithValue(err.message || "Failed to remove from wishlist");
    }
  }
);

/* =========================
   SLICE
========================= */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ADD */
      .addCase(addToWishlistAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      /* REMOVE */
      .addCase(removeFromWishlistAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlistAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
