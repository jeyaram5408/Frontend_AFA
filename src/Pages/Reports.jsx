import React, { useEffect, useState } from "react";
import { getReportData } from "../api/reportApi";
import ExpenseForecast from "../components/ExpenseForecast";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import SmartRecommendations from "../components/SmartRecommendations";
const Reports = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filterMode, setFilterMode] = useState("range");
  const [report, setReport] = useState(null);
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    category: "",
    type: "",
  });
  useEffect(() => {
    const todayDate = new Date();

    if (filters.start_date && new Date(filters.start_date) > todayDate) {
      alert("Start date cannot be in future");
      return;
    }

    if (filters.end_date && new Date(filters.end_date) > todayDate) {
      alert("End date cannot be in future");
      return;
    }

    if (
      filters.start_date &&
      filters.end_date &&
      filters.start_date > filters.end_date
    ) {
      alert("Start date cannot be after End date");
      return;
    }

    const delay = setTimeout(() => {
      fetchReport();
    }, 400);

    return () => clearTimeout(delay);
  }, [filters]);
  useEffect(() => {
    const todayDate = new Date();
    const past = new Date();
    past.setMonth(todayDate.getMonth() - 6);

    setFilters({
      start_date: past.toISOString().split("T")[0],
      end_date: todayDate.toISOString().split("T")[0],
      category: "",
      type: "",
    });
  }, []);

  useEffect(() => {
    setFilters({
      start_date: "",
      end_date: "",
      category: "",
      type: "",
    });
  }, [filterMode]);
  const fetchReport = async () => {
    try {
      const res = await getReportData(filters);
      setReport(res.data);
    } catch (err) {
      console.error("Error fetching report", err);
    }
  };

  if (!report) return <p className="text-center mt-10">Loading...</p>;

  const summary = report?.summary || {};
  const chart = report?.chart || [];
  const noData = chart.length === 0;
  const chartHeight = noData ? 120 : 300;

  const forecast = report?.forecast || {};

  // ✅ SAFE SQRT SCALING
  const scaledChart = chart.map((item) => ({
    month: item.month,
    income: Math.sqrt(Math.max(item.income || 0, 1)),
    expense: Math.sqrt(Math.max(item.expense || 0, 1)),
    originalIncome: item.income || 0,
    originalExpense: item.expense || 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 sm:space-y-12 max-w-screen mx-auto px-3 sm:px-6 pb-24"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-800">
          Reports & Insights
        </h2>
        <p className="text-gray-500">Financial intelligence overview</p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6">
        <div className="bg-white p-3 sm:p-6 rounded-2xl sm:rounded-3xl shadow">
          <p className="text-xs sm:text-sm text-gray-500">Financial Score</p>
          <h3 className="text-xl sm:text-4xl font-bold text-indigo-600 mt-1 sm:mt-2">
            {summary.score || 0}%
          </h3>
        </div>

        <div className="bg-white p-3 sm:p-6 rounded-2xl sm:rounded-3xl shadow">
          <p className="text-xs sm:text-sm text-gray-500">Savings</p>
          <h3 className="text-xl sm:text-4xl font-bold text-green-600 mt-1 sm:mt-2">
            ₹{summary.savings?.toFixed(2) || "0.00"}
          </h3>
        </div>

        <div className="bg-white p-3 sm:p-6 rounded-2xl sm:rounded-3xl shadow">
          <p className="text-xs sm:text-sm text-gray-500">Expense Ratio</p>
          <h3 className="text-xl sm:text-4xl font-bold text-red-500 mt-1 sm:mt-2">
            {(summary.expense_ratio || 0).toFixed(1)}%
          </h3>
        </div>
      </div>
      {/* FILTER */}
      <div className="flex justify-between items-center relative">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
        >
          Filter ⚙️
        </button>
        <p className="text-xs text-gray-500">
          {filters.start_date && filters.end_date
            ? `Selected: ${filters.start_date} → ${filters.end_date}`
            : "No date selected"}
        </p>
        {showFilter && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setShowFilter(false)} // 👈 outside click = close
          >
            <div
              className="bg-white w-80 p-5 rounded-2xl shadow-xl space-y-3"
              onClick={(e) => e.stopPropagation()} // 👈 inside click = NOT close
            >
              {/* TOP BAR */}
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-gray-600">Filters</h4>

                <button
                  onClick={() => setShowFilter(false)}
                  className="text-red-500 text-sm"
                >
                  ✖
                </button>
              </div>

              {/* MODE */}
              <select
                className="border p-2 rounded w-full text-sm"
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
              >
                <option value="range">Date Range</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
                <option value="day">Day</option>
              </select>

              {/* RANGE */}
              {filterMode === "range" && (
                <div className="space-y-2">
                  <button
                    className="bg-purple-500 text-white px-2 py-1 rounded text-xs w-full"
                    onClick={() => {
                      const today = new Date();
                      const past = new Date();
                      past.setMonth(today.getMonth() - 6);

                      setFilters({
                        ...filters,
                        start_date: past.toISOString().split("T")[0],
                        end_date: today.toISOString().split("T")[0],
                      });
                    }}
                  >
                    Last 6 Months
                  </button>

                  <input
                    type="date"
                    max={today}
                    className="border p-1 rounded w-full text-sm"
                    onChange={(e) =>
                      setFilters({ ...filters, start_date: e.target.value })
                    }
                  />

                  <input
                    type="date"
                    max={today}
                    className="border p-1 rounded w-full text-sm"
                    onChange={(e) =>
                      setFilters({ ...filters, end_date: e.target.value })
                    }
                  />

                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs w-full"
                    onClick={() => {
                      const today = new Date();
                      const past = new Date();
                      past.setDate(today.getDate() - 7);

                      setFilters({
                        ...filters,
                        start_date: past.toISOString().split("T")[0],
                        end_date: today.toISOString().split("T")[0],
                      });
                    }}
                  >
                    Last 7 Days
                  </button>
                </div>
              )}
              {/* MONTH */}
              {filterMode === "month" && (
                <div className="space-y-2">
                  <input
                    type="month"
                    max={today}
                    className="border p-2 rounded w-full text-sm"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!value) return;

                      const [year, month] = value.split("-");
                      const start = new Date(year, month - 1, 1);
                      const end = new Date(year, month, 0);

                      setFilters({
                        ...filters,
                        start_date: start.toISOString().split("T")[0],
                        end_date: end.toISOString().split("T")[0],
                      });
                    }}
                  />
                </div>
              )}

              {/* YEAR */}
              {filterMode === "year" && (
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Enter Year (e.g. 2026)"
                    className="border p-2 rounded w-full text-sm"
                    onChange={(e) => {
                      const year = e.target.value;
                      if (!year) return;

                      setFilters({
                        ...filters,
                        start_date: `${year}-01-01`,
                        end_date: `${year}-12-31`,
                      });
                    }}
                  />
                </div>
              )}

              {/* DAY */}
              {filterMode === "day" && (
                <div className="space-y-2">
                  <input
                    type="date"
                    max={today}
                    className="border p-2 rounded w-full text-sm"
                    onChange={(e) => {
                      const selected = e.target.value;

                      setFilters({
                        ...filters,
                        start_date: selected,
                        end_date: selected,
                      });
                    }}
                  />
                </div>
              )}
              {/* CATEGORY */}
              <select
                className="border p-2 rounded w-full text-sm"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Salary">Salary</option>
              </select>

              {/* TYPE */}
              <select
                value={filters.type}
                className="border p-2 rounded w-full text-sm"
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* FILTER DROPDOWN */}

      {/* 📊 SPLIT CHART */}
      <div className="bg-white p-6 rounded-3xl shadow">
        <h3 className="text-lg font-semibold mb-4">Income vs Expense</h3>

        {noData && (
          <div className="text-center mt-8 space-y-4">
            <p className="text-gray-400 text-sm">
              🚫 No data available for selected filters
            </p>

            <button
              onClick={() => navigate("/dashboard/transactions")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
            >
              ➕ Add Expense
            </button>
          </div>
        )}
        <ResponsiveContainer width="100%" height={chartHeight}>
          {" "}
          <BarChart data={scaledChart} barCategoryGap="30%">
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280" }}
            />

            <YAxis hide />

            <Tooltip
              cursor={{ fill: "transparent" }}
              formatter={(value, name, props) => {
                if (name === "income") {
                  return [`₹${props.payload.originalIncome}`, "Income"];
                }
                return [`₹${props.payload.originalExpense}`, "Expense"];
              }}
            />

            <Legend />

            {/* INCOME */}
            <Bar
              dataKey="income"
              fill="#4F46E5"
              radius={[20, 20, 0, 0]}
              barSize={30}
              minPointSize={5}
            />

            {/* EXPENSE */}
            <Bar
              dataKey="expense"
              fill="#EF4444"
              radius={[20, 20, 0, 0]}
              barSize={30}
              minPointSize={5}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FORECAST + DONUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* DONUT */}
        <div className="bg-white p-6 rounded-3xl shadow text-center">
          <h3 className="text-lg font-semibold mb-4">Savings Rate</h3>

          <div className="relative w-full h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="75%"
                outerRadius="100%"
                data={[{ value: summary.savings_rate || 0 }]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: "#E5E7EB" }}
                  dataKey="value"
                  fill="#4F46E5"
                />
              </RadialBarChart>
            </ResponsiveContainer>

            <div className="absolute text-center">
              <h2 className="text-4xl font-bold">
                {(summary.savings_rate || 0).toFixed(0)}%
              </h2>
            </div>
          </div>
        </div>

        {/* FORECAST */}
        <ExpenseForecast forecast={forecast} />

        {/* AI */}
        <div className="bg-white p-6 rounded-3xl shadow flex flex-col justify-between h-full">
          <h3 className="text-lg font-semibold mb-4">AI Insights</h3>

          <div className="flex-1">
            <SmartRecommendations compact={true} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;
