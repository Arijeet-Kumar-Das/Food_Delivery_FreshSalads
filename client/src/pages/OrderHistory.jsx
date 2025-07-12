import React, { useEffect, useState } from "react";
import Navbar2 from "../components/Navbar2";
import { useSelector } from "react-redux";
import API from "../utils/api";
import { selectCurrentUser } from "../store/authSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const OrderHistory = () => {
  const user = useSelector(selectCurrentUser);
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload?.userId) {
          fetchOrdersById(payload.userId);
        }
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    } else if (user) {
      fetchOrdersById(user.id);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  const fetchOrdersById = async (uid) => {
    try {
      const { data } = await API.get(`/orders/user/${uid}`);
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  if (!user && !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <p className="text-center text-lg text-green-700 bg-white p-6 rounded shadow">
          Please log in to view your orders.
        </p>
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <p className="text-center text-lg text-green-700 bg-white p-6 rounded shadow">
          Loading...
        </p>
      </div>
    );

  return (
    <>
      <Navbar2 />
      <div className="min-h-screen bg-green-50 py-8">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6 text-green-700">Your Orders</h1>
          {orders.length === 0 ? (
            <div className="bg-white rounded shadow p-6 text-center text-green-700">
              No orders found.
            </div>
          ) : (
            <ul className="space-y-6">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="bg-white rounded-lg shadow flex justify-between items-center p-6 border border-green-100 hover:shadow-lg transition-shadow"
                >
                  <div>
                    <p className="font-semibold text-green-800">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Total: <span className="text-green-700 font-medium">₹{order.total_amount}</span> | Status: <span className="capitalize">{order.status}</span>
                    </p>
                  </div>
                  <Link
                    to={`/order/${order.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors font-medium shadow"
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderHistory;
