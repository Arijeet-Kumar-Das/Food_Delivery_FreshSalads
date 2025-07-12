import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import API from "../../utils/api";
import { toast } from "react-toastify";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category_id: "",
  image_url: "",
};

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const [f, c] = await Promise.all([
        API.get("/admin/foods"),
        API.get("/admin/categories"),
      ]);
      setFoods(f.data);
      setCategories(c.data);
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openForm = (food = null) => {
    if (food) {
      setFormData(food);
      setEditingId(food.id);
    } else {
      setFormData(initialForm);
      setEditingId(null);
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/admin/foods/${editingId}`, formData);
        toast.success("Food updated");
      } else {
        await API.post("/admin/foods", formData);
        toast.success("Food created");
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this food?")) return;
    try {
      await API.delete(`/admin/foods/${id}`);
      toast.success("Deleted");
      setFoods(foods.filter((f) => f.id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      className="p-8 min-h-[calc(100vh-4rem)] bg-gradient-to-tr from-green-50 via-white to-green-100"
      style={{
        backgroundImage:
          "radial-gradient(circle at 80% 20%, rgba(16,185,129,0.08) 0, transparent 70%), radial-gradient(circle at 20% 80%, rgba(16,185,129,0.08) 0, transparent 70%)",
      }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-green-800 tracking-tight">Foods</h1>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2 rounded-xl shadow transition-all duration-200 active:scale-95"
        >
          <FaPlus /> Add Food
        </button>
      </div>

      <div className="overflow-x-auto bg-white/90 shadow-xl rounded-2xl border border-green-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-100 text-green-900">
              <th className="px-6 py-4 font-semibold text-left align-middle">ID</th>
              <th className="px-6 py-4 font-semibold text-left align-middle">Name</th>
              <th className="px-6 py-4 font-semibold text-left align-middle">Price</th>
              <th className="px-6 py-4 font-semibold text-left align-middle">Category</th>
              <th className="px-6 py-4 font-semibold text-center align-middle">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 align-middle">
                  No foods found.
                </td>
              </tr>
            )}
            {foods.map((food, idx) => (
              <tr
                key={food.id}
                className={`${
                  idx % 2 === 0 ? "bg-green-50" : "bg-white"
                } border-b hover:bg-green-100 transition`}
              >
                <td className="px-6 py-4 align-middle">{food.id}</td>
                <td className="px-6 py-4 align-middle">{food.name}</td>
                <td className="px-6 py-4 align-middle font-semibold text-green-700">
                  ₹{Number(food.price).toFixed(2)}
                </td>
                <td className="px-6 py-4 align-middle">
                  {categories.find((c) => c.id === food.category_id)?.name || ""}
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => openForm(food)}
                      className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(food.id)}
                      className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-green-200/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 w-full max-w-lg rounded-2xl shadow-2xl border border-green-100 p-8 relative animate-fadeIn">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-green-400 hover:text-green-600 text-xl"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-6 text-green-800">
              {editingId ? "Edit Food" : "Add Food"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-green-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-green-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border border-green-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full border border-green-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full border border-green-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow transition"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Optional: Add fadeIn animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: none;}
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </div>
  );
};

export default AdminFoods;
