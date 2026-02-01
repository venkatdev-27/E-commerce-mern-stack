import { createSlice } from '@reduxjs/toolkit';
const loadUser = () => {
    try {
        const serializedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (serializedUser && token) {
            return { user: JSON.parse(serializedUser), isAuthenticated: true };
        }
    }
    catch (err) {
        // Ignore write errors
    }
    return { user: null, isAuthenticated: false };
};
const initialState = loadUser();
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        updateProfile: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        }
    },
});
export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
