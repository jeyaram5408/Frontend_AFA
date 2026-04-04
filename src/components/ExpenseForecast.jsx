import React from "react";
import { FaChartLine, FaCalendarAlt, FaCoins } from "react-icons/fa";

const ExpenseForecast = ({ forecast }) => {
  const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <FaChartLine className="text-indigo-600 text-lg" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          Expense Forecast
        </h3>
      </div>

      {/* Content */}
      <div className="space-y-4 flex-1">
        
        {/* Monthly Avg */}
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FaCoins className="text-indigo-500" />
            Monthly Avg
          </div>
          <span className="font-semibold text-gray-800">
            {fmt(forecast?.monthly_avg)}
          </span>
        </div>

        {/* Next Month */}
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FaCalendarAlt className="text-indigo-500" />
            Next Month
          </div>
          <span className="font-semibold text-gray-800">
            {fmt(forecast?.next_month)}
          </span>
        </div>

        {/* 6 Month */}
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FaChartLine className="text-indigo-500" />
            6 Month Forecast
          </div>
          <span className="font-semibold text-gray-800">
            {fmt(forecast?.six_month)}
          </span>
        </div>

      </div>

      {/* Bottom Hint */}
      {/* <p className="text-xs text-gray-400 mt-4">
        Based on your past spending trends 📊
      </p> */}
    </div>
  );
};

export default ExpenseForecast;