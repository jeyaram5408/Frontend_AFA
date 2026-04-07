import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGoals } from "../api/goalApi";

const BudgetGoal = () => {
  const navigate = useNavigate();

  const [goalsData, setGoalsData] = useState({
    in_progress: [],
    completed: [],
    summary: {},
  });

  const [loading, setLoading] = useState(true);
  const [showAllGoals, setShowAllGoals] = useState(false);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await getGoals();
      setGoalsData(res || {});
    } catch (err) {
      console.error("Goals fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const activeGoals = goalsData?.in_progress || [];
  const summary = goalsData?.summary || {};
  const nearestGoal = summary?.nearest_goal;

  return (
    <>
      {/* MAIN CARD */}
      <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-md border border-gray-100 w-full transition-all duration-300 hover:shadow-xl">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800 text-lg">
            Savings Goals
          </h2>

          {/* 👉 Now opens modal instead of navigation */}
          <button
            onClick={() => setShowAllGoals(true)}
            className="text-sm text-indigo-600 hover:underline"
          >
            View All
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading goals...</p>
        ) : activeGoals.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">No active goals yet</p>

            <button
              onClick={() => navigate("/dashboard/goals")}
              className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              + Create Goal
            </button>
          </div>
        ) : (
          <>
            {/* SUMMARY */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-indigo-50 p-3 rounded-xl shadow-sm">
                <p className="text-xs text-indigo-500">Active Goals</p>
                <p className="font-semibold text-gray-800 text-lg">
                  {summary?.active_goals_count || 0}
                </p>
              </div>

              <div className="bg-green-50 p-3 rounded-xl shadow-sm">
                <p className="text-xs text-green-500">Total Saved</p>
                <p className="font-semibold text-gray-800 text-lg">
                  ₹{Number(summary?.total_saved_amount || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* NEAREST GOAL */}
            {nearestGoal && (
              <div className="mb-4 rounded-xl bg-indigo-100 p-4 shadow-sm">
                <p className="text-xs text-indigo-600 font-medium">
                  Nearest Goal
                </p>

                <p className="font-semibold text-gray-800 mt-1">
                  {nearestGoal.name}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  ₹{Number(nearestGoal.saved_amount || 0).toLocaleString()} / ₹
                  {Number(nearestGoal.target_amount || 0).toLocaleString()}
                </p>

                <div className="mt-3 w-full bg-white h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(nearestGoal.progress || 0, 100)}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  {nearestGoal.remaining_days || 0} days left
                </p>
              </div>
            )}

            {/* ONLY 1 GOAL */}
            <div className="space-y-3">
              {activeGoals.slice(0, 1).map((goal) => (
                <div
                  key={goal.id}
                  className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">
                        {goal.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{Number(goal.saved_amount).toLocaleString()} / ₹
                        {Number(goal.target_amount).toLocaleString()}
                      </p>
                    </div>

                    <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                      {Math.round(goal.progress)}%
                    </span>
                  </div>

                  <div className="mt-3 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(goal.progress || 0, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* MANAGE BUTTON */}
            <button
              onClick={() => navigate("/dashboard/goals")}
              className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-medium transition"
            >
              Manage Goals
            </button>
          </>
        )}
      </div>

      {/* ✅ MODAL */}
      {showAllGoals && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAllGoals(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg p-5 shadow-xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">All Goals</h3>

              <button
                onClick={() => setShowAllGoals(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>
            </div>

            <div className="space-y-3">
              {activeGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="border rounded-xl p-4 bg-gray-50"
                >
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">
                      {goal.name}
                    </p>

                    <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                      {Math.round(goal.progress)}%
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    ₹{Number(goal.saved_amount).toLocaleString()} / ₹
                    {Number(goal.target_amount).toLocaleString()}
                  </p>

                  <div className="mt-2 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(goal.progress || 0, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BudgetGoal;