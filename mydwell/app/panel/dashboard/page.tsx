"use client";

import { Users, Home, AlertTriangle, BedDouble } from "lucide-react";
import StatCard from "../components/StatCard";
import ActionCard from "../components/ActionCard";

export default function DashboardPage() {
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
          <p>4 owners need verification</p>
          <p className="text-sm opacity-90">
            User growth is up 20% this week 📈
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
          value="10"
          icon={<Users />}
          gradient="from-purple-500 to-indigo-500"
        />
        <StatCard
          title="Pending Owners"
          value="4"
          icon={<AlertTriangle />}
          gradient="from-orange-500 to-red-500"
          danger
        />
        <StatCard
          title="Total Rooms"
          value="4"
          icon={<BedDouble />}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Properties"
          value="2"
          icon={<Home />}
          gradient="from-emerald-500 to-teal-500"
        />
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ActionCard title="Verify Owners" />
          <ActionCard title="Approve Properties" />
          <ActionCard title="Manage Rooms" />
          <ActionCard title="View Analytics" />
        </div>
      </div>

    </div>
  );
}
