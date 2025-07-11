// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
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
        defaultAddressId: user.defaultAddressId, // Added from login response
      };
      state.token = token;
      state.isAuthenticated = true;
      state.status = "succeeded";
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
      localStorage.removeItem("token");
    },
    setDefaultAddress: (state, action) => {
      if (state.user) {
        state.user.defaultAddressId = action.payload;
      }
    },
  },
});

export const { setCredentials, logout, setDefaultAddress } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectDefaultAddressId = (state) =>
  state.auth.user?.defaultAddressId || null;

export default authSlice.reducer;
