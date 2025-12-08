"use client";

import { useEffect, useState } from "react";

type UserReport = {
  id: string;
  reportedEntityId: string;
  reportedByEmail: string;
  reason: string;
  createdAt: string;
  resolved: boolean;
};

export default function ReportedUsersPage() {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchReports = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:9092/api/users/reported", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setReports(data);
    setLoading(false);
  };

  const resolveReport = async (id: string) => {
    const confirmResolve = confirm("Mark this report as resolved?");
    if (!confirmResolve) return;

    await fetch(`http://localhost:9092/api/users/reports/${id}/resolve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchReports(); // refresh after update
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-6 text-black">

      <h1 className="text-3xl font-bold mb-1">Reported Users</h1>
      <p className="text-gray-600 mb-6">List of all reports submitted by users</p>

      {loading ? (
        <p className="text-gray-500">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-600">No reports found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3">Reported User ID</th>
                <th>Reported By</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{r.reportedEntityId}</td>
                  <td>{r.reportedByEmail}</td>
                  <td className="max-w-[250px]">{r.reason}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>

                  <td>
                    {r.resolved ? (
                      <span className="text-green-600 font-semibold">Resolved</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Pending</span>
                    )}
                  </td>

                  <td className="text-right">
                    {!r.resolved && (
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded shadow"
                        onClick={() => resolveReport(r.id)}
                      >
                        Resolve
                      </button>
                    )}
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
