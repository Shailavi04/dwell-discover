"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

type Property = {
  id: string;
  name: string;
  contact: string;
  city: string;
  address: string;
  description: string;
  verified: boolean;

  ownerId: string;
  ownerName?: string;
  ownerEmail?: string;
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchProperties = async () => {
    try {
      setLoading(true);

      let url = "http://localhost:9092/api/property-list";
      if (filter === "verified")
        url = "http://localhost:9092/api/property-list/verified";

      if (filter === "unverified")
        url = "http://localhost:9092/api/property-list/unverified";

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProperties(data ?? []);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filter]);

  // Toggle property verification
  const toggleVerify = async (id: string, status: boolean) => {
    const res = await fetch(
      `http://localhost:9092/api/property-list/${id}/verify`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    );

    if (!res.ok) {
      alert("Failed to update property verification");
      return;
    }

    fetchProperties();
  };

  const filtered = properties.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) 
    );
  });

  if (loading)
    return <div className="p-6 text-gray-800">Loading properties...</div>;

  return (
    <div className="p-6 text-gray-800">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Properties</h1>

        <div className="flex gap-3">
          <div className="flex items-center bg-white border shadow-sm rounded-md px-3 py-2 w-72">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-2 outline-none w-full bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md border ${filter === "all" ? "bg-blue-600 text-white" : "bg-white"
            }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("verified")}
          className={`px-4 py-2 rounded-md border ${filter === "verified" ? "bg-green-600 text-white" : "bg-white"
            }`}
        >
          Verified
        </button>
        <button
          onClick={() => setFilter("unverified")}
          className={`px-4 py-2 rounded-md border ${filter === "unverified" ? "bg-red-600 text-white" : "bg-white"
            }`}
        >
          Unverified
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">OwnerName</th>
              <th className="p-3 border">City</th>
              <th className="p-3 border">Contact</th>
              <th className="p-3 border">Verified</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">

                {/* Property Name */}
                <td className="p-3 border">{p.name}</td>

                {/* OWNER NAME */}
                <td className="p-3 border">
                  {p.ownerName ?? "Unknown Owner"}
                </td>

                {/* CITY */}
                <td className="p-3 border">{p.city}</td>

                {/* CONTACT */}
                <td className="p-3 border">{p.contact || "-"}</td>

                {/* VERIFIED */}
                <td className="p-3 border">
                  {p.verified ? (
                    <span className="text-green-600 font-semibold">Verified</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Not Verified</span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="p-3 border text-center">
                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() =>
                        (window.location.href = `/panel/properties/${p.id}`)
                      }
                      className="px-3 py-1 bg-blue-600 text-white rounded-md"
                    >
                      View
                    </button>

                    <button
                      onClick={() => toggleVerify(p.id, !p.verified)}
                      className={`px-3 py-1 rounded-md text-white ${p.verified
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                      {p.verified ? "Unverify" : "Verify"}
                    </button>

                  </div>
                </td>

              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No properties found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
