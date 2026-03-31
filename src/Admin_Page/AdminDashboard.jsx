import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAdminStats } from "../api/adminApi";
import {
  FaUsers, FaUserCheck, FaUserSlash,
  FaExchangeAlt, FaArrowUp, FaArrowDown
} from "react-icons/fa";

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    { title: "Total Users", value: stats?.total_users || 0, icon: <FaUsers />, color: "bg-indigo-500", delay: 0 },
    { title: "Active Users", value: stats?.active_users || 0, icon: <FaUserCheck />, color: "bg-green-500", delay: 0.05 },
    { title: "Blocked Users", value: stats?.blocked_users || 0, icon: <FaUserSlash />, color: "bg-red-500", delay: 0.1 },
    { title: "Transactions", value: stats?.total_transactions || 0, icon: <FaExchangeAlt />, color: "bg-purple-500", delay: 0.15 },
    { title: "Total Income", value: `₹${Number(stats?.total_income || 0).toLocaleString()}`, icon: <FaArrowUp />, color: "bg-emerald-500", delay: 0.2 },
    { title: "Total Expense", value: `₹${Number(stats?.total_expense || 0).toLocaleString()}`, icon: <FaArrowDown />, color: "bg-orange-500", delay: 0.25 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Platform statistics at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white"
      >
        <h3 className="font-semibold text-lg">Platform Health</h3>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-indigo-200 text-xs">Net Balance</p>
            <p className="text-xl font-bold mt-1">
              ₹{Number((stats?.total_income || 0) - (stats?.total_expense || 0)).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Active Rate</p>
            <p className="text-xl font-bold mt-1">
              {stats?.total_users > 0
                ? Math.round((stats.active_users / stats.total_users) * 100)
                : 0}%
            </p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Avg Transactions</p>
            <p className="text-xl font-bold mt-1">
              {stats?.total_users > 0
                ? Math.round(stats.total_transactions / stats.total_users)
                : 0}
            </p>
          </div>
          <div>
            <p className="text-indigo-200 text-xs">Blocked Rate</p>
            <p className="text-xl font-bold mt-1">
              {stats?.total_users > 0
                ? Math.round((stats.blocked_users / stats.total_users) * 100)
                : 0}%
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
