"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

type Owner = {
  id: string;
  userId: string; // Reference to Users collection
  verified: boolean;
  documents: string[];
  businessName?: string;
  address?: string;
  updatedAt?: string;

  // USER DATA (Populated from backend)
  user?: {
    name: string;
    email: string;
  };
};

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // fetch owners depending on filter
  const fetchOwners = async () => {
    try {
      setLoading(true);

      let url = "http://localhost:9092/api/owners";
      if (filter === "verified") url = "http://localhost:9092/api/owners/verified";
      if (filter === "unverified") url = "http://localhost:9092/api/owners/unverified";

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch owners:", res.status);
        setOwners([]);
        return;
      }

      const data: Owner[] = await res.json();
      setOwners(data ?? []);
    } catch (err) {
      console.error("Failed to fetch owners", err);
      setOwners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const toggleVerify = async (id: string, verified: boolean) => {
    try {
      const res = await fetch(`http://localhost:9092/api/owners/${id}/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ verified }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Failed to update verification:", res.status, text);
        alert("Failed to update verification status");
        return;
      }

      // refetch with same filter
      fetchOwners();
    } catch (err) {
      console.error("Toggle verify error:", err);
      alert("Error while updating verification status");
    }
  };

  const filteredOwners = owners.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (o.user?.name ?? "").toLowerCase().includes(q) ||
      (o.user?.email ?? "").toLowerCase().includes(q) ||
      (o.businessName ?? "").toLowerCase().includes(q)
    );
  });

  if (loading) return <div className="p-6 text-gray-800">Loading owners...</div>;

  return (
    <div className="p-6 text-gray-800">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Owners</h1>

        <div className="flex gap-3 items-center">
          {/* Search */}
          <div className="flex items-center bg-white border shadow-sm rounded-md px-3 py-2 w-72">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search owners (name, email, business)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-2 outline-none w-full bg-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md border ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("verified")}
          className={`px-4 py-2 rounded-md border ${
            filter === "verified" ? "bg-green-600 text-white" : "bg-white text-gray-700"
          }`}
        >
          Verified
        </button>

        <button
          onClick={() => setFilter("unverified")}
          className={`px-4 py-2 rounded-md border ${
            filter === "unverified" ? "bg-red-600 text-white" : "bg-white text-gray-700"
          }`}
        >
          Unverified
        </button>
      </div>

      {/* OWNERS TABLE */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border border-gray-300 text-left font-semibold">Owner Name</th>
              <th className="p-3 border border-gray-300 text-left font-semibold">Email</th>
              <th className="p-3 border border-gray-300 text-left font-semibold">Business</th>
              <th className="p-3 border border-gray-300 text-left font-semibold">Verified</th>
              <th className="p-3 border border-gray-300 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOwners.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-300">{o.user?.name ?? "-"}</td>

                <td className="p-3 border border-gray-300">{o.user?.email ?? "-"}</td>

                <td className="p-3 border border-gray-300">{o.businessName ?? "-"}</td>

                <td className="p-3 border border-gray-300">
                  {o.verified ? (
                    <span className="text-green-600 font-semibold">Verified</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Not Verified</span>
                  )}
                </td>

                <td className="p-3 border border-gray-300 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => (window.location.href = `/panel/owners/${o.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => toggleVerify(o.id, !o.verified)}
                      className={`px-3 py-1 rounded-md text-white ${
                        o.verified ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {o.verified ? "Unverify" : "Verify"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredOwners.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500 border border-gray-300">
                  No owners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
