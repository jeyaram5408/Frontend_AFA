import React, { useEffect, useState } from "react";
import { getAdminLogs } from "../api/adminApi";

const ACTION_COLORS = {
  DELETE_USER: "bg-red-100 text-red-700",
  DELETE_TRANSACTION: "bg-red-100 text-red-700",
  UPDATE_USER_STATUS: "bg-yellow-100 text-yellow-700",
  VIEW_STATS: "bg-blue-100 text-blue-700",
  CREATE_CATEGORY: "bg-green-100 text-green-700",
  UPDATE_CATEGORY: "bg-yellow-100 text-yellow-700",
  DELETE_CATEGORY: "bg-red-100 text-red-700",
};

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    getAdminLogs(limit)
      .then((res) => setLogs(res.data.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [limit]);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">System Logs</h2>
          <p className="text-sm text-gray-500 mt-1">Admin activity history</p>
        </div>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value={25}>Last 25</option>
          <option value={50}>Last 50</option>
          <option value={100}>Last 100</option>
          <option value={200}>Last 200</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["#", "Action", "Target", "Description", "Date & Time"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-sm">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-sm">No logs found</td></tr>
              ) : (
                logs.map((log, idx) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        ACTION_COLORS[log.action] || "bg-gray-100 text-gray-600"
                      }`}>
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                      {log.target_type} {log.target_id ? `#${log.target_id}` : ""}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{log.description || "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {log.created_at ? new Date(log.created_at).toLocaleString("en-GB") : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
