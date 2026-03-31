import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { getAdminAnalytics } from "../api/adminApi";

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ef4444", "#0ea5e9", "#a855f7"];

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAnalytics()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Platform Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">Financial insights across all users</p>
      </div>

      {/* Average Spending */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <p className="text-indigo-200 text-sm">Average Monthly Spending (Platform)</p>
        <p className="text-4xl font-bold mt-2">
          ₹{Number(data?.average_monthly_spending || 0).toLocaleString()}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-4">User Growth</h3>
          {data?.user_growth?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.user_growth}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="users" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-10 text-sm">No data</p>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-4">Expense Categories</h3>
          {data?.category_distribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data.category_distribution}
                  dataKey="amount"
                  nameKey="category"
                  outerRadius={90}
                  label={({ category, percent }) =>
                    `${category} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.category_distribution.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-10 text-sm">No data</p>
          )}
        </div>
      </div>

      {/* Top Spending Users */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-4">Top 5 Spending Users</h3>
        {data?.top_spending_users?.length === 0 ? (
          <p className="text-center text-gray-400 py-6 text-sm">No data</p>
        ) : (
          <div className="space-y-3">
            {data?.top_spending_users?.map((u, i) => (
              <div key={u.user_id} className="flex items-center gap-4">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-500" : "bg-indigo-400"
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800">{u.name}</span>
                    <span className="text-sm font-bold text-red-600">₹{Number(u.expense).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          (u.expense / (data.top_spending_users[0]?.expense || 1)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
