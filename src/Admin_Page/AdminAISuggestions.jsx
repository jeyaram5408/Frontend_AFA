import React, { useEffect, useState } from "react";
import { getAdminAISuggestions } from "../api/adminApi";

const getRatioColor = (ratio) => {
  if (ratio >= 80) return { bar: "bg-red-500", badge: "bg-red-100 text-red-700" };
  if (ratio >= 50) return { bar: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-700" };
  return { bar: "bg-green-500", badge: "bg-green-100 text-green-700" };
};

const AdminAISuggestions = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAISuggestions()
      .then((res) => setRows(res.data.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const high = rows.filter((r) => r.expense_ratio >= 80).length;
  const medium = rows.filter((r) => r.expense_ratio >= 50 && r.expense_ratio < 80).length;
  const good = rows.filter((r) => r.expense_ratio < 50).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">AI Suggestions Monitor</h2>
        <p className="text-sm text-gray-500 mt-1">Financial health overview for all users</p>
      </div>

      {/* Summary Badges */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{high}</p>
          <p className="text-xs text-red-500 mt-1">High Risk (≥80%)</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{medium}</p>
          <p className="text-xs text-yellow-500 mt-1">Moderate (50-80%)</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{good}</p>
          <p className="text-xs text-green-500 mt-1">Healthy (&lt;50%)</p>
        </div>
      </div>

      {/* User Cards */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const colors = getRatioColor(row.expense_ratio);
            return (
              <div key={row.user_id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {row.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{row.name}</p>
                      <p className="text-xs text-gray-400">{row.email}</p>
                    </div>
                  </div>

                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.badge}`}>
                    {row.expense_ratio}% expense ratio
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Expense Ratio</span>
                    <span>{row.expense_ratio}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${colors.bar}`}
                      style={{ width: `${Math.min(row.expense_ratio, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Finance Stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <p className="text-xs text-gray-400">Income</p>
                    <p className="text-sm font-bold text-green-600">₹{Number(row.income).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <p className="text-xs text-gray-400">Expense</p>
                    <p className="text-sm font-bold text-red-600">₹{Number(row.expense).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <p className="text-xs text-gray-400">Savings</p>
                    <p className={`text-sm font-bold ${
                      row.income - row.expense >= 0 ? "text-indigo-600" : "text-red-600"
                    }`}>
                      ₹{Number(row.income - row.expense).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Suggestion */}
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
                  <p className="text-xs text-blue-700">💡 {row.suggestion}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminAISuggestions;
