import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaMotorcycle, FaArrowLeft } from "react-icons/fa"; // Example icons

const LoginSelectPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-white py-8 px-4 relative">
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-600 hover:text-green-800 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow"
      >
        <FaArrowLeft /> Home
      </button>
      <div className="flex flex-col md:flex-row gap-10">
        {/* Customer Card */}
        <div 
          className="bg-white/90 p-8 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition cursor-pointer w-80"
          onClick={() => navigate("/login")}
        >
          <FaUserCircle className="text-green-600 text-6xl mb-4" />
          <h3 className="text-xl font-bold text-green-700 mb-2">Customer Login</h3>
          <p className="text-gray-600 mb-6">Access your customer account, place orders, and track deliveries.</p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow">
            Login as Customer
          </button>
        </div>

        {/* Delivery Partner Card */}
        <div 
          className="bg-white/90 p-8 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition cursor-pointer w-80"
          onClick={() => navigate("/partner/login")}
        >
          <FaMotorcycle className="text-green-600 text-6xl mb-4" />
          <h3 className="text-xl font-bold text-green-700 mb-2">Delivery Partner Login</h3>
          <p className="text-gray-600 mb-6">Login to manage your deliveries and view your schedules.</p>
          <button className="border-2 border-green-600 text-green-700 font-semibold py-2 px-6 rounded-lg hover:bg-green-50 shadow">
            Login as Partner
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSelectPage;
