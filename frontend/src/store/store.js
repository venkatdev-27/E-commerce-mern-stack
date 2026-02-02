import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import cartReducer from '@/store/cartSlice';
import wishlistReducer from '@/store/wishlistSlice';
import authReducer from '@/store/authSlice';
import orderReducer from '@/store/orderSlice';
import productsReducer from '@/store/productsSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
        auth: authReducer,
        orders: orderReducer,
        products: productsReducer,
    },
});

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
