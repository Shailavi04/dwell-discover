"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/app/panel/components/ProtectedRoute";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { RefreshCw } from "lucide-react";

/* ------------------- TYPES ------------------- */
type Overview = {
  totalOwners?: number;
  totalRooms?: number;
  totalUsers?: number;
  pendingOwners?: number;
};

type TimeCount = { label: string; count: number };
type OwnerStatus = { status: string; count: number };
type RoomsPerCity = { city: string; count: number };

/* ------------------- NORMALIZERS ------------------- */
function normalizeTimeCount(data: any[]) {
  return data.map((d) => ({
    label: d.label || d.month || d._id?.month || "",
    count: d.count ?? 0,
  }));
}

function normalizeOwnerStatus(data: any[]) {
  return data.map((d) => ({
    status: d.status ?? d._id ?? "",
    count: d.count ?? 0,
  }));
}

function normalizeRoomsPerCity(data: any[]) {
  return data.map((d) => ({
    city: d.city ?? d._id ?? "",
    count: d.count ?? 0,
  }));
}

/* ------------------- GLASS CARD ------------------- */
function GlassCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="backdrop-blur-xl bg-white/30 shadow-xl border border-white/40 rounded-2xl p-5">
      <h3 className="text-black font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

/* ------------------- STAT CARD ------------------- */
function StatCard({ title, value }: { title: string; value: number | undefined }) {
  return (
    <div className="backdrop-blur-lg bg-white/30 rounded-2xl border border-white/40 shadow-md p-4 flex flex-col">
      <span className="text-sm text-gray-600">{title}</span>
      <span className="text-3xl font-bold text-black mt-2">{value ?? 0}</span>
    </div>
  );
}

const PIE_COLORS = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"];

/* ------------------- MAIN PAGE ------------------- */
function AnalyticsContent() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [monthlyUsers, setMonthlyUsers] = useState<TimeCount[]>([]);
  const [monthlyRooms, setMonthlyRooms] = useState<TimeCount[]>([]);
  const [ownerStatus, setOwnerStatus] = useState<OwnerStatus[]>([]);
  const [roomsPerCity, setRoomsPerCity] = useState<RoomsPerCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE = "http://localhost:9092";

  const apiGet = async (url: string) => {
    const token = localStorage.getItem("token") || "";
    const res = await fetch(`${BASE}${url}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`${url} failed: ${res.status}`);
    return res.json();
  };

  async function loadAll() {
    try {
      setRefreshing(true);
      setError(null);

      const [overviewRes, mu, mr, os, rpc] = await Promise.all([
        apiGet("/api/analytics/overview"),
        apiGet("/api/analytics/monthly-users"),
        apiGet("/api/analytics/monthly-rooms"),
        apiGet("/api/analytics/owner-status"),
        apiGet("/api/analytics/rooms-per-city"),
      ]);

      setOverview(overviewRes);
      setMonthlyUsers(normalizeTimeCount(mu));
      setMonthlyRooms(normalizeTimeCount(mr));
      setOwnerStatus(normalizeOwnerStatus(os));
      setRoomsPerCity(normalizeRoomsPerCity(rpc));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-black text-4xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Insights & performance overview</p>
        </div>
        <button
          onClick={loadAll}
          className="bg-white text-black border rounded-xl px-4 py-2 shadow flex items-center gap-2"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && <div className="text-red-600 text-lg">{error}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={overview?.totalUsers} />
        <StatCard title="Total Owners" value={overview?.totalOwners} />
        <StatCard title="Total Rooms" value={overview?.totalRooms} />
        <StatCard title="Pending Owners" value={overview?.pendingOwners} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard title="Monthly Users">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Owner Status">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ownerStatus.map((o) => ({
                    name: o.status,
                    value: o.count,
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label
                >
                  {ownerStatus.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard title="Rooms Per City">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomsPerCity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Monthly Rooms Added">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRooms}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedPermissions={["analytics"]}>
      <AnalyticsContent />
    </ProtectedRoute>
  );
}
