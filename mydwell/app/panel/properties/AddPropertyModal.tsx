"use client";

import { useState } from "react";

export default function AddPropertyModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // ✅ Directly use logged-in user's userId
  const owneruserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : "";

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!name || !city || !address) {
      setError("Please fill all required fields.");
      return;
    }

    if (!owneruserId) {
      setError("Owner ID missing! Please log in again.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:9092/api/property-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          contact,
          city,
          address,
          description,

          // ✅ THIS IS CORRECT
          owneruserId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add property");
        return;
      }

      onSuccess();
      onClose();

    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl p-6 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-4">Add New Property</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="font-medium block mb-1">Property Name *</label>
            <input
              type="text"
              className="w-full border p-3 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter property name"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="font-medium block mb-1">Contact Number</label>
            <input
              type="text"
              className="w-full border p-3 rounded-md"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone number"
            />
          </div>

          {/* City */}
          <div>
            <label className="font-medium block mb-1">City *</label>
            <input
              className="w-full border p-3 rounded-md"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City name"
            />
          </div>

          {/* Address */}
          <div>
            <label className="font-medium block mb-1">Address *</label>
            <textarea
              className="w-full border p-3 rounded-md"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full property address"
              rows={3}
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-medium block mb-1">Description</label>
            <textarea
              className="w-full border p-3 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the property"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              {loading ? "Saving..." : "Add Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
