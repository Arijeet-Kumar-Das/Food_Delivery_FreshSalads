import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import RegisterPage from "./pages/RegisterPage";
import MenuPage from "./pages/MenuPage";
import AddAddress from "./pages/AddAddress";
import AddressPage from "../src/pages/AddressPage";
import CartPage from "./pages/CartPage";
import OrderDetails from "./pages/OrderDetails";
import OrderHistory from "./pages/OrderHistory";
import UserProfilePage from "./pages/UserProfilePage";
import AdminDashboardRoutes from "./pages/AdminDashboard";
import SupportPage from "./pages/SupportPage";
import PartnerLoginPage from "./pages/PartnerLoginPage";
import PartnerDashboardPage from "./pages/PartnerDashboardPage";
import LoginSelectPage from "./pages/LoginSelectPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/choose-login" element={<LoginSelectPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/add-address" element={<AddAddress />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderHistory />} />
<Route path="/profile" element={<UserProfilePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/order/:orderId" element={<OrderDetails />} />
        <Route path="/admin/*" element={<AdminDashboardRoutes />} />

        {/* Delivery Partner */}
        <Route path="/partner/login" element={<PartnerLoginPage />} />
        <Route path="/partner/dashboard" element={<PartnerDashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
