import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api";

export const partnerLogin = createAsyncThunk(
  "partnerAuth/login",
  async ({ phone, password }, thunkAPI) => {
    try {
      const { data } = await API.post("/delivery/login", { phone, password });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Login failed"
      );
    }
  }
);

const initialState = {
  partner: JSON.parse(localStorage.getItem("partner")) || null,
  token: localStorage.getItem("partnerToken") || null,
  isAuthenticated: !!localStorage.getItem("partnerToken"),
  status: "idle",
  error: null,
};

const partnerAuthSlice = createSlice({
  name: "partnerAuth",
  initialState,
  reducers: {
    partnerLogout(state) {
      state.partner = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("partnerToken");
      localStorage.removeItem("partner");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(partnerLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(partnerLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.partner = action.payload.partner;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("partnerToken", action.payload.token);
        localStorage.setItem("partner", JSON.stringify(action.payload.partner));
      })
      .addCase(partnerLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { partnerLogout } = partnerAuthSlice.actions;
export default partnerAuthSlice.reducer;
