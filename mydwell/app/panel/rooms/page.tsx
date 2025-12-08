"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/panel/components/ProtectedRoute";
import { Search } from "lucide-react";

interface Room {
  id: string;
  name: string;
  type: string;
  description: string;

  capacity: number;
  pricePerMonth: number;
  pricePerDay: number;

  propertyName: string;
  city: string;
  address: string;
  contact: string;

  ownerName: string;
  ownerEmail: string;

  verified: boolean;
}

function RoomsContent() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchRooms = async () => {
    try {
      setLoading(true);

      let url = "http://localhost:9092/api/rooms";
      if (filter === "verified") url = "http://localhost:9092/api/rooms/verified";
      if (filter === "unverified") url = "http://localhost:9092/api/rooms/unverified";

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setRooms(data ?? []);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [filter]);

  // FIXED VERSION
  const toggleVerify = async (id: string, status: boolean) => {
    const res = await fetch(`http://localhost:9092/api/rooms/${id}/verify`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    if (!res.ok) {
      alert("Failed to update verification status");
      return;
    }

    const updatedRoom = await res.json();

    setRooms((prev) =>
      prev.map((r) => (r.id === id ? updatedRoom : r))
    );
  };

  const filtered = rooms.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.propertyName.toLowerCase().includes(q)
    );
  });

  if (loading) return <div className="p-6 text-gray-800">Loading rooms...</div>;

  return (
    <div className="p-6 text-gray-800">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between mb-6">
        <h1 className="text-3xl font-bold">Rooms</h1>

        <div className="flex gap-3">
          <div className="flex items-center bg-white border shadow-sm rounded-md px-3 py-2 w-72">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-2 outline-none w-full bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-md border ${filter === "all" ? "bg-blue-600 text-white" : "bg-white"}`}>
          All
        </button>

        <button onClick={() => setFilter("verified")} className={`px-4 py-2 rounded-md border ${filter === "verified" ? "bg-green-600 text-white" : "bg-white"}`}>
          Verified
        </button>

        <button onClick={() => setFilter("unverified")} className={`px-4 py-2 rounded-md border ${filter === "unverified" ? "bg-red-600 text-white" : "bg-white"}`}>
          Unverified
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Room</th>
              <th className="p-3 border">Property</th>
              <th className="p-3 border">Owner</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Capacity</th>
              <th className="p-3 border">Price/Month</th>
              <th className="p-3 border">City</th>
              <th className="p-3 border">Verified</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">

                <td className="p-3 border font-semibold">{r.name}</td>
                <td className="p-3 border">{r.propertyName}</td>
                <td className="p-3 border">{r.ownerName}</td>
                <td className="p-3 border">{r.type}</td>
                <td className="p-3 border">{r.capacity}</td>
                <td className="p-3 border">₹{r.pricePerMonth}</td>
                <td className="p-3 border">{r.city}</td>

                <td className="p-3 border">
                  {r.verified ? (
                    <span className="text-green-600 font-semibold">Verified</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Not Verified</span>
                  )}
                </td>

                <td className="p-3 border text-center">
                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => window.location.href = `/panel/rooms/${r.id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md"
                    >
                      View
                    </button>

                    <button
                      onClick={() => toggleVerify(r.id, !r.verified)}
                      className={`px-3 py-1 rounded-md text-white ${
                        r.verified ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {r.verified ? "Unverify" : "Verify"}
                    </button>

                  </div>
                </td>

              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-500">
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <ProtectedRoute allowedPermissions={["rooms"]}>
      <RoomsContent />
    </ProtectedRoute>
  );
}
