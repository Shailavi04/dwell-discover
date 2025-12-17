"use client";

import { useEffect, useState } from "react";
import { Users, Home, AlertTriangle, BedDouble } from "lucide-react";
import StatCard from "../components/StatCard";
import ActionCard from "../components/ActionCard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:9092/api/admin/dashboard/summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 space-y-10 bg-[#f7f8fc] min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
          👋 Welcome back, Admin!
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening today:
        </p>
      </div>

      {/* HERO / STATUS CARD (REFERENCE STYLE) */}
      <div
        className="
        rounded-3xl p-7 flex justify-between items-center
        bg-gradient-to-r from-purple-100 via-indigo-50 to-white
        border border-purple-100 shadow-sm
      "
      >
        <div className="space-y-3">
          <p className="text-sm font-semibold text-indigo-700 flex items-center gap-2">
            🏠 Here's what's happening today:
          </p>

          <div className="flex items-center gap-2 text-gray-700">
            <AlertTriangle className="text-orange-500 w-4 h-4" />
            <span>{stats.pendingOwners} owners need verification</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            ✅ <span>User growth is up this week</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/panel/owners")}
          className="
            bg-indigo-600 text-white px-5 py-2 rounded-xl
            text-sm font-medium hover:bg-indigo-500 transition
          "
        >
          Review
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users />}
          gradient="from-purple-200 to-purple-100"
        />

        <StatCard
          title="Pending Owners"
          value={stats.pendingOwners}
          icon={<AlertTriangle />}
          gradient="from-orange-200 to-orange-100"
          danger
        />

        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon={<BedDouble />}
          gradient="from-blue-200 to-blue-100"
        />

        <StatCard
          title="Properties"
          value={stats.totalProperties}
          icon={<Home />}
          gradient="from-emerald-200 to-emerald-100"
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <ActionCard
            title="Verify Owners"
            onClick={() => router.push("/panel/owners")}
          />
          <ActionCard
            title="Approve Properties"
            onClick={() => router.push("/panel/properties")}
          />
          <ActionCard
            title="Manage Rooms"
            onClick={() => router.push("/panel/rooms")}
          />
          <ActionCard
            title="View Analytics"
            onClick={() => router.push("/panel/analytics")}
          />
        </div>
      </div>
    </div>
  );
}
