// features/cart/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  coupon: null,
  discount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload.code;
      state.discount = action.payload.discount;
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.discount = 0;
    },
  },
});

export const {
  addItem,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  applyCoupon,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectDeliveryFee = (state) =>
  selectSubtotal(state) > 1000 ? 0 : 40;
export const selectTax = (state) => selectSubtotal(state) * 0.05;
export const selectTotal = (state) =>
  selectSubtotal(state) +
  selectDeliveryFee(state) +
  selectTax(state) -
  state.cart.discount;
