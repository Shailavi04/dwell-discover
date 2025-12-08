"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type LoginEntry = {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  success: boolean;
};

export default function LoginHistoryPage() {
  const params = useParams();
  const router = useRouter();

  const email = params.email as string;

  const [history, setHistory] = useState<LoginEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchHistory = async () => {
    try {
      const res = await fetch(
        `http://localhost:9092/api/users/${email}/logins`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setHistory(data.logins || []);
    } catch (err) {
      console.error("Error fetching login history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-6 text-gray-800">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Login History</h1>
          <p className="text-gray-600 mt-1">
            User: <span className="font-semibold">{email}</span>
          </p>
        </div>

        <button
          onClick={() => router.push("/panel/users")}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md"
        >
          ← Back to Users
        </button>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <p className="text-gray-600">Loading login logs...</p>
      )}

      {/* EMPTY STATE */}
      {!loading && history.length === 0 && (
        <p className="text-gray-500">No login history found for this user.</p>
      )}

      {/* TABLE */}
      {!loading && history.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border border-gray-300 text-left font-semibold">
                  Timestamp
                </th>
                <th className="p-3 border border-gray-300 text-left font-semibold">
                  IP Address
                </th>
                <th className="p-3 border border-gray-300 text-left font-semibold">
                  User Agent
                </th>
                <th className="p-3 border border-gray-300 text-left font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {history.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="p-3 border border-gray-300">{log.ip}</td>

                  <td className="p-3 border border-gray-300 text-sm text-gray-700">
                    {log.userAgent}
                  </td>

                  <td className="p-3 border border-gray-300">
                    {log.success ? (
                      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700 font-semibold">
                        Success
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700 font-semibold">
                        Failed
                      </span>
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
