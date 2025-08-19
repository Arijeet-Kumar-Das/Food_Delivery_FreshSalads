import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";

const AddonSelector = ({ foodId, isOpen, onClose, onConfirm }) => {
  const [addons, setAddons] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchAddons = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/foods/${foodId}/addons`);
        setAddons(res.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load add-ons");
      } finally {
        setLoading(false);
      }
    };
    fetchAddons();
    setSelected([]); // reset selection when opening
  }, [foodId, isOpen]);

  const toggleAddon = (addon) => {
    setSelected((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      if (exists) return prev.filter((a) => a.id !== addon.id);
      return [...prev, addon];
    });
  };

  const handleConfirm = () => {
    onConfirm(selected);
    setSelected([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center
            bg-gradient-to-br from-green-100/70 via-white/90 to-green-300/80
            backdrop-blur-[5px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-2xl w-11/12 max-w-md p-7 relative"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 27, duration: 0.3 }}
            onClick={e => e.stopPropagation()} // Prevent overlay-close when clicking inside
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-2xl font-bold"
              aria-label="Close"
              type="button"
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
              Choose Add-ons
            </h2>
            {loading ? (
              <p className="text-green-700 font-medium">Loading…</p>
            ) : error ? (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            ) : (
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {addons.map((ad) => (
                  <li key={ad.id} className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!selected.find((a) => a.id === ad.id)}
                        onChange={() => toggleAddon(ad)}
                        className="accent-green-600 w-4 h-4"
                      />
                      <span>{ad.name}</span>
                    </label>
                    <span className="text-sm text-gray-600">₹{ad.price}</span>
                  </li>
                ))}
                {addons.length === 0 && (
                  <p className="text-sm text-gray-500">No add-ons available.</p>
                )}
              </ul>
            )}
            <div className="flex justify-end gap-3 mt-7">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
                disabled={loading}
                type="button"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddonSelector;
