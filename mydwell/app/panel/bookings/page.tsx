"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // FILTER: search + booking status
  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();

    const matchesSearch =
      b.userId.toLowerCase().includes(q) ||
      b.ownerId.toLowerCase().includes(q) ||
      b.roomId.toLowerCase().includes(q);

    const matchesFilter =
      filter === "all" ? true : b.status.toLowerCase() === filter;

    return matchesSearch && matchesFilter;
  });

  if (loading)
    return <div className="p-6 text-gray-800">Loading bookings...</div>;

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

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Booking ID</th>
              <th className="p-3 border">User</th>
              <th className="p-3 border">Room</th>
              <th className="p-3 border">Owner</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Amount</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="p-3 border">{b.id}</td>
                <td className="p-3 border">{b.userId}</td>
                <td className="p-3 border">{b.roomId}</td>
                <td className="p-3 border">{b.ownerId}</td>

                <td className="p-3 border font-semibold">
                  {b.status === "APPROVED" && (
                    <span className="text-green-600">Approved</span>
                  )}
                  {b.status === "PENDING" && (
                    <span className="text-yellow-600">Pending</span>
                  )}
                  {b.status === "REJECTED" && (
                    <span className="text-red-600">Rejected</span>
                  )}
                </td>

                <td className="p-3 border text-green-700 font-semibold">
                  ₹{b.totalAmount}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
