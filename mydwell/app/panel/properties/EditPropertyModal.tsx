"use client";

import { useState, useEffect } from "react";

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  property: {
    id: string;
    name: string;
    contact: string;
    city: string;
    address: string;
    description: string;
    ownerId?: string;
    owneruserId?: string;
  } | null;
}

export default function EditPropertyModal({
  isOpen,
  onClose,
  onSuccess,
  property,
}: EditPropertyModalProps) {
  if (!isOpen || !property) return null;

  const [name, setName] = useState(property.name || "");
  const [contact, setContact] = useState(property.contact || "");
  const [city, setCity] = useState(property.city || "");
  const [address, setAddress] = useState(property.address || "");
  const [description, setDescription] = useState(property.description || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    if (property) {
      setName(property.name || "");
      setContact(property.contact || "");
      setCity(property.city || "");
      setAddress(property.address || "");
      setDescription(property.description || "");
    }
  }, [property]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!name || !city || !address) {
      setError("Please fill all required fields.");
      return;
    }

    const updatedData = {
      name,
      contact,
      city,
      address,
      description,
      owneruserId: property.ownerId || property.owneruserId,
    };

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:9092/api/property-list/${property.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to update property");
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
        <h2 className="text-2xl font-bold mb-4">Edit Property</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label>Property Name *</label>
            <input
              type="text"
              className="w-full border p-3 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label>Contact Number</label>
            <input
              type="text"
              className="w-full border p-3 rounded-md"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          <div>
            <label>City *</label>
            <input
              className="w-full border p-3 rounded-md"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div>
            <label>Address *</label>
            <textarea
              className="w-full border p-3 rounded-md"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              className="w-full border p-3 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

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
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
