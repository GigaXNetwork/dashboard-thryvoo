import React, { useState } from "react";
import Cookies from "js-cookie";
import "./Card.css"

export default function CreateCard({ onClose, onSubmit,userId }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accountToken = Cookies.get("accountToken");
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/createcard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${accountToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ name, email, phone }),
      });

      if (!response.ok) throw new Error("Failed to create card");

      const result = await response.json();
      setMessage("✅ Card created successfully!");

      if (onSubmit) onSubmit(result);

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      console.error("Error creating card:", err.message);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed w-full inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[99999] transition">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Your Card
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1 text-left">Your Business Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E82EB]"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1 text-left">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E82EB]"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1 text-left">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E82EB]"
              placeholder="+1 234 567 8900"
              required
            />
          </div>

          {message && (
            <div
              className={`text-sm font-medium text-center ${
                message.startsWith("✅")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="text-gray-600 hover:text-gray-800 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`bg-[#3E82EB] text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3E82EB]"
              }`}
            >
              {submitting ? "Creating..." : "Create Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}