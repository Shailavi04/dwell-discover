"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/panel/components/ProtectedRoute";
import { Search, PenLine } from "lucide-react";

interface Role {
  id: number;
  name: string;
  permissions: string[];
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newPermissions, setNewPermissions] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:9092/api/roles", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error("Failed to load roles:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openModal = (role: Role) => {
    setSelectedRole(role);
    setNewPermissions(role.permissions);
    setShowModal(true);
  };

  const togglePermission = (perm: string) => {
    setNewPermissions((prev) =>
      prev.includes(perm)
        ? prev.filter((p) => p !== perm)
        : [...prev, perm]
    );
  };

  const savePermissions = async () => {
    if (!selectedRole) return;

    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:9092/api/roles/${selectedRole.id}/permissions`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPermissions),
      }
    );

    alert("Updated Successfully!");
    setShowModal(false);
    fetchRoles();
  };

  const allPermissions = [
    "dashboard",
    "users",
    "rooms",
    "owners",
    "properties",
    "search",
    "viewRooms",
    "analytics",
    "cities",
    "amenities",
    "inquiries",
    "roles",
    "bookings",
  ];

  if (loading) {
    return <div className="p-6">Loading Roles...</div>;
  }

  return (
    <ProtectedRoute allowedPermissions={["roles"]}>
      <div className="p-6 text-gray-800">
        {/* HEADER */}
        <div className="flex justify-between mb-6 items-center">
          <h1 className="text-3xl font-bold">Role Management</h1>

          <div className="flex items-center bg-white border shadow-sm rounded-md px-3 py-2 w-60">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-2 outline-none w-full bg-transparent"
            />
          </div>
        </div>

        {/* TABLE */}
     {/* TABLE */}
<div className="overflow-x-auto bg-white rounded-lg shadow">
  <table className="w-full border-collapse border border-gray-300 text-sm">
    <thead>
      <tr className="bg-gray-100 text-center">
        <th className="p-3 border">Role</th>
        <th className="p-3 border">Permissions</th>
        <th className="p-3 border">Actions</th>
      </tr>
    </thead>

    <tbody>
      {roles
        .filter((r) =>
          r.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((role) => (
          <tr key={role.id} className="hover:bg-gray-50 text-center">
            <td className="p-3 border font-semibold">{role.name}</td>
            <td className="p-3 border text-gray-700">
              {role.permissions.join(", ")}
            </td>
            <td className="p-3 border">
              <button
                onClick={() => openModal(role)}
                className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded-md flex items-center gap-1 mx-auto"
              >
                <PenLine size={14} />
                Edit
              </button>
            </td>
          </tr>
        ))}

      {roles.length === 0 && (
        <tr>
          <td colSpan={3} className="p-6 text-gray-500 text-center">
            No roles found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

        {/* MODAL */}
        {showModal && selectedRole && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[450px] shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                Edit Permissions: {selectedRole.name}
              </h2>

              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {allPermissions.map((perm) => (
                  <label key={perm} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newPermissions.includes(perm)}
                      onChange={() => togglePermission(perm)}
                    />
                    {perm}
                  </label>
                ))}
              </div>

              <div className="flex justify-end mt-5 gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={savePermissions}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
