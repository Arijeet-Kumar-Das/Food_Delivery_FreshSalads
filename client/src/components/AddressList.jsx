import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaPlus,
  FaHome,
  FaBuilding,
  FaMapMarkerAlt,
} from "react-icons/fa";
import API from "../utils/api";
import AddressForm from "./AddressForm";

const AddressList = ({ onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Fetch addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await API.get("/addresses");
      setAddresses(data);
    } catch (err) {
      setError("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await API.delete(`/addresses/${id}`);
        fetchAddresses();
      } catch (err) {
        setError("Failed to delete address");
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await API.put(`/addresses/default/${id}`);
      fetchAddresses();
    } catch (err) {
      setError("Failed to set default address");
    }
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAddress(null);
    fetchAddresses();
  };

  const handleAddNewClick = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-green-800">Your Addresses</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddNewClick}
          className="bg-green-600 text-white px-6 py-3 rounded-xl flex items-center shadow-lg"
        >
          <FaPlus className="mr-2" />
          Add New Address
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Address Form (Conditional) */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 overflow-hidden"
          >
            <AddressForm
              onSuccess={handleFormSuccess}
              initialAddress={editingAddress}
              onCancel={() => setShowForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-12 w-12 border-4 border-green-500 rounded-full animate-spin" />
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <div className="text-center py-16 bg-green-50 rounded-2xl">
          <FaMapMarkerAlt className="mx-auto text-5xl text-green-400 mb-4" />
          <p className="text-xl text-gray-600 mb-6">
            You haven't added any addresses yet
          </p>
          <button
            onClick={handleAddNewClick}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-xl p-6 shadow-md ${
                address.is_default ? "ring-2 ring-green-500" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3">
                    {address.title === "Home" && <FaHome />}
                    {address.title === "Work" && <FaBuilding />}
                    {address.title === "Other" && <FaMapMarkerAlt />}
                  </div>
                  <h3 className="font-bold">{address.title}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(address)}
                    className="text-gray-500 hover:text-green-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{address.details}</p>

              <div className="flex justify-between items-center">
                {address.is_default ? (
                  <span className="text-green-600 flex items-center">
                    <FaCheck className="mr-1" /> Default
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-sm text-green-600 hover:underline flex items-center"
                  >
                    <FaCheck className="mr-1" /> Set as default
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressList;
