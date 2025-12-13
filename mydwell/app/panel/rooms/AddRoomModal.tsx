"use client";

import { useEffect, useState } from "react";

interface Property {
  id: string;
  name: string;
}

interface Props {
  onClose: () => void;
  onRoomAdded: () => void;
}

export default function AddRoomModal({ onClose, onRoomAdded }: Props) {
  const [loading, setLoading] = useState(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const [form, setForm] = useState({
    name: "",
    propertyId: "",
    type: "",
    description: "",
    capacity: "",
    pricePerMonth: "",
    pricePerDay: "",
    securityDeposit: "",
    genderType: "",
    roomNumber: "",
  });

  // ---------------------------------
  // FETCH OWNER PROPERTIES
  // ---------------------------------
  useEffect(() => {
    const fetchProperties = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:9092/api/property-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProperties(data ?? []);
    };

    fetchProperties();
  }, []);

  // ---------------------------------
  // INPUT HANDLERS
  // ---------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files)); // ✅ MULTIPLE FILES
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------------------------
  // SUBMIT
  // ---------------------------------
  const handleSubmit = async () => {
    if (!form.propertyId) {
      alert("Please select a property");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append(
        "data",
        new Blob([JSON.stringify(form)], { type: "application/json" })
      );

      images.forEach((img) => formData.append("images", img));

      const res = await fetch("http://localhost:9092/api/rooms", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        alert("Failed to add room");
        console.error(await res.text());
        return;
      }

      onRoomAdded();
      onClose();
    } catch (err) {
      console.error("Add room failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-[650px] max-h-[90vh] overflow-y-auto p-6 shadow-xl">

        <h2 className="text-2xl font-bold mb-4">Add New Room</h2>

        {/* PROPERTY DROPDOWN */}
        <select
          name="propertyId"
          value={form.propertyId}
          onChange={handleChange}
          className="input mb-3"
        >
          <option value="">Select Property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-3">
          <input name="name" placeholder="Room Name" onChange={handleChange} className="input" />
          <input name="roomNumber" placeholder="Room Number" onChange={handleChange} className="input" />

          <input name="type" placeholder="Type (2-Sharing / 3-Sharing)" onChange={handleChange} className="input" />

          <select name="genderType" onChange={handleChange} className="input">
            <option value="">Gender</option>
            <option value="BOYS">Boys</option>
            <option value="GIRLS">Girls</option>
            <option value="UNISEX">Unisex</option>
          </select>
        </div>

        {/* PRICING */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <input name="capacity" type="number" placeholder="Capacity" onChange={handleChange} className="input" />
          <input name="pricePerMonth" type="number" placeholder="₹ / Month" onChange={handleChange} className="input" />
          <input name="pricePerDay" type="number" placeholder="₹ / Day" onChange={handleChange} className="input" />
        </div>

        <input
          name="securityDeposit"
          type="number"
          placeholder="Security Deposit"
          onChange={handleChange}
          className="input mt-3"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Room Description"
          onChange={handleChange}
          className="input mt-3 h-24"
        />

        {/* IMAGE UPLOAD */}
        <div className="mt-4">
          <label className="font-semibold">Room Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />

          {/* IMAGE PREVIEW */}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    className="h-20 w-full object-cover rounded"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Room"}
          </button>
        </div>
      </div>
    </div>
  );
}
