import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaHome,
  FaBuilding,
  FaMapMarkerAlt,
  FaCheck,
  FaArrowRight,
  FaInfoCircle,
} from "react-icons/fa";
import API from "../utils/api";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const AddressForm = ({ onSuccess, initialAddress }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isPostRegistration = location.state?.postRegistration || false;
  const postRegMessage =
    location.state?.message || "Please add your delivery address to continue";

  // Get token from Redux store
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: initialAddress?.title || "Home",
    details: initialAddress?.details || "",
    isDefault: initialAddress?.isDefault || !initialAddress,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // In your handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const payload = {
        ...formData,
        // Ensure we send isDefault as is_default for the backend
        is_default: formData.isDefault,
      };

      if (initialAddress) {
        await API.put(`/addresses/${initialAddress.id}`, payload, config);
      } else {
        await API.post("/addresses", payload, config);
      }

      if (isPostRegistration) {
        navigate("/menu");
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6"
    >
      {isPostRegistration ? (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Almost there!
          </h2>
          <div className="flex items-start bg-blue-50 p-4 rounded-lg">
            <FaInfoCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
            <p className="text-blue-800">{postRegMessage}</p>
          </div>
        </div>
      ) : (
        <h2 className="text-2xl font-bold text-green-800 mb-6">
          {initialAddress ? "Edit Address" : "Add New Address"}
        </h2>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Address Type */}
        <div>
          <label className="block text-gray-700 mb-2">Address Type</label>
          <div className="flex flex-wrap gap-2">
            {["Home", "Work", "Other"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, title: type })}
                className={`flex items-center px-4 py-2 rounded-full transition-colors ${
                  formData.title === type
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type === "Home" && <FaHome className="mr-2" />}
                {type === "Work" && <FaBuilding className="mr-2" />}
                {type === "Other" && <FaMapMarkerAlt className="mr-2" />}
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Address Details */}
        <div>
          <label className="block text-gray-700 mb-2">Full Address</label>
          <textarea
            value={formData.details}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            placeholder="House no, Street, City, State, Pincode"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            rows="4"
            required
          />
        </div>

        {/* Default Address Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="defaultAddress"
            checked={formData.isDefault}
            onChange={(e) =>
              setFormData({ ...formData, isDefault: e.target.checked })
            }
            className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
          />
          <label htmlFor="defaultAddress" className="ml-2 text-gray-700">
            Set as default address
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center ${
            isSubmitting ? "bg-green-500" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isSubmitting ? (
            "Saving..."
          ) : (
            <>
              {isPostRegistration ? (
                <>
                  Continue to Menu
                  <FaArrowRight className="ml-2" />
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" />
                  {initialAddress ? "Update Address" : "Save Address"}
                </>
              )}
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddressForm;
