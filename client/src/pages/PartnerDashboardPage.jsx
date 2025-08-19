import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../utils/api";
import { partnerLogout } from "../store/partnerAuthSlice";
import { FaSignOutAlt, FaBoxOpen, FaTruckLoading, FaCheckCircle } from "react-icons/fa";

const statusColors = {
  pending: "bg-yellow-300 text-yellow-800",
  on_the_way: "bg-blue-300 text-blue-800",
  delivered: "bg-green-300 text-green-800",
};

const PartnerDashboardPage = () => {
  const [confirm, setConfirm] = useState({ open: false, orderId: null });
  const { isAuthenticated, partner } = useSelector((s) => s.partnerAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/partner/login");
    } else {
      fetchOrders();
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get("/delivery/orders");
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/delivery/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleLogout = () => {
    dispatch(partnerLogout());
    navigate("/partner/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-green-700 flex items-center gap-3">
            <FaTruckLoading className="text-green-600" />
            Welcome, {partner?.name || "Partner"}
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-2xl font-semibold shadow transition"
            aria-label="Logout"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        {/* Orders Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <svg
              className="animate-spin h-10 w-10 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 text-lg font-medium">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg font-medium">
            No assigned orders right now.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-8"
                style={{
                  borderColor:
                    order.status === "pending"
                      ? "#D97706"
                      : order.status === "on_the_way"
                      ? "#2563EB"
                      : "#16A34A",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-3 gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <span>Order #{order.id}</span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          statusColors[order.status] || "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {order.status === "pending" && <FaBoxOpen className="mr-1" />}
                        {order.status === "on_the_way" && (
                          <FaTruckLoading className="mr-1 animate-pulse" />
                        )}
                        {order.status === "delivered" && <FaCheckCircle className="mr-1" />}
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Customer: {order.customer_name} | Email: {order.customer_email}
                    </p>
                  </div>

                  {order.status !== "delivered" && (
                    <button
                      onClick={() => {
                        const newStatus = order.status === "pending" ? "on_the_way" : "delivered";
                        if (newStatus === "delivered") {
                          setConfirm({ open: true, orderId: order.id });
                        } else {
                          updateStatus(order.id, newStatus);
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold shadow transition"
                      aria-label={`Mark order #${order.id} as ${
                        order.status === "pending" ? "On The Way" : "Delivered"
                      }`}
                    >
                      {order.status === "pending" ? "Mark On The Way" : "Mark Delivered"}
                    </button>
                  )}
                </div>

                <p className="text-gray-700 mb-3 font-semibold">
                  Address:{" "}
                  <span className="font-normal">
                    {order.address_title} - {order.address_details}
                  </span>
                </p>

                <ul className="list-disc list-inside text-gray-800 space-y-1">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity} x {item.food_name}
                      {item.addons && item.addons.length > 0 && (
                        <span className="text-gray-600">
                          {" "}
                          - with {item.addons.map((a) => a.name).join(", ")}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        )}
        {/* Confirm Modal */}
        {confirm.open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-sm text-center space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Confirm Delivery</h3>
              <p className="text-gray-600">Are you sure you want to mark order #{confirm.orderId} as delivered?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirm({ open: false, orderId: null })}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateStatus(confirm.orderId, "delivered");
                    setConfirm({ open: false, orderId: null });
                  }}
                  className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow"
                >
                  Yes, Deliver
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerDashboardPage;
