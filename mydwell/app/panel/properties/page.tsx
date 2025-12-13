"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import DynamicTable from "../components/DynamicTable";
import AddPropertyModal from "./AddPropertyModal";
import EditPropertyModal from "./EditPropertyModal";

type Property = {
  id: string;
  name: string;
  contact: string;
  city: string;
  address: string;
  description: string;
  verified: boolean;

  ownerId?: string;
  owneruserId?: string;

  ownerName?: string;
  ownerEmail?: string;
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : "";
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : "";

  // ---------------------------------------------
  // ⭐ ONLY ONE CLEAN fetchProperties() FUNCTION
  // ---------------------------------------------
  const fetchProperties = async () => {
    try {
      setLoading(true);

      let url = "http://localhost:9092/api/property-list";

      if (filter === "verified") url = "http://localhost:9092/api/property-list/verified";
      if (filter === "unverified") url = "http://localhost:9092/api/property-list/unverified";

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // ⭐ FRONTEND FILTERING FOR OWNER
      if (role === "OWNER") {
        const ownerOnly = data.filter(
          (p: any) =>
            p.owneruserId === userId ||
            p.ownerId === userId
        );
        setProperties(ownerOnly);
      } else {
        setProperties(data); // ADMIN sees all
      }

    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filter]);

  // ---------------------------------------------
  // Toggle Verify (Admin only)
  // ---------------------------------------------
  const toggleVerify = async (id: string) => {
    const res = await fetch(`http://localhost:9092/api/property-list/${id}/verify`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return alert("Failed to update property verification");
    fetchProperties();
  };

  // ---------------------------------------------
  // SEARCH FILTER
  // ---------------------------------------------
  const filtered = properties.filter((p) => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
  });

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "ownerName", label: "Owner Name", sortable: true },
    { key: "city", label: "City", sortable: true },
    { key: "contact", label: "Contact" },
    { key: "verified", label: "Verified", sortable: true },
  ];

  const processedData = filtered.map((p) => ({
    ...p,
    verified: p.verified ? "Verified" : "Not Verified",
  }));

  // ---------------------------------------------
  // ROLE-BASED ACTIONS
  // ---------------------------------------------
  const actions =
    role === "ADMIN"
      ? [
          { label: "View", className: "bg-blue-600", onClick: (row: any) => window.location.href = `/panel/properties/${row.id}` },
          { label: "Toggle Verify", className: "bg-green-600", onClick: (row: any) => toggleVerify(row.id) },
        ]
      : [
          { label: "View", className: "bg-blue-600", onClick: (row: any) => window.location.href = `/panel/properties/${row.id}` },
          {
            label: "Edit",
            className: "bg-yellow-500",
            onClick: (row: any) => {
              setSelectedProperty(row);
              setShowEditModal(true);
            },
          },
        ];

  if (loading) return <div className="p-6 text-gray-800">Loading properties...</div>;

  return (
    <div className="p-6 text-gray-800">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Properties</h1>

        <div className="flex gap-3 items-center">
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

          {role === "OWNER" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
            >
              + Add Property
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <DynamicTable
        data={processedData}
        columns={columns}
        actions={actions}
        perPage={10}
      />

      {/* ADD MODAL */}
      <AddPropertyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchProperties}
      />

      {/* EDIT MODAL */}
      <EditPropertyModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchProperties}
        property={selectedProperty}
      />

    </div>
  );
}
