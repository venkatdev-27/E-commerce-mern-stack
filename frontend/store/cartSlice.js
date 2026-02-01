import { createSlice } from '@reduxjs/toolkit';
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('cart');
        if (serializedState === null) {
            return { items: [], totalAmount: 0 };
        }
        return JSON.parse(serializedState);
    }
    catch (err) {
        return { items: [], totalAmount: 0 };
    }
};
const initialState = loadState();
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { selectedSize, ...product } = action.payload;
            const productId = product._id || product.id;
            // Find item with same ID AND same size
            const existingItem = state.items.find(item => (item._id || item.id) === productId && item.selectedSize === selectedSize);
            if (existingItem) {
                existingItem.quantity += 1;
            }
            else {
                state.items.push({ ...product, quantity: 1, selectedSize });
            }
            // Calculate total with discounts
            state.totalAmount = state.items.reduce((total, item) => {
                const discountPercent = item.discount || 0;
                const discountedPrice = item.price - (item.price * discountPercent / 100);
                return total + discountedPrice * item.quantity;
            }, 0);
            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => !((item._id || item.id) === action.payload.id && item.selectedSize === action.payload.selectedSize));
            // Calculate total with discounts
            state.totalAmount = state.items.reduce((total, item) => {
                const discountPercent = item.discount || 0;
                const discountedPrice = item.price - (item.price * discountPercent / 100);
                return total + discountedPrice * item.quantity;
            }, 0);
            localStorage.setItem('cart', JSON.stringify(state));
        },
        updateQuantity: (state, action) => {
            const itemIndex = state.items.findIndex(item => (item._id || item.id) === action.payload.id &&
                (action.payload.selectedSize ? item.selectedSize === action.payload.selectedSize : true));
            if (itemIndex !== -1) {
                const newQuantity = action.payload.quantity;
                if (newQuantity <= 0) {
                    state.items.splice(itemIndex, 1);
                } else {
                    state.items[itemIndex].quantity = newQuantity;
                }
            }
            // Calculate total with discounts
            state.totalAmount = state.items.reduce((total, item) => {
                const discountPercent = item.discount || 0;
                const discountedPrice = item.price - (item.price * discountPercent / 100);
                return total + discountedPrice * item.quantity;
            }, 0);
            localStorage.setItem('cart', JSON.stringify(state));
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            localStorage.removeItem('cart');
        },
    },
});
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
