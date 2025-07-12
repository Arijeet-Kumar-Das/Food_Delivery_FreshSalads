import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import API from "../../utils/api";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      setUsers(users.filter((u) => u.id !== id));
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
      <h1 className="text-2xl font-bold mb-8 text-green-800 tracking-tight">Users</h1>
      <div className="overflow-x-auto bg-white/90 shadow-xl rounded-2xl border border-green-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-100 text-green-900">
              <th className="px-6 py-4 font-semibold text-left align-middle">ID</th>
              <th className="px-6 py-4 font-semibold text-left align-middle">Name</th>
              <th className="px-6 py-4 font-semibold text-left align-middle">Email</th>
              <th className="px-6 py-4 font-semibold text-left align-middle">Role</th>
              <th className="px-6 py-4 font-semibold text-center align-middle">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 align-middle">
                  No users found.
                </td>
              </tr>
            )}
            {users.map((u, idx) => (
              <tr
                key={u.id}
                className={`${
                  idx % 2 === 0 ? "bg-green-50" : "bg-white"
                } border-b hover:bg-green-100 transition`}
              >
                <td className="px-6 py-4 align-middle">{u.id}</td>
                <td className="px-6 py-4 align-middle">{u.name}</td>
                <td className="px-6 py-4 align-middle">{u.email}</td>
                <td className="px-6 py-4 align-middle">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      u.is_admin
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {u.is_admin ? "Admin" : "User"}
                  </span>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleDelete(u.id)}
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
    </div>
  );
};

export default AdminUsers;
