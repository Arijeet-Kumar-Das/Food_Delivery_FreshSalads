import React, { useState } from "react";
import Navbar2 from "../components/Navbar2";
import { toast } from "react-toastify";
import API from "../utils/api";

const SupportPage = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Message is required");
      return;
    }
    try {
      setLoading(true);
      await API.post("/support", { subject, message });
      toast.success("Message sent successfully");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar2 />
      <section className="min-h-[calc(100vh-4rem)] flex items-start justify-center bg-gray-50 py-10 px-4">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-semibold text-green-700 mb-6 text-center">
            We’re here to help
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Describe your issue below and our team will get back to you as soon as possible.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject (optional)</label>
              <input
          type="text"
          placeholder="Subject (optional)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
            </div>
        <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
          placeholder="Describe your issue..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-3 rounded h-40 resize-y focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default SupportPage;
