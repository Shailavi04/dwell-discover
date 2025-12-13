"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/panel/components/ProtectedRoute";
import { Search } from "lucide-react";
import DynamicTable from "../components/DynamicTable";

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

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

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

  // Fix: update only the changed room
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

  if (loading)
    return <div className="p-6 text-gray-800">Loading rooms...</div>;

  // ---------------------------------------
  // 🔥 DYNAMIC TABLE SETUP
  // ---------------------------------------

  const tableData = filtered.map((r) => ({
    ...r,

    roomName: r.name,
    property: r.propertyName,
    owner: r.ownerName,
    typeLabel: r.type,
    capacityNum: r.capacity,
    monthlyPrice: `₹${r.pricePerMonth}`,
    verifiedBadge: r.verified ? (
      <span className="text-green-600 font-semibold">Verified</span>
    ) : (
      <span className="text-red-600 font-semibold">Not Verified</span>
    ),
  }));

  const columns = [
    { key: "roomName", label: "Room", sortable: true },
    { key: "property", label: "Property", sortable: true },
    { key: "owner", label: "Owner" },
    { key: "typeLabel", label: "Type" },
    { key: "capacityNum", label: "Capacity" },
    { key: "monthlyPrice", label: "Price/Month" },
    { key: "city", label: "City" },
    { key: "verifiedBadge", label: "Verified" },
  ];

  const actions = [
    {
      label: "View",
      className: "bg-blue-600 hover:bg-blue-700",
      onClick: (row: any) =>
        (window.location.href = `/panel/rooms/${row.id}`),
    },
    {
      label: "Toggle Verify",
      className: "bg-green-600 hover:bg-green-700",
      onClick: (row: any) => toggleVerify(row.id, !row.verified),
    },
  ];

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
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md border ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("verified")}
          className={`px-4 py-2 rounded-md border ${
            filter === "verified" ? "bg-green-600 text-white" : "bg-white"
          }`}
        >
          Verified
        </button>

        <button
          onClick={() => setFilter("unverified")}
          className={`px-4 py-2 rounded-md border ${
            filter === "unverified" ? "bg-red-600 text-white" : "bg-white"
          }`}
        >
          Unverified
        </button>
      </div>

      {/* 🔥 DYNAMIC TABLE */}
      <DynamicTable
        data={tableData}
        columns={columns}
        actions={actions}
        perPage={10}
      />
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
