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
    <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-md border border-gray-100 w-full transition-all duration-300 hover:shadow-xl">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800 text-lg">
           Savings Goals
        </h2>
        <button
          onClick={() => navigate("/dashboard/goals")}
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
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-indigo-50 p-3 rounded-xl shadow-sm hover:shadow-md transition">
              <p className="text-xs text-indigo-500">Active Goals</p>
              <p className="font-semibold text-gray-800 text-lg">
                {summary?.active_goals_count || 0}
              </p>
            </div>

            <div className="bg-green-50 p-3 rounded-xl shadow-sm hover:shadow-md transition">
              <p className="text-xs text-green-500">Total Saved</p>
              <p className="font-semibold text-gray-800 text-lg">
                ₹{Number(summary?.total_saved_amount || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* NEAREST GOAL */}
          {nearestGoal && (
            <div className="mb-4 rounded-xl bg-indigo-100 p-4 shadow-sm hover:shadow-md transition">
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

              {/* PROGRESS BAR */}
              <div className="mt-3 w-full bg-white h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-700"
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

          {/* GOALS LIST */}
          <div className="space-y-3">
            {activeGoals.slice(0, 2).map((goal) => (
              <div
                key={goal.id}
                className="bg-white border rounded-xl p-4 shadow-sm 
                transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg"
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

                {/* PROGRESS */}
                <div className="mt-3 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(goal.progress || 0, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <button
            onClick={() => navigate("/dashboard/goals")}
            className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-medium transition"
          >
            Manage Goals
          </button>
        </>
      )}
    </div>
  );
};

export default BudgetGoal;