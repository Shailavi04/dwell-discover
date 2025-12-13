"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import DynamicTable from "../components/DynamicTable";
import AddRoomModal from "./AddRoomModal";
import EditRoomModal from "./EditRoomModal";

type Room = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerMonth: number;
  city: string;
  propertyName: string;
  ownerName: string;
  verified: boolean;
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ---------------------------------------------
  // FETCH ROOMS
  // ---------------------------------------------
  const fetchRooms = async () => {
    try {
      setLoading(true);

      let url = "http://localhost:9092/api/rooms";
      if (filter === "verified") url += "/verified";
      if (filter === "unverified") url += "/unverified";

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setRooms(data ?? []);
    } catch (e) {
      console.error("Fetch rooms error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [filter]);

  // ---------------------------------------------
  // ADMIN ONLY: TOGGLE VERIFY
  // ---------------------------------------------
  const toggleVerify = async (id: string) => {
    const res = await fetch(
      `http://localhost:9092/api/rooms/${id}/verify`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      alert("Failed to update room verification");
      return;
    }

    fetchRooms();
  };

  // ---------------------------------------------
  // SEARCH FILTER
  // ---------------------------------------------
  const filtered = rooms.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.propertyName.toLowerCase().includes(q)
    );
  });

  // ---------------------------------------------
  // TABLE CONFIG
  // ---------------------------------------------
  const columns = [
    { key: "name", label: "Room", sortable: true },
    { key: "propertyName", label: "Property", sortable: true },
    { key: "ownerName", label: "Owner", sortable: true },
    { key: "city", label: "City", sortable: true },
    { key: "capacity", label: "Capacity" },
    { key: "pricePerMonth", label: "Price / Month" },
    { key: "verified", label: "Verified", sortable: true },
  ];

  const processedData = filtered.map((r) => ({
    ...r,
    pricePerMonth: `₹${r.pricePerMonth}`,
    verified: r.verified ? "Verified" : "Not Verified",
  }));

  // ---------------------------------------------
  // ROLE BASED ACTIONS
  // ---------------------------------------------
  const actions =
    role === "ADMIN"
      ? [
          {
            label: "View",
            className: "bg-blue-600",
            onClick: (row: any) =>
              (window.location.href = `/panel/rooms/${row.id}`),
          },
          {
            label: "Toggle Verify",
            className: "bg-green-600",
            onClick: (row: any) => toggleVerify(row.id),
          },
        ]
      : [
          {
            label: "View",
            className: "bg-blue-600",
            onClick: (row: any) =>
              (window.location.href = `/panel/rooms/${row.id}`),
          },
          {
            label: "Edit",
            className: "bg-yellow-500 hover:bg-yellow-600",
            onClick: async (row: any) => {
              const res = await fetch(
                `http://localhost:9092/api/rooms/${row.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const fullRoom = await res.json();
              setSelectedRoom(fullRoom);
              setShowEditModal(true);
            },
          },
        ];

  if (loading)
    return <div className="p-6 text-gray-800">Loading rooms...</div>;

  return (
    <div className="p-6 text-gray-800">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between mb-6">
        <h1 className="text-3xl font-bold">Rooms</h1>

        <div className="flex gap-3 items-center">
          <div className="flex items-center bg-white border rounded px-3 py-2 w-72">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-2 outline-none w-full bg-transparent"
            />
          </div>

          {role === "OWNER" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              + Add Room
            </button>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 mb-4">
        {["all", "verified", "unverified"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 border rounded ${
              filter === f ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <DynamicTable
        data={processedData}
        columns={columns}
        actions={actions}
        perPage={10}
      />

      {/* ADD ROOM */}
      {showAddModal && (
        <AddRoomModal
          onClose={() => setShowAddModal(false)}
          onRoomAdded={() => {
            setShowAddModal(false);
            fetchRooms();
          }}
        />
      )}

      {/* EDIT ROOM */}
      {showEditModal && selectedRoom && (
        <EditRoomModal
          room={selectedRoom}
          onClose={() => {
            setShowEditModal(false);
            setSelectedRoom(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedRoom(null);
            fetchRooms();
          }}
        />
      )}
    </div>
  );
}
