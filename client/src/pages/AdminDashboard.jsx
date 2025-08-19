import React from "react";
import { Link, Routes, Route, Outlet } from "react-router-dom";
import {
  FaLeaf,
  FaShoppingCart,
  FaHamburger,
  FaTags,
  FaUsers,
  FaMotorcycle,
  FaClipboardList,
} from "react-icons/fa";
import Navbar2 from "../components/Navbar2";
import AdminOrders from "./admin/AdminOrders";
import DashboardHome from "./admin/DashboardHome";
import AdminFoods from "./admin/AdminFoods";
import AdminCategories from "./admin/AdminCategories";
import AdminUsers from "./admin/AdminUsers";
import AdminSupport from "./admin/AdminSupport";
import AdminDeliveryPartners from "./admin/AdminDeliveryPartners";

const SidebarItem = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="flex items-center space-x-3 py-3 px-4 rounded-lg text-green-900 hover:bg-green-100 transition-colors"
  >
    <Icon />
    <span>{label}</span>
  </Link>
);



const AdminLayout = () => (
  <div className="flex min-h-screen bg-green-50">
    {/* Sidebar */}
    <aside className="w-64 fixed inset-y-0 bg-white shadow-lg p-4 flex flex-col z-40">
      <div className="flex items-center space-x-2 text-green-700 text-2xl font-bold mb-8">
        <FaLeaf /> <span>Admin</span>
      </div>
      <SidebarItem to="/admin" icon={FaClipboardList} label="Dashboard" />
      <SidebarItem to="/admin/orders" icon={FaShoppingCart} label="Orders" />
      <SidebarItem to="/admin/foods" icon={FaHamburger} label="Foods" />
      <SidebarItem to="/admin/categories" icon={FaTags} label="Categories" />
      <SidebarItem to="/admin/users" icon={FaUsers} label="Users" />
      <SidebarItem to="/admin/delivery-partners" icon={FaMotorcycle} label="Delivery Partners" />
      <SidebarItem to="/admin/support" icon={FaTags} label="Support" />
    </aside>

    {/* Content */}
    <main className="flex-1 flex flex-col ml-64 min-h-screen">
      <Navbar2 />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </main>
  </div>
);

export const AdminDashboardRoutes = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route index element={<DashboardHome />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="foods" element={<AdminFoods />} />
      <Route path="categories" element={<AdminCategories />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="delivery-partners" element={<AdminDeliveryPartners />} />
      <Route path="support" element={<AdminSupport />} />
    </Route>
  </Routes>
);

export default AdminDashboardRoutes;
