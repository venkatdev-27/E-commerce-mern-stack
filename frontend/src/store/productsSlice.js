import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts } from '@/api/product.api';

const initialState = {
  products: [],
  loading: false,
  error: null,
};

/* =========================
   FETCH PRODUCTS BY CATEGORY
========================= */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (categoryId, { rejectWithValue }) => {
    try {
      const params = categoryId ? { category: categoryId } : {};
      const response = await getProducts(params);
      return response.products || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

/* =========================
   SLICE
========================= */
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
