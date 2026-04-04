import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useNavigate } from "react-router-dom";

const COLORS = [
  "#4F46E5",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#6366F1",
  "#EC4899",
];

const ExpensePieChart = ({ data = [] }) => {
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md border min-h-50 flex flex-col items-center justify-center gap-4">
       <p  className="text-gray-800 text-base"> Expense Pie Chart</p>
        <p className="text-gray-400">No expense data available</p>

        {/* 🔥 ADD BUTTON */}
        <button
          onClick={() =>
            navigate("/dashboard/transactions", {
              state: { openExpense: true },
            })
          }
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          + Add Expense
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-white p-6 rounded-2xl shadow-md border h-105">
        {" "}
        <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90} // increase slightly but safe
              cx="50%"
              cy="45%"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹ ${Number(value).toLocaleString()}`}
            />
            <Legend verticalAlign="bottom" height={45} />{" "}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ExpensePieChart;
