import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { setCredentials } from "../store/authSlice";
import { FaAddressCard, FaBoxOpen, FaHeadset, FaSave, FaUserEdit } from "react-icons/fa";

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({ ...data, password: "" });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      const { data } = await API.put("/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setCredentials({ user: { ...data, defaultAddressId: user.defaultAddressId }, token }));
      setMsg("Profile updated successfully ✔️");
      setStatus("succeeded");
      setForm({ ...form, password: "" });
    } catch (err) {
      setStatus("failed");
      setMsg(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-green-700 mb-8 flex items-center gap-3">
          <FaUserEdit /> My Profile
        </h1>

        {msg && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm text-center ${
              status === "succeeded" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1 font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1 font-medium">Email (read-only)</label>
            <input
              value={form.email}
              readOnly
              className="border border-gray-200 bg-gray-100 rounded-xl px-4 py-2 text-gray-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1 font-medium">Phone</label>
            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 mb-1 font-medium">New Password (optional)</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold shadow transition"
            >
              <FaSave /> {status === "loading" ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        <hr className="my-10" />

        <h2 className="text-2xl font-bold text-green-700 mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/address")}
            className="bg-white border-2 border-green-600 text-green-700 rounded-2xl p-6 flex flex-col items-center hover:bg-green-50 shadow-md hover:shadow-lg transition"
          >
            <FaAddressCard className="text-4xl mb-3" /> Addresses
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="bg-white border-2 border-green-600 text-green-700 rounded-2xl p-6 flex flex-col items-center hover:bg-green-50 shadow-md hover:shadow-lg transition"
          >
            <FaBoxOpen className="text-4xl mb-3" /> Order History
          </button>
          <button
            onClick={() => navigate("/support")}
            className="bg-white border-2 border-green-600 text-green-700 rounded-2xl p-6 flex flex-col items-center hover:bg-green-50 shadow-md hover:shadow-lg transition"
          >
            <FaHeadset className="text-4xl mb-3" /> Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
