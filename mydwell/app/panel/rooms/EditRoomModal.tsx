"use client";

import { useState } from "react";

interface Props {
  room: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditRoomModal({ room, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: room.name ?? "",
    roomNumber: room.roomNumber ?? "",
    type: room.type ?? "",
    capacity: room.capacity ?? 0,
    pricePerMonth: room.pricePerMonth ?? 0,
    description: room.description ?? "",
  });

  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages] = useState<string[]>(room.images ?? []);

  const token = localStorage.getItem("token");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: any) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append(
      "data",
      new Blob([JSON.stringify(form)], { type: "application/json" })
    );

    newImages.forEach((file) => {
      formData.append("newImages", file);
    });

    const res = await fetch(
      `http://localhost:9092/api/rooms/${room.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      alert("Failed to update room");
      return;
    }

    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-[540px] p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-5">Edit Room</h2>

        {/* ROOM NAME */}
        <label className="block text-sm font-medium mb-1">Room Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* ROOM NUMBER */}
        <label className="block text-sm font-medium mb-1">Room Number</label>
        <input
          name="roomNumber"
          value={form.roomNumber}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* TYPE */}
        <label className="block text-sm font-medium mb-1">Room Type</label>
        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* CAPACITY & PRICE */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Price / Month (₹)
            </label>
            <input
              type="number"
              name="pricePerMonth"
              value={form.pricePerMonth}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* EXISTING IMAGES */}
        {existingImages.length > 0 && (
          <>
            <label className="block text-sm font-medium mb-1">
              Existing Images
            </label>
            <div className="flex gap-2 flex-wrap mb-3">
              {existingImages.map((id) => (
                <img
                  key={id}
                  src={`http://localhost:9092/api/images/${id}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          </>
        )}

        {/* ADD NEW IMAGES */}
        <label className="block text-sm font-medium mb-1">
          Add New Images
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
