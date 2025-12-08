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

export default function BlockedUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // Fetch BLOCKED users only
  const fetchBlockedUsers = async () => {
    try {
      const res = await fetch("http://localhost:9092/api/users?size=200", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const blockedOnly = data.users.filter((u: User) => u.blocked === true);

      setUsers(blockedOnly);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load blocked users:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  // Unblock user
  const unblockUser = async (id: string) => {
    try {
      await fetch(`http://localhost:9092/api/users/${id}/block`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ block: false }),
      });

      // Remove from UI instantly
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to unblock", err);
    }
  };

  return (
    <div className="p-6 text-gray-800">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Blocked Users</h1>

        {/* Search */}
        <div className="flex items-center bg-white border shadow-sm rounded-md px-3 py-2 w-72">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search blocked users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 outline-none w-full bg-transparent"
          />
        </div>
      </div>

      {/* LOADING */}
      {loading && <p className="text-gray-600">Loading blocked users...</p>}

      {/* EMPTY */}
      {!loading && users.length === 0 && (
        <p className="text-gray-500">No blocked users found.</p>
      )}

      {/* TABLE */}
      {!loading && users.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border border-gray-300 text-left font-semibold">Name</th>
                <th className="p-3 border border-gray-300 text-left font-semibold">Email</th>
                <th className="p-3 border border-gray-300 text-left font-semibold">Role</th>
                <th className="p-3 border border-gray-300 text-left font-semibold">Last Login</th>
                <th className="p-3 border border-gray-300 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users
                .filter((u) =>
                  u.name.toLowerCase().includes(search.toLowerCase()) ||
                  u.email.toLowerCase().includes(search.toLowerCase())
                )
                .map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-3 border border-gray-300">{u.name}</td>
                    <td className="p-3 border border-gray-300">{u.email}</td>
                    <td className="p-3 border border-gray-300">
                      {u.role?.name || "-"}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {u.lastLoginAt
                        ? new Date(u.lastLoginAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      <button
                        onClick={() => unblockUser(u.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                      >
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
