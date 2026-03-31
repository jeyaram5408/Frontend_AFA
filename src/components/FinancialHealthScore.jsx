import React from "react";
import {
  FaRobot,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const FinancialHealthScore = ({
  score = 0,
  label = "Fair",
  summary = "",
  actions = [],
  adjustmentReason = "",
  aiAdjustment = 0,
}) => {
  const safeScore = Math.min(Number(score || 0), 100);

  const scoreColor =
    safeScore >= 70
      ? "bg-green-500"
      : safeScore >= 40
      ? "bg-yellow-500"
      : "bg-red-500";

  const labelStyle =
    safeScore >= 70
      ? "bg-green-100 text-green-700 border border-green-200"
      : safeScore >= 40
      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
      : "bg-red-100 text-red-700 border border-red-200";

  const adjustmentStyle =
    Number(aiAdjustment) >= 0
      ? "bg-green-100 text-green-700 border border-green-200"
      : "bg-red-100 text-red-700 border border-red-200";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Section - Score */}
        <div className="flex flex-col gap-10">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Financial Health Score
              </h3>

              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${labelStyle}`}
              >
                {label}
              </span>
            </div>

            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-indigo-600">
                {safeScore}
              </span>
              <span className="text-lg text-gray-400 mb-1">/ 100</span>
            </div>

            <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${scoreColor}`}
                style={{ width: `${safeScore}%` }}
              />
            </div>

            <p className="mt-3  text-lg text-gray-500 leading-6">
              This score reflects your savings pattern, expense control, and
              financial behavior.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
              <p className="text-sm text-gray-500 mb-1">Score Status</p>
              <p className="text-sm font-semibold text-gray-800">{label}</p>
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
              <p className="text-sm text-gray-500 mb-1">AI Adjustment</p>
              <div className="flex items-center gap-2">
                {Number(aiAdjustment) >= 0 ? (
                  <FaArrowUp className="text-green-500 text-xs" />
                ) : (
                  <FaArrowDown className="text-red-500 text-xs" />
                )}
                <p
                  className={`text-sm font-semibold ${
                    Number(aiAdjustment) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {Number(aiAdjustment) >= 0
                    ? `+${aiAdjustment}`
                    : aiAdjustment}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - AI Suggestion Bar */}
        <div className="rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50 via-white to-purple-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                <FaRobot />
              </div>

              <div>
                <h4 className="text-base font-semibold text-gray-800">
                  AI Suggestion Bar
                </h4>
                <p className="text-sm text-gray-500">
                  Personalized advice based on your financial data
                </p>
              </div>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${adjustmentStyle}`}
            >
              {Number(aiAdjustment) >= 0 ? `+${aiAdjustment}` : aiAdjustment} AI
              Impact
            </span>
          </div>

          <div className="mt-4 rounded-xl bg-white border border-indigo-100 px-4 py-3 shadow-sm">
            <p className="text-sm text-gray-700 leading-6">
              {summary || "No AI suggestions available right now."}
            </p>
          </div>

          {adjustmentReason && (
            <div className="mt-3 rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-2">
              <p className="text-xs text-indigo-700 font-medium">
                {adjustmentReason}
              </p>
            </div>
          )}

          {actions?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-800 mb-3">
                Suggested Actions
              </p>

              <div className="space-y-2">
                {actions.slice(0, 3).map((action, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 bg-white border border-gray-100 rounded-xl px-3 py-3"
                  >
                    <FaCheckCircle className="text-green-500 mt-1 text-sm shrink-0" />
                    <p className="text-sm text-gray-700 leading-5">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthScore;
