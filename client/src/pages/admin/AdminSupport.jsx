import React, { useEffect, useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import API from "../../utils/api";
import { toast } from "react-toastify";

const AdminSupport = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await API.delete(`/admin/support-messages/${id}`);
      toast.success("Message deleted");
      setMessages(messages.filter((msg) => msg.id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/admin/support-messages");
        setMessages(res.data);
      } catch (err) {
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-800">Support Messages</h1>
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-green-100">
        <table className="min-w-full text-sm">
          <thead className="bg-green-100 text-green-900">
            <tr>
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Subject</th>
              <th className="p-4 font-semibold">Message</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-400">
                  No support messages found.
                </td>
              </tr>
            )}
            {messages.map((m, idx) => (
              <tr
                key={m.id}
                className={`${
                  idx % 2 === 0 ? "bg-green-50" : "bg-white"
                } border-b hover:bg-green-100 transition`}
              >
                <td className="p-4">{m.id}</td>
                <td className="p-4">{m.name}</td>
                <td className="p-4">{m.email}</td>
                <td className="p-4">{m.subject || "-"}</td>
                <td className="p-4 max-w-xs truncate" title={m.message}>
                  {m.message}
                </td>
                <td className="p-4">
                  {new Date(m.created_at).toLocaleString()}
                </td>
                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => setSelected(m)}
                    className="p-2 rounded-full text-green-600 bg-green-100 hover:bg-green-200 transition"
                    title="View message"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition"
                    title="Delete message"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-green-200/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 space-y-4 border border-green-100 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-green-400 hover:text-green-600 text-xl"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-green-800">
              Message from {selected.name}
            </h2>
            <p className="text-gray-500 text-sm">{selected.email}</p>
            <div className="bg-green-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
              {selected.message}
            </div>
            <div className="text-right text-xs text-gray-400">
              {new Date(selected.created_at).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
