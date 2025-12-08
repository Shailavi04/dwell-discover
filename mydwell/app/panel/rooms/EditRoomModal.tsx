"use client";

import { useState, useEffect } from "react";

interface Room {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  contact: string;
  description: string;
}

interface EditRoomModalProps {
  room?: Room | null; 
  onClose: () => void;
  onRoomUpdated: (room: Room) => void;
}

export default function EditRoomModal({ room, onClose, onRoomUpdated }: EditRoomModalProps) {
  // State with safe defaults
  const [form, setForm] = useState({
    name: "",
    type: "",
    city: "",
    address: "",
    contact: "",
    description: "",
  });

  // Load room data safely
  useEffect(() => {
    if (room) {
      setForm({
        name: room.name || "",
        type: room.type || "",
        city: room.city || "",
        address: room.address || "",
        contact: room.contact || "",
        description: room.description || "",
      });
    }
  }, [room]);

  // If no room is selected, don't render modal
  if (!room) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:9092/api/rooms/${room.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        alert("Failed to update room");
        console.error(await res.text());
        return;
      }

      const updatedRoom = await res.json();
      onRoomUpdated(updatedRoom);
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Room</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {["name", "type", "city", "address", "contact"].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.toUpperCase()}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          ))}

          <textarea
            name="description"
            placeholder="DESCRIPTION"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 rounded text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-green-500 rounded text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
