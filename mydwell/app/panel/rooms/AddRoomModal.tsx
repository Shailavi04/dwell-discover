"use client";

import { useState } from "react";

interface Room {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  contact: string;
  description: string;
}

interface Props {
  onClose: () => void;
  onRoomAdded: (room: Room) => void;
}

export default function AddRoomModal({ onClose, onRoomAdded }: Props) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    city: "",
    address: "",
    contact: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:9092/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        alert("Failed to add room");
        console.error(await res.text());
        return;
      }

      const newRoom: Room = await res.json();
      onRoomAdded(newRoom);
      onClose();
    } catch (error) {
      console.error("Add room failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New Room</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded"
        />

        <input
          name="type"
          placeholder="Type (PG/Hostel)"
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded"
        />

        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded"
        />

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded"
        />

        <input
          name="contact"
          placeholder="Contact"
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="border p-2 w-full mb-2 rounded"
        />

        <div className="flex justify-end space-x-3 mt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Add Room
          </button>
        </div>
      </div>
    </div>
  );
}
