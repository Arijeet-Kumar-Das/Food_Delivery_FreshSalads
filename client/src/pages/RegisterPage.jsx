import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import API from "../utils/api";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data } = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      dispatch(
        setCredentials({
          user: data.user,
          token: data.token,
        })
      );

      navigate("/add-address", {
        state: {
          postRegistration: true,
          message: "Let's add your first address to get started!",
        },
      });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8"
      >
        <div className="flex items-center justify-center gap-2 text-green-600 text-3xl font-bold mb-6">
          <FaLeaf className="text-2xl -mt-0.5" />
          <span>FreshSalads</span>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Join FreshSalads 🥗
        </h2>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-gray-700 font-medium text-sm">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium text-sm">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium text-sm">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? "bg-green-500" : "bg-green-600 hover:bg-green-700"
            } text-white py-2.5 rounded-xl text-lg font-medium transition-all duration-300 flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-green-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
