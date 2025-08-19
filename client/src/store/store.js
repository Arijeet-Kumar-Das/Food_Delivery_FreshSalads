import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import partnerAuthReducer from "./partnerAuthSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    partnerAuth: partnerAuthReducer,
  },
});
