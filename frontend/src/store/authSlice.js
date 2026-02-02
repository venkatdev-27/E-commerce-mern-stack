import { createSlice } from "@reduxjs/toolkit";

/* =========================
   LOAD USER FROM STORAGE
========================= */
const loadUser = () => {
  try {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (user && token) {
      return {
        user: JSON.parse(user),
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.warn("Auth storage load failed");
  }

  return {
    user: null,
    isAuthenticated: false,
  };
};

const initialState = loadUser();

/* =========================
   AUTH SLICE
========================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* ✅ LOGIN */
    login: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },

    /* ✅ LOGOUT */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    /* ✅ UPDATE PROFILE */
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
