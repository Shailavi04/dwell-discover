"use client";

import { useEffect, useState } from "react";
import { Users, Home, AlertTriangle, BedDouble } from "lucide-react";
import StatCard from "../components/StatCard";
import ActionCard from "../components/ActionCard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter(); // ✅ THIS WAS MISSING

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:9092/api/admin/dashboard/summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard");
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 space-y-8 bg-[#f6f7fb] min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          👋 Welcome back, Admin!
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening today
        </p>
      </div>

      {/* HERO ALERT */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-6 flex justify-between items-center shadow-lg">
        <div className="space-y-2">
          <p className="text-lg font-semibold">⚠ Needs Attention</p>
          <p>{stats.pendingOwners} owners need verification</p>
          <p className="text-sm opacity-90">
            Platform overview summary
          </p>
        </div>
        <button className="bg-white text-indigo-600 px-5 py-2 rounded-xl font-semibold shadow">
          Review
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users />}
          gradient="from-purple-500 to-indigo-500"
        />
        <StatCard
          title="Pending Owners"
          value={stats.pendingOwners}
          icon={<AlertTriangle />}
          gradient="from-orange-500 to-red-500"
          danger
        />
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon={<BedDouble />}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Properties"
          value={stats.totalProperties}
          icon={<Home />}
          gradient="from-emerald-500 to-teal-500"
        />
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h2 className="text-xl text-black font-semibold mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ActionCard
            title="Verify Owners"
            onClick={() =>
              router.push("/panel/owners")
            }
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
