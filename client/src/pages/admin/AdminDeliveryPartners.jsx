import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import API from "../../utils/api";
import { toast } from "react-toastify";

const initialForm = { name: "", phone: "", password: "", is_active: true };

const AdminDeliveryPartners = () => {
  const [partners, setPartners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch partners
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/admin/delivery-partners");
      setPartners(data);
    } catch (err) {
      toast.error("Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Open modal for add/edit
  const openAdd = () => {
    setIsEdit(false);
    setFormData(initialForm);
    setShowModal(true);
  };
  const openEdit = (p) => {
    setIsEdit(true);
    setEditId(p.id);
    setFormData({
      name: p.name,
      phone: p.phone,
      password: "",
      is_active: !!p.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this delivery partner?")) return;
    try {
      await API.delete(`/admin/delivery-partners/${id}`);
      toast.success("Partner deleted");
      setPartners(partners.filter((p) => p.id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || (!formData.password && !isEdit)) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      if (isEdit) {
        await API.put(`/admin/delivery-partners/${editId}`, formData);
        toast.success("Partner updated");
      } else {
        await API.post("/admin/delivery-partners", formData);
        toast.success("Partner added");
      }
      setShowModal(false);
      fetchPartners();
    } catch (err) {
      toast.error(err.response?.data?.error || "Save failed");
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
        <h1 className="text-2xl font-bold text-green-800 tracking-tight">
          Delivery Partners
        </h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition font-medium"
          onClick={openAdd}
        >
          <FaPlus /> Add Partner
        </button>
      </div>

      <div className="overflow-x-auto bg-white/90 shadow-xl rounded-2xl border border-green-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-100 text-green-900">
              <th className="px-6 py-4 font-semibold text-left">Name</th>
              <th className="px-6 py-4 font-semibold text-left">Phone</th>
              <th className="px-6 py-4 font-semibold text-left">Active</th>
              <th className="px-6 py-4 font-semibold text-left">Busy</th>
              <th className="px-6 py-4 font-semibold text-left">Deliveries</th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && partners.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  No partners found.
                </td>
              </tr>
            )}
            {partners.map((p, idx) => (
              <tr
                key={p.id}
                className={`${
                  idx % 2 === 0 ? "bg-green-50" : "bg-white"
                } border-b hover:bg-green-100 transition`}
              >
                <td className="px-6 py-4 align-middle">{p.name}</td>
                <td className="px-6 py-4 align-middle">{p.phone}</td>
                <td className="px-6 py-4 align-middle">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      p.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 align-middle">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      p.is_busy
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {p.is_busy ? "Busy" : "Available"}
                  </span>
                </td>
                <td className="px-6 py-4 align-middle">{p.total_deliveries}</td>
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-2 rounded-full text-green-700 bg-green-100 hover:bg-green-200 transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 border-green-100 border relative">
            <h2 className="text-lg font-bold mb-5 text-green-800">
              {isEdit ? "Edit Partner" : "Add Partner"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
              <div>
                <label className="block mb-1 text-sm font-medium">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Phone</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
              <div className="flex items-center my-3">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-400"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-600 select-none">
                  Active
                </label>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  {isEdit ? "New Password (leave blank to keep same)" : "Password"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  required={!isEdit}
                  autoComplete="new-password"
                  placeholder={isEdit ? "Leave blank if unchanged" : ""}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full border bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition"
                >
                  Save
                </button>
              </div>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-600"
              tabIndex={-1}
              type="button"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeliveryPartners;
