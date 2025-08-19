import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { toast } from "react-toastify";

// Status pill color mapping
const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};
const STATUS_OPTIONS = ["pending", "confirmed", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get("/admin/orders");
        setOrders(data);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const viewOrder = async (id) => {
    try {
      const { data } = await API.get(`/orders/${id}`);
      setSelectedOrder(data);
      setShowModal(true);
    } catch {
      toast.error("Failed to load order");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/orders/${id}`, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
      toast.success("Status updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading)
    return (
      <div className="p-8 text-gray-600 text-lg animate-pulse">
        Loading orders...
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
      <h2 className="text-2xl font-bold mb-8 text-green-800 tracking-tight">
        Orders
      </h2>
      <div className="overflow-x-auto bg-white/90 shadow-xl rounded-2xl border border-green-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-100 text-green-900">
              <th className="py-4 px-6 text-left font-semibold">#</th>
              <th className="py-4 px-6 text-left font-semibold">User</th>
              <th className="py-4 px-6 text-left font-semibold">Total</th>
              <th className="py-4 px-6 text-left font-semibold">Status</th>
              <th className="py-4 px-6 text-left font-semibold">Update</th>
              <th className="py-4 px-6 text-left font-semibold">View</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
            {orders.map((o, idx) => (
              <tr
                key={o.id}
                className={`${
                  idx % 2 === 0 ? "bg-green-50" : "bg-white"
                } border-b hover:bg-green-100 transition`}
              >
                <td className="py-4 px-6">{o.id}</td>
                <td className="py-4 px-6">{o.user_name}</td>
                <td className="py-4 px-6 font-semibold text-green-700">
                  ₹{Number(o.total_amount).toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      STATUS_COLORS[o.status?.toLowerCase()] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="border border-green-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-4 px-6">
                  <button onClick={() => viewOrder(o.id)} className="text-green-600 hover:underline">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Order #{selectedOrder.id}</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {selectedOrder.items.map((it) => (
                <div key={it.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <span>{it.food_name}</span>
                    <span>Qty: {it.quantity}</span>
                  </div>
                  {it.addons && it.addons.length > 0 && (
                    <ul className="text-xs text-gray-600 list-disc ml-4 space-y-0.5">
                      {it.addons.map((ad, idx) => (
                        <li key={idx}>{ad.name} (+₹{ad.price})</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-right font-semibold text-green-700">
              Total: ₹{Number(selectedOrder.total_amount).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
