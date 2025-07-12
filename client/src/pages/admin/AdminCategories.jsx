import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import API from "../../utils/api";
import { toast } from "react-toastify";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await API.get("/admin/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openForm = (cat = null) => {
    setEditingId(cat ? cat.id : null);
    setName(cat ? cat.name : "");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/admin/categories/${editingId}`, { name });
        toast.success("Category updated");
      } else {
        await API.post("/admin/categories", { name });
        toast.success("Category created");
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await API.delete(`/admin/categories/${id}`);
      toast.success("Deleted");
      setCategories(categories.filter((c) => c.id !== id));
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
        <h1 className="text-2xl font-bold text-green-800 tracking-tight">Categories</h1>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2 rounded-xl shadow transition-all duration-200 active:scale-95"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      <div className="overflow-x-auto bg-white/90 shadow-xl rounded-2xl border border-green-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-100 text-green-900">
              <th className="px-6 py-4 font-semibold text-left align-middle">ID</th>
              <th className="px-6 py-4 font-semibold text-left align-middle">Name</th>
              <th className="px-6 py-4 font-semibold text-center align-middle">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400 align-middle">
                  No categories found.
                </td>
              </tr>
            )}
            {categories.map((cat, idx) => (
              <tr
                key={cat.id}
                className={`${
                  idx % 2 === 0 ? "bg-green-50" : "bg-white"
                } border-b hover:bg-green-100 transition`}
              >
                <td className="px-6 py-4 align-middle">{cat.id}</td>
                <td className="px-6 py-4 align-middle">{cat.name}</td>
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => openForm(cat)}
                      className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
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
          <div className="bg-white/90 w-full max-w-sm rounded-2xl shadow-2xl border border-green-100 p-8 relative animate-fadeIn">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-green-400 hover:text-green-600 text-xl"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-6 text-green-800">
              {editingId ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-green-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
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

export default AdminCategories;
