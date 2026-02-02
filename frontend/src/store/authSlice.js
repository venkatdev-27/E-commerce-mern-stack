import { createSlice } from "@reduxjs/toolkit";

/* =========================
   NORMALIZE USER
========================= */
const normalizeUser = (rawUser) => {
  if (!rawUser) return null;

  const user = {
    id: rawUser.id ?? rawUser._id ?? null,
    name: rawUser.name ?? "",
    email: rawUser.email ?? "",
    mobile: rawUser.mobile ?? "",
    avatar: rawUser.avatar ?? null,
  };

  if (!user.id || !user.email) return null;

  return user;
};

/* =========================
   LOAD AUTH FROM STORAGE
========================= */
const loadAuth = () => {
  try {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userStr || !token) {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
      };
    }

    const parsed = JSON.parse(userStr);
    const user = normalizeUser(parsed);

    if (!user) throw new Error("Invalid stored user");

    return {
      user,
      token,
      isAuthenticated: true,
    };
  } catch (error) {
    console.warn("Failed to load auth from storage:", error);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }
};

const initialState = loadAuth();

/* =========================
   AUTH SLICE
========================= */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* ================= LOGIN ================= */
    login: (state, action) => {
      const payload = action.payload;

      if (!payload?.user || !payload?.token) {
        console.error("Invalid login payload:", payload);
        return;
      }

      const user = normalizeUser(payload.user);

      if (!user) {
        console.error("Invalid user object:", payload.user);
        return;
      }

      state.user = user;
      state.token = payload.token;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", payload.token);
    },

    /* ================= LOGOUT ================= */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    /* ================= UPDATE PROFILE ================= */
    updateProfile: (state, action) => {
      if (!state.user || !action.payload) return;

      state.user = {
        ...state.user,
        ...action.payload,
        id: state.user.id, // 🔒 never allow id overwrite
      };

      localStorage.setItem("user", JSON.stringify(state.user));
    },

    /* ================= SET TOKEN ================= */
    setToken: (state, action) => {
      if (!action.payload) return;

      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
  },
});

export const { login, logout, updateProfile, setToken } =
  authSlice.actions;

export default authSlice.reducer;
