"use client";

import React, { useEffect, useState } from "react";
import {
  Home,
  Users,
  LayoutGrid,
  BarChart2,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  UserCheck,
  Building2,
  Layout,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ---------------- TYPES ---------------- */

interface DashboardStats {
  totalUsers: number;
  pendingOwners: number;
  totalRooms: number;
  totalProperties: number;
  weeklyGrowth: number;
  newUsers: number;
  roomsAdded: number;
  ownersRegistered: number;
  systemHealthy: boolean;
}

/* ---------------- PAGE ---------------- */

const Dashboard: React.FC = () => {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
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
      .then((data) => {
        setStats({
          totalUsers: data.totalUsers ?? 0,
          pendingOwners: data.pendingOwners ?? 0,
          totalRooms: data.totalRooms ?? 0,
          totalProperties: data.totalProperties ?? 0,

          weeklyGrowth:
            data.weeklyGrowth ??
            data.growthPercentage ??
            0,

          newUsers:
            data.newUsers ??
            data.newUsersThisWeek ??
            0,

          roomsAdded:
            data.roomsAdded ??
            data.roomsAddedThisWeek ??
            0,

          ownersRegistered:
            data.ownersRegistered ??
            data.ownersRegisteredThisWeek ??
            0,

          systemHealthy: data.systemHealthy ?? true,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);


  if (loading) {
    return <div className="p-10 text-gray-500">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="p-10 text-red-500">Failed to load data</div>;
  }

  return (
    <div className="flex flex-col flex-1 p-8 bg-[#f8f9ff] font-sans">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="text-3xl">👋</span>
          <h2 className="text-3xl font-bold text-slate-800">
            Welcome back, Admin!
          </h2>
        </div>
        <p className="text-gray-500 mt-1">
          Here's what's happening today:
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* HERO */}
          <div className="bg-gradient-to-r from-[#b19cfd] via-[#a3beff] to-[#ceefff]
rounded-[2.2rem] p-6 relative overflow-hidden min-h-[220px]
flex flex-col justify-between shadow-sm">

            <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
              <Home size={16} />
              <span className="text-white text-[15px] font-semibold tracking-wide">
                Here's what's happening today</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-3 w-fit">
                <span className="bg-red-500 p-1.5 rounded-lg text-white">
                  <AlertTriangle size={14} />
                </span>
                <span className="font-semibold text-slate-800 text-sm">
                  {stats.pendingOwners} Owners
                  <span className="font-normal opacity-80"> need verification</span>
                </span>
              </div>

              <div className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-3 w-fit">
                <span className="bg-emerald-500 p-1.5 rounded-lg text-white">
                  <CheckCircle2 size={14} />
                </span>
                <span className="font-semibold text-slate-800 text-sm">
                  User growth
                  <span className="font-normal opacity-80">
                    {" "}is up {stats.weeklyGrowth}% this week
                  </span>
                </span>
              </div>
            </div>

            <div className="absolute right-6 bottom-3 opacity-20">
              <Building2 size={140} />
            </div>
          </div>
          {/* MAIN STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MainStatCard
              icon={<Users size={20} />}
              label="Total Users"
              value={stats.totalUsers}
              headerClass="bg-gradient-to-r from-[#6366f1] to-[#a5b4fc]"
            />

            <MainStatCard
              icon={<AlertTriangle size={20} />}
              label="Pending Owners"
              value={stats.pendingOwners}
              headerClass="bg-gradient-to-r from-[#f97316] to-[#fdba74]"
              hasBadge
              onClick={() => router.push("/panel/owners")}
            />

            <MainStatCard
              icon={<Layout size={20} />}
              label="Total Rooms"
              value={stats.totalRooms}
              headerClass="bg-gradient-to-r from-[#3b82f6] to-[#93c5fd]"
            />
          </div>

          {/* SYSTEM HEALTH */}
          <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100
flex items-center gap-6 w-fit">

            <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
              <CheckCircle2 size={16} />
              {stats.systemHealthy ? "System Healthy" : "System Warning"}
            </div>

            <div className="h-4 w-px bg-gray-200"></div>

            <div className="flex items-center gap-2 text-emerald-500 text-sm opacity-80">
              <Activity size={16} />
              System Status
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* ANALYTICS */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 h-[300px] flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-700 text-lg">
                Analytics Overview
              </h3>
              <div className="text-5xl font-bold text-emerald-500 mt-2">
                +{stats.weeklyGrowth}%
              </div>
              <p className="text-sm text-gray-400 mt-1">
                New Users this week
              </p>
            </div>
            <div className="mt-6">
              <svg className="w-full h-16" viewBox="0 0 100 40">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>

                <path
                  d="M0 28 Q 25 18, 50 20 T 100 6"
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <circle cx="100" cy="6" r="4" fill="#10b981" />
              </svg>
            </div>
          </div>

          {/* STATISTICS */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 h-[300px]">
            <h3 className="font-bold text-slate-700 text-lg mb-6">
              Statistics
            </h3>

            <div className="space-y-6">
              <MiniStatItem value={`+${stats.newUsers}`} label="New Users" />
              <MiniStatItem
                value={`+${stats.roomsAdded}`}
                label="Rooms Added"
              />
              <MiniStatItem
                value={`+${stats.ownersRegistered}`}
                label="Owners Registered"
              />
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="col-span-12 mt-6">
          <h3 className="font-bold text-xl mb-6 text-slate-800">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionCard
              icon={<UserCheck size={24} />}
              title="Verify Owners"
              desc="Review and verify pending owners"
              onClick={() => router.push("/panel/owners")}
            />
            <ActionCard
              icon={<Building2 size={24} />}
              title="Approve Properties"
              desc="Approve pending property listings"
              onClick={() => router.push("/panel/properties")}
            />
            <ActionCard
              icon={<Layout size={24} />}
              title="Manage Rooms"
              desc="View and edit room details"
              onClick={() => router.push("/panel/rooms")}
            />
            <ActionCard
              icon={<BarChart2 size={24} />}
              title="View Analytics"
              desc="Explore detailed analytics"
              onClick={() => router.push("/panel/analytics")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- SUB COMPONENTS ---------------- */

const MainStatCard = ({
  icon,
  label,
  value,
  headerClass,
  hasBadge,
  onClick,
}: any) => (
  <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col">
    <div
      className={`${headerClass} p-3 px-6 flex items-center gap-2 text-white font-medium text-sm`}
    >
      {icon} {label}
    </div>
    <div className="p-7 flex-1 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <div className="text-5xl font-bold text-slate-800">{value}</div>
        {hasBadge && (
          <button
            onClick={onClick}
            className="bg-[#ff6b81] text-white text-xs px-5 py-2 rounded-xl font-bold shadow-sm"
          >
            Review
          </button>
        )}
      </div>
      <div className="flex justify-between items-center mt-6 text-gray-400 text-sm font-medium">
        <span>{label}</span>
        <ChevronRight size={18} />
      </div>
    </div>
  </div>
);
const MiniStatItem = ({ value, label }: any) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <span className="text-emerald-500 font-bold text-lg w-10">
        {value}
      </span>
      <span className="text-slate-600 font-medium text-sm">
        {label}
      </span>
    </div>
  </div>
);


const ActionCard = ({ icon, title, desc, onClick }: any) => (
  <div
    onClick={onClick}
    className="bg-white p-7 rounded-[2rem] border border-gray-100 flex items-center gap-5 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
  >
    <div className="bg-indigo-50 text-indigo-500 p-4 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all">
      {icon}
    </div>
    <div className="flex-1">
      <div className="font-bold text-slate-800 text-lg">{title}</div>
      <div className="text-xs text-gray-400 mt-1 font-medium">{desc}</div>
    </div>
    <ChevronRight
      className="text-gray-300 group-hover:text-indigo-400"
      size={22}
    />
  </div>
);

export default Dashboard;
