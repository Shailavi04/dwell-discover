"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

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
        `http://localhost:9092/api/users?search=${search}&page=${page}&size=20`,
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

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border border-gray-300 text-left font-semibold">Name</th>
              <th className="p-3 border border-gray-300 text-left font-semibold">Email</th>
              <th className="p-3 border border-gray-300 text-left font-semibold">Role</th>
              <th className="p-3 border border-gray-300 font-semibold">Created At</th>
              <th className="p-3 border border-gray-300 font-semibold">Last Login</th>
              <th className="p-3 border border-gray-300 font-semibold">Status</th>
              <th className="p-3 border border-gray-300 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-300">{u.name}</td>
                <td className="p-3 border border-gray-300">{u.email}</td>
                <td className="p-3 border border-gray-300">{u.role?.name}</td>

                <td className="p-3 border border-gray-300">
                  {u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}
                </td>

                <td className="p-3 border border-gray-300">
                  {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "-"}
                </td>

                <td className="p-3 border border-gray-300">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      u.blocked
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {u.blocked ? "Blocked" : "Active"}
                  </span>
                </td>

                <td className="p-3 border border-gray-300 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() =>
                        (window.location.href = `/panel/users/${u.email}/logins`)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                    >
                      Login Logs
                    </button>

                    <button
                      onClick={() => toggleBlock(u.id, !u.blocked)}
                      className={`px-3 py-1 text-white rounded-md ${
                        u.blocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {u.blocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-500 border border-gray-300">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
