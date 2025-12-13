"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import DynamicTable from "../components/DynamicTable";

type Owner = {
  id: string;
  userId: string;
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

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // Fetch owners based on filter
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
  }, [filter]);

  // Toggle verification
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
        alert("Failed to update verification status");
        return;
      }

      fetchOwners();
    } catch (err) {
      console.error("Toggle verify error:", err);
      alert("Error while updating verification status");
    }
  };

  // Filter search
  const filteredOwners = owners.filter((o) => {
    const q = search.toLowerCase();
    return (
      (o.user?.name ?? "").toLowerCase().includes(q) ||
      (o.user?.email ?? "").toLowerCase().includes(q) ||
      (o.businessName ?? "").toLowerCase().includes(q)
    );
  });

  if (loading)
    return <div className="p-6 text-gray-800">Loading owners...</div>;

  // ---------------------------------------
  // 🔥 DYNAMIC TABLE CONFIGURATION
  // ---------------------------------------

  const tableData = filteredOwners.map((o) => ({
    ...o,

    ownerName: o.user?.name ?? "-",
    email: o.user?.email ?? "-",
    business: o.businessName ?? "-",

    verifiedBadge: o.verified ? (
      <span className="text-green-600 font-semibold">Verified</span>
    ) : (
      <span className="text-red-600 font-semibold">Not Verified</span>
    ),
  }));

  const columns = [
    { key: "ownerName", label: "Owner Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "business", label: "Business" },
    { key: "verifiedBadge", label: "Verified" },
  ];

  const actions = [
    {
      label: "View Profile",
      className: "bg-blue-600 hover:bg-blue-700",
      onClick: (row: any) =>
        (window.location.href = `/panel/owners/${row.id}`),
    },
    {
      label: "Toggle Verify",
      className: "bg-green-600 hover:bg-green-700",
      onClick: (row: any) => toggleVerify(row.id, !row.verified),
    },
  ];

  return (
    <div className="p-6 text-gray-800">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Owners</h1>

        {/* SEARCH BAR */}
        <div className="flex items-center bg-white border shadow-sm rounded-md px-3 py-2 w-72">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search owners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 outline-none w-full bg-transparent text-sm"
          />
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

      {/* 🔥 DYNAMIC TABLE */}
      <DynamicTable
        data={tableData}
        columns={columns}
        actions={actions}
        perPage={10}
      />
    </div>
  );
}
