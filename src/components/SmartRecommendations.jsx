import React, { useState } from "react";
import API from "../api/apiClient";

const P = {
  high: {
    pill: "bg-rose-100 text-rose-500 border border-rose-200",
    bar: "bg-rose-500",
    width: "90%",
    label: "HIGH",
  },
  medium: {
    pill: "bg-amber-100 text-amber-500 border border-amber-200",
    bar: "bg-amber-500",
    width: "60%",
    label: "MED",
  },
  low: {
    pill: "bg-teal-100 text-teal-600 border border-teal-200",
    bar: "bg-teal-500",
    width: "30%",
    label: "LOW",
  },
};

function HealthRing({ score, label }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? "#14b8a6" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="7"
        />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
        />
        <text
          x="48"
          y="44"
          textAnchor="middle"
          fill={color}
          fontSize="18"
          fontWeight="800"
        >
          {score}
        </text>
        <text x="48" y="60" textAnchor="middle" fill="#6b7280" fontSize="9">
          /100
        </text>
      </svg>
      <span className="text-xs font-semibold" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
      <p className="text-[10px] text-gray-500 uppercase mb-1">{label}</p>
      <p className="font-bold text-base" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
        <div className="flex gap-5 items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200" />
          <div className="flex-1 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse"
        >
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-4/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SmartRecommendations({ compact = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/suggestions/");
      setData(res.data);
      setFetched(true);
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  if (!fetched && !loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-teal-100 border border-teal-200 flex items-center justify-center text-2xl mx-auto">
          ✦
        </div>

        <div>
          <h2 className="text-gray-800 font-bold text-lg">
            AI Smart Budget Analysis
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Analyzes your transactions and gives smart ₹ savings tips
          </p>
        </div>

        <button
          onClick={fetchSuggestions}
          className="bg-linear-to-r from-teal-500 to-teal-600 text-white px-8 py-2.5 rounded-xl font-semibold text-sm hover:shadow-md bg-teal-900 cursor-pointer transition"
        >
          ✦ Analyze My Finances
        </button>
      </div>
    );
  }

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-6 text-center space-y-3 shadow-sm">
        <p className="text-red-500 text-sm">⚠️ {error}</p>
        <button
          onClick={fetchSuggestions}
          className="text-teal-500 underline text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  // ✅ COMPACT VIEW (for Reports page)
  if (compact && data) {
    return (
      <div className="bg-white border  border-gray-200 rounded-xl p-4 space-y-2 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700">🤖 AI Insights</h3>

        <p className="text-xs text-gray-500">
          {data.summary || "No insights available"}
        </p>

        {data.suggestions?.slice(0, 2).map((s, i) => (
          <p key={i} className="text-xs text-gray-600">
            • {s.title}
          </p>
        ))}
      </div>
    );
  }

  const {
    summary,
    suggestions = [],
    savings_rate,
    health_score,
    health_label,
    budget_50_30_20,
  } = data;

  const rateColor =
    savings_rate >= 20 ? "#14b8a6" : savings_rate >= 10 ? "#f59e0b" : "#ef4444";

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-5 flex-wrap">
          <HealthRing score={health_score} label={health_label} />

          <div className="flex-1 grid grid-cols-3 gap-3">
            <StatPill
              label="Savings Rate"
              value={`${savings_rate}%`}
              color={rateColor}
            />
            <StatPill
              label="Needs (50%)"
              value={fmt(budget_50_30_20?.needs)}
              color="#6366f1"
            />
            <StatPill
              label="Save Goal"
              value={fmt(budget_50_30_20?.savings)}
              color="#14b8a6"
            />
          </div>
        </div>
      </div>

      {summary && (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
          <div className="flex gap-3">
            <span className="text-teal-500 text-lg">✦</span>
            <p className="text-sm text-gray-600">{summary}</p>
          </div>
        </div>
      )}

      {suggestions.map((s, i) => {
        const style = P[s.priority] || P.low;

        return (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl">
                {s.icon || "💡"}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-bold text-gray-800">{s.title}</p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${style.pill}`}
                  >
                    {style.label}
                  </span>
                </div>

                <p className="text-xs text-gray-500">{s.detail}</p>

                {s.monthly_savings_potential > 0 && (
                  <p className="text-xs text-teal-600 mt-2 font-semibold">
                    💰 Save up to {fmt(s.monthly_savings_potential)}/month
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 h-0.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`${style.bar} h-full`}
                style={{ width: style.width }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
