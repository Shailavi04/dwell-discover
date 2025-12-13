"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import DynamicTable from "../components/DynamicTable";

type User = {
  id: string;
  name: string;
  email: string;
  role: { name: string };
  createdAt?: string;
  lastLoginAt?: string;
  blocked: boolean;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `http://localhost:9092/api/users?search=${search}&page=${page}&size=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  // Block / Unblock user
  const toggleBlock = async (id: string, block: boolean) => {
    try {
      await fetch(`http://localhost:9092/api/users/${id}/block`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ block }),
      });

      fetchUsers();
    } catch (err) {
      console.error("Block/Unblock failed", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-xl mb-4">Loading users...</div>
        <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse w-1/3"></div>
        <div className="space-y-3">
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // -------------------------------
  // 🔥 DYNAMIC TABLE CONFIGURATION
  // -------------------------------

  const processed = users.map((u) => ({
    ...u,
    roleName: u.role?.name,

    createdText: u.createdAt
      ? new Date(u.createdAt).toLocaleString()
      : "-",

    loginText: u.lastLoginAt
      ? new Date(u.lastLoginAt).toLocaleString()
      : "-",

    statusBadge: u.blocked ? (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
        Blocked
      </span>
    ) : (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
        Active
      </span>
    ),
  }));

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "roleName", label: "Role" },
    { key: "createdText", label: "Created At" },
    { key: "loginText", label: "Last Login" },
    { key: "statusBadge", label: "Status" },
  ];

  const actions = [
    {
      label: "Login Logs",
      className: "bg-blue-600 hover:bg-blue-700",
      onClick: (row: any) =>
        (window.location.href = `/panel/users/${row.email}/logins`),
    },
    {
      label: "Toggle",
      className: "bg-red-600 hover:bg-red-700",
      onClick: (row: any) => toggleBlock(row.id, !row.blocked),
    },
  ];

  return (
    <div className="p-6 text-gray-800">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Users</h1>

        {/* Search bar */}
        <div className="flex items-center bg-white border shadow-sm rounded-md px-3 py-2 w-60">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 outline-none w-full bg-transparent"
          />
        </div>
      </div>

      {/* 🔥 DYNAMIC TABLE */}
      <DynamicTable
        data={processed}
        columns={columns}
        actions={actions}
        perPage={10}
      />
    </div>
  );
}
