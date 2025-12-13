"use client";

import { useState, useMemo } from "react";

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface Action {
  label: string;
  className?: string;
  onClick: (row: any) => void;
}

interface DynamicTableProps {
  data: any[];
  columns: Column[];
  actions?: Action[];
  perPage?: number;
}

export default function DynamicTable({
  data,
  columns,
  actions = [],
  perPage = 10,
}: DynamicTableProps) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const totalPages = Math.ceil(data.length / perPage);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const x = a[sortKey];
      const y = b[sortKey];

      if (typeof x === "number" && typeof y === "number") {
        return sortOrder === "asc" ? x - y : y - x;
      }

      return sortOrder === "asc"
        ? String(x).localeCompare(String(y))
        : String(y).localeCompare(String(x));
    });
  }, [data, sortKey, sortOrder]);

  const paginated = sortedData.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border">
      <table className="w-full text-sm border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`p-3 border font-semibold ${col.sortable ? "cursor-pointer" : ""}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
                {sortKey === col.key && (
                  <span className="ml-1 text-xs">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
            ))}

            {actions.length > 0 && (
              <th className="p-3 border text-center">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {paginated.map((row, i) => (
            <tr
              key={i}
              className="hover:bg-gray-50 transition"
            >
              {columns.map((col) => (
                <td key={col.key} className="p-3 border">
                  {/* Supports JSX or plain text */}
                  {row[col.key]}
                </td>
              ))}

              {actions.length > 0 && (
                <td className="p-3 border text-center">
                  <div className="flex justify-center gap-2">
                    {actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => action.onClick(row)}
                        className={`px-3 py-1 rounded-md text-white ${action.className}`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}

          {paginated.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (actions.length ? 1 : 0)}
                className="p-6 text-center text-gray-500"
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
