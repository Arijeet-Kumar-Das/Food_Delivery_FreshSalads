// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isAdmin: false,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        defaultAddressId: user.defaultAddressId,
      };
      // Persist user in localStorage so it survives page reloads
      localStorage.setItem("user", JSON.stringify(state.user));
      state.token = token;
      state.isAuthenticated = true;
      state.isAdmin = !!user.isAdmin;
      state.status = "succeeded";
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.status = "idle";
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setDefaultAddress: (state, action) => {
      if (state.user) {
        state.user.defaultAddressId = action.payload;
        // Update persisted user
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, setDefaultAddress } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectDefaultAddressId = (state) =>
  state.auth.user?.defaultAddressId || null;

export default authSlice.reducer;
