import React, { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaHamburger,
  FaTags,
  FaUsers,
} from "react-icons/fa";
import API from "../../utils/api";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

// StatCard with icon in colored circle and subtle animation
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
    className="bg-white shadow-xl rounded-2xl p-6 flex items-center gap-5 border border-green-100 hover:shadow-2xl transition"
  >
    <div
      className={`flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-${color}-100 to-${color}-200 shadow-inner`}
    >
      <Icon className={`text-3xl text-${color}-600`} />
    </div>
    <div>
      <p className="text-3xl font-extrabold text-green-800">{value}</p>
      <p className="text-gray-500 font-medium">{label}</p>
    </div>
  </motion.div>
);

// Status color mapping for order status badge
const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  processing: "bg-blue-100 text-blue-700",
};

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, o] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/orders?limit=5"),
        ]);
        setStats(s.data);
        setRecentOrders(o.data);
      } catch (err) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="p-8 text-gray-600 text-lg animate-pulse">
        Loading dashboard...
      </div>
    );

  return (
    <div
      className="p-8 min-h-[calc(100vh-4rem)] bg-gradient-to-tr from-green-50 via-white to-green-100"
      style={{
        backgroundImage:
          "radial-gradient(circle at 80% 20%, rgba(16,185,129,0.08) 0, transparent 70%), radial-gradient(circle at 20% 80%, rgba(16,185,129,0.08) 0, transparent 70%)",
      }}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <StatCard
          icon={FaClipboardList}
          label="Orders"
          value={stats.orders}
          color="green"
          delay={0.05}
        />
        <StatCard
          icon={FaHamburger}
          label="Foods"
          value={stats.foods}
          color="yellow"
          delay={0.15}
        />
        <StatCard
          icon={FaTags}
          label="Categories"
          value={stats.categories}
          color="blue"
          delay={0.25}
        />
        <StatCard
          icon={FaUsers}
          label="Users"
          value={stats.users}
          color="purple"
          delay={0.35}
        />
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
        className="bg-white/90 shadow-xl rounded-2xl border border-green-100 overflow-hidden"
      >
        <div className="px-8 py-5 border-b bg-green-50/70 flex items-center justify-between">
          <h3 className="text-xl font-bold text-green-800 tracking-tight">
            Recent Orders
          </h3>
          <span className="text-sm text-gray-400">
            Last 5 orders
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-green-100 text-green-900">
                <th className="px-6 py-4 font-semibold text-left align-middle">ID</th>
                <th className="px-6 py-4 font-semibold text-left align-middle">User</th>
                <th className="px-6 py-4 font-semibold text-right align-middle">Amount</th>
                <th className="px-6 py-4 font-semibold text-center align-middle">Status</th>
                <th className="px-6 py-4 font-semibold text-left align-middle">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 align-middle">
                    No recent orders found.
                  </td>
                </tr>
              )}
              {recentOrders.map((o, idx) => (
                <tr
                  key={o.id}
                  className={`${
                    idx % 2 === 0 ? "bg-green-50" : "bg-white"
                  } border-b hover:bg-green-100 transition`}
                >
                  <td className="px-6 py-4 align-middle">{o.id}</td>
                  <td className="px-6 py-4 align-middle">{o.user_name}</td>
                  <td className="px-6 py-4 align-middle text-right font-semibold text-green-700">
                    ₹{Number(o.total_amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 align-middle text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[o.status?.toLowerCase()] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
