"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import DynamicTable from "../components/DynamicTable";

interface Booking {
  id: string;
  userId: string;
  roomId: string;
  ownerId: string;
  status: string;
  totalAmount: number;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:9092/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setBookings(data ?? []);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // FILTER LOGIC
  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();

    const matchesSearch =
      b.userId.toLowerCase().includes(q) ||
      b.ownerId.toLowerCase().includes(q) ||
      b.roomId.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q);

    const matchesFilter =
      filter === "all" ? true : b.status.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  if (loading)
    return <div className="p-6 text-gray-800">Loading bookings...</div>;

  // -------------------------------------------------
  // 🔥 DYNAMIC TABLE SETUP
  // -------------------------------------------------

  const tableData = filtered.map((b) => ({
    ...b,

    statusBadge:
      b.status === "APPROVED" ? (
        <span className="text-green-600 font-semibold">Approved</span>
      ) : b.status === "PENDING" ? (
        <span className="text-yellow-600 font-semibold">Pending</span>
      ) : (
        <span className="text-red-600 font-semibold">Rejected</span>
      ),

    amountFormatted: `₹${b.totalAmount}`,
  }));

  const columns = [
    { key: "id", label: "Booking ID", sortable: true },
    { key: "userId", label: "User" },
    { key: "roomId", label: "Room" },
    { key: "ownerId", label: "Owner" },
    { key: "statusBadge", label: "Status" },
    { key: "amountFormatted", label: "Amount" },
  ];

  return (
    <div className="p-6 text-gray-800">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Bookings</h1>

        <div className="flex gap-3">
          {/* SEARCH BAR */}
          <div className="flex items-center bg-white border shadow-sm rounded-md px-3 py-2 w-72">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search bookings..."
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
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-md border ${
            filter === "pending" ? "bg-yellow-500 text-white" : "bg-white"
          }`}
        >
          Pending
        </button>

        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-md border ${
            filter === "approved" ? "bg-green-600 text-white" : "bg-white"
          }`}
        >
          Approved
        </button>

        <button
          onClick={() => setFilter("rejected")}
          className={`px-4 py-2 rounded-md border ${
            filter === "rejected" ? "bg-red-600 text-white" : "bg-white"
          }`}
        >
          Rejected
        </button>
      </div>

      {/* 🔥 DYNAMIC TABLE */}
      <DynamicTable
        data={tableData}
        columns={columns}
        perPage={10}
      />
    </div>
  );
}
