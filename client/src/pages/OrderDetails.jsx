import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import Navbar2 from "../components/Navbar2";
import { motion } from "framer-motion";
import StarRating from "../components/StarRating";
import { toast } from "react-toastify";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${orderId}`);
        setOrder(res.data);
          // if delivered, fetch existing ratings per food
          if (res.data.status === "delivered" && res.data.items) {
            const fetchRatings = async () => {
              const map = {};
              await Promise.all(
                res.data.items.map(async (it) => {
                  try {
                    const r = await API.get(`/foods/${it.food_id || it.id}/rating`);
                    map[it.food_id || it.id] = r.data.rating || 0;
                  } catch (_) {
                    map[it.food_id || it.id] = 0;
                  }
                })
              );
              setRatings(map);
            };
            fetchRatings();
          }
      } catch (err) {
        toast.error("Could not fetch order details.");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    // eslint-disable-next-line
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-700">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-600">Order not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Navbar2 />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.id}
            </h1>
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold capitalize ${
                statusColors[order.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="mb-6">
            <div className="text-gray-600 text-sm mb-1">
              Placed on:{" "}
              <span className="font-medium text-gray-900">
                {new Date(order.created_at).toLocaleString()}
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              Delivery Address:{" "}
              <span className="font-medium text-gray-900">
                {order.delivery_address_id
                  ? `#${order.delivery_address_id}`
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="border-b border-gray-200 mb-6"></div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Items Ordered
          </h2>
          <div className="space-y-4 mb-6">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 shadow-sm"
                >
                  <img
                    src={
                      item.image_url
                        ? `/assets/${item.image_url}`
                        : "/assets/default-food.jpg"
                    }
                    alt={item.food_name}
                    className="w-16 h-16 rounded-lg object-cover border"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/default-food.jpg";
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {item.food_name}
                    </div>
                    <div className="text-gray-600 text-sm mb-1">
                      Qty: {item.quantity}
                    </div>
                    {item.addons && item.addons.length > 0 && (
                      <ul className="text-xs text-gray-500 list-disc ml-4 space-y-0.5">
                        {item.addons.map((ad, idx) => (
                          <li key={idx}>{ad.name} (+₹{ad.price})</li>
                        ))}
                      </ul>
                    )}
                    {order.status === "delivered" && (
                      <StarRating
                        value={ratings[item.food_id || item.id] || 0}
                        editable={true}
                        onChange={async (val) => {
                          try {
                            await API.post(`/foods/${item.food_id || item.id}/rate`, { rating: val });
                            setRatings({ ...ratings, [item.food_id || item.id]: val });
                            toast.success("Thanks for rating!");
                          } catch (err) {
                            toast.error(err.response?.data?.error || "Rating failed");
                          }
                        }}
                        size="text-base"
                      />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-700">
                      ₹{(item.price_at_order * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      ₹{Number(item.price_at_order).toFixed(2)} each
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No items found.</div>
            )}
          </div>

          <div className="border-b border-gray-200 mb-6"></div>

          <div className="flex flex-col gap-2 text-lg">
            <div className="flex justify-between">
              <span className="text-gray-700">Total Amount</span>
              <span className="font-bold text-green-700">
                ₹{Number(order.total_amount).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/orders")}
            className="mt-8 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
          >
            Back to My Orders
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;
