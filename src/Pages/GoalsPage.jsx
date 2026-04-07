import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addGoalContribution,
  getGoalContributions,
  completeGoal,
} from "../api/goalApi";
import { MoreVertical } from "lucide-react";
const initialGoalForm = {
  name: "",
  target_amount: "",
  duration_days: 30,
};

const initialContributionForm = {
  amount: "",
  frequency_type: "manual",
  note: "",
};

const GoalsPage = () => {
  const [goalsData, setGoalsData] = useState({
    all: [],
    in_progress: [],
    completed: [],
    overdue: [],
    cancelled: [],
    summary: {},
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("in_progress");

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  // const [menuOpen, setMenuOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalForm, setGoalForm] = useState(initialGoalForm);
  const [contributionForm, setContributionForm] = useState(
    initialContributionForm,
  );

  const [historyLoading, setHistoryLoading] = useState(false);
  const [contributions, setContributions] = useState([]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await getGoals();
      setGoalsData(
        res || {
          all: [],
          in_progress: [],
          completed: [],
          overdue: [],
          cancelled: [],
          summary: {},
        },
      );
    } catch (err) {
      console.error("Goals fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const currentGoals = useMemo(() => {
    return goalsData?.[activeTab] || [];
  }, [goalsData, activeTab]);

  const openCreateGoalModal = () => {
    setSelectedGoal(null);
    setGoalForm(initialGoalForm);
    setShowGoalModal(true);
  };

  const openEditGoalModal = (goal) => {
    setSelectedGoal(goal);
    setGoalForm({
      name: goal.name || "",
      target_amount: goal.target_amount || "",
      duration_days: goal.duration_days || 30,
    });
    setShowGoalModal(true);
  };

  const closeGoalModal = () => {
    setShowGoalModal(false);
    setSelectedGoal(null);
    setGoalForm(initialGoalForm);
  };

  const handleSaveGoal = async () => {
    if (!goalForm.name || !goalForm.target_amount || !goalForm.duration_days) {
      return;
    }

    const payload = {
      name: goalForm.name.trim(),
      target_amount: Number(goalForm.target_amount),
      duration_days: Number(goalForm.duration_days),
    };

    try {
      if (selectedGoal?.id) {
        await updateGoal(selectedGoal.id, payload);
      } else {
        await createGoal(payload);
      }

      closeGoalModal();
      fetchGoals();
    } catch (err) {
      console.error("Save goal error:", err);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this goal?",
    );
    if (!confirmed) return;

    try {
      await deleteGoal(goalId);
      fetchGoals();
    } catch (err) {
      console.error("Delete goal error:", err);
    }
  };

  const openContributionModal = (goal) => {
    setSelectedGoal(goal);
    setContributionForm(initialContributionForm);
    setShowContributionModal(true);
  };

  const closeContributionModal = () => {
    setSelectedGoal(null);
    setContributionForm(initialContributionForm);
    setShowContributionModal(false);
  };

  const handleAddContribution = async () => {
    if (!selectedGoal?.id || !contributionForm.amount) return;

    try {
      await addGoalContribution(selectedGoal.id, {
        amount: Number(contributionForm.amount),
        frequency_type: contributionForm.frequency_type,
        note: contributionForm.note,
      });

      closeContributionModal();
      fetchGoals();
    } catch (err) {
      console.error("Add contribution error:", err);
    }
  };

  const openHistoryModal = async (goal) => {
    try {
      setSelectedGoal(goal);
      setShowHistoryModal(true);
      setHistoryLoading(true);

      const res = await getGoalContributions(goal.id);
      setContributions(res?.contributions || []);
    } catch (err) {
      console.error("Contribution history error:", err);
      setContributions([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedGoal(null);
    setContributions([]);
  };

  const handleCompleteGoal = async (goalId) => {
    const ok = window.confirm("Mark this goal as completed?");
    if (!ok) return;

    try {
      await completeGoal(goalId);
      fetchGoals();
    } catch (err) {
      console.error("Complete goal error:", err);
    }
  };

  const summary = goalsData?.summary || {};

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
            Savings Goals
          </h2>
          <br />
          <p className="text-base text-gray-500 mt-1">
            Track goals like Laptop, Mobile, Bike, Vacation separately instead
            of mixing them with your regular expenses.
          </p>
        </div>

        <button
          onClick={openCreateGoalModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Goal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-4">
        <StatCard
          title="Active Goals"
          value={summary?.active_goals_count || 0}
          color="indigo"
        />
        <StatCard
          title="Completed Goals"
          value={summary?.completed_goals_count || 0}
          color="green"
        />
        <StatCard
          title="Total Target"
          value={`₹${Number(summary?.total_target_amount || 0).toLocaleString()}`}
          color="yellow"
        />
        <StatCard
          title="Total Saved"
          value={`₹${Number(summary?.total_saved_amount || 0).toLocaleString()}`}
          color="purple"
        />
      </div>

      {/* Nearest Goal */}
      {summary?.nearest_goal && (
        <div className="bg-white border border-indigo-100 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                Nearest Deadline Goal
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mt-1">
                {summary.nearest_goal.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                ₹
                {Number(
                  summary.nearest_goal.saved_amount || 0,
                ).toLocaleString()}{" "}
                / ₹
                {Number(
                  summary.nearest_goal.target_amount || 0,
                ).toLocaleString()}
              </p>
            </div>

            <div className="min-w-55">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{Math.round(summary.nearest_goal.progress || 0)}%</span>
                <span>
                  {summary.nearest_goal.remaining_days || 0} days left
                </span>
              </div>

              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(summary.nearest_goal.progress || 0, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <TabButton
          active={activeTab === "in_progress"}
          onClick={() => setActiveTab("in_progress")}
          label={`In Progress (${goalsData?.in_progress?.length || 0})`}
        />
        <TabButton
          active={activeTab === "completed"}
          onClick={() => setActiveTab("completed")}
          label={`Completed (${goalsData?.completed?.length || 0})`}
        />
        <TabButton
          active={activeTab === "overdue"}
          onClick={() => setActiveTab("overdue")}
          label={`Overdue (${goalsData?.overdue?.length || 0})`}
        />
        <TabButton
          active={activeTab === "cancelled"}
          onClick={() => setActiveTab("cancelled")}
          label={`Cancelled (${goalsData?.cancelled?.length || 0})`}
        />
      </div>

      {/* Goals Content */}
      {loading ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
          <p className="text-sm text-gray-500">Loading goals...</p>
        </div>
      ) : currentGoals.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            {activeTab === "in_progress"
              ? "No active goals yet."
              : `No ${activeTab.replace("_", " ")} goals.`}
          </p>

          {activeTab === "in_progress" && (
            <button
              onClick={openCreateGoalModal}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Create First Goal
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {currentGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => openEditGoalModal(goal)}
              onDelete={() => handleDeleteGoal(goal.id)}
              onAddMoney={() => openContributionModal(goal)}
              onViewHistory={() => openHistoryModal(goal)}
              onComplete={() => handleCompleteGoal(goal.id)}
            />
          ))}
        </div>
      )}

      {/* Goal Modal */}
      {showGoalModal && (
        <Modal
          title={selectedGoal ? "Edit Goal" : "Create Goal"}
          onClose={closeGoalModal}
        >
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Goal name (Laptop / Mobile)"
              value={goalForm.name}
              onChange={(e) =>
                setGoalForm({ ...goalForm, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="number"
              placeholder="Target amount"
              value={goalForm.target_amount}
              onChange={(e) =>
                setGoalForm({ ...goalForm, target_amount: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <select
              value={goalForm.duration_days}
              onChange={(e) =>
                setGoalForm({
                  ...goalForm,
                  duration_days: Number(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value={30}>1 Month</option>
              <option value={60}>2 Months</option>
              <option value={90}>3 Months</option>
              <option value={180}>6 Months</option>
              <option value={365}>1 Year</option>
            </select>

            <button
              onClick={handleSaveGoal}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium"
            >
              {selectedGoal ? "Update Goal" : "Create Goal"}
            </button>
          </div>
        </Modal>
      )}

      {/* Contribution Modal */}
      {showContributionModal && (
        <Modal
          title={`Add Contribution - ${selectedGoal?.name || ""}`}
          onClose={closeContributionModal}
        >
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Amount"
              value={contributionForm.amount}
              onChange={(e) =>
                setContributionForm({
                  ...contributionForm,
                  amount: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400"
            />

            <select
              value={contributionForm.frequency_type}
              onChange={(e) =>
                setContributionForm({
                  ...contributionForm,
                  frequency_type: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="manual">Manual</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>

            <input
              type="text"
              placeholder="Note (optional)"
              value={contributionForm.note}
              onChange={(e) =>
                setContributionForm({
                  ...contributionForm,
                  note: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400"
            />

            <button
              onClick={handleAddContribution}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium"
            >
              Add Contribution
            </button>
          </div>
        </Modal>
      )}

      {/* Contribution History Modal */}
      {showHistoryModal && (
        <Modal
          title={`Contribution History - ${selectedGoal?.name || ""}`}
          onClose={closeHistoryModal}
        >
          {historyLoading ? (
            <p className="text-sm text-gray-500">Loading contributions...</p>
          ) : contributions.length === 0 ? (
            <p className="text-sm text-gray-500">No contributions yet.</p>
          ) : (
            <div className="space-y-3 max-h-full overflow-y-auto pr-1">
              {contributions.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-100 rounded-xl p-3 bg-gray-50"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-semibold text-gray-800">
                        ₹{Number(item.amount || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        {item.frequency_type || "manual"} contribution
                      </p>
                      {item.note && (
                        <p className="text-sm text-gray-600 mt-1">
                          {item.note}
                        </p>
                      )}
                    </div>

                    <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-full text-gray-600">
                      {formatDate(item.contribution_date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default GoalsPage;

/* ----------------------- Components ----------------------- */

function StatCard({ title, value, color = "indigo" }) {
  const colorMap = {
    indigo: "from-indigo-50 to-indigo-100 text-indigo-700",
    green: "from-green-50 to-green-100 text-green-700",
    yellow: "from-yellow-50 to-yellow-100 text-yellow-700",
    purple: "from-purple-50 to-purple-100 text-purple-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div
        className={`rounded-xl px-3 py-2 bg-linear-to-r ${
          colorMap[color] || colorMap.indigo
        }`}
      >
        <p className="text-xs font-medium">{title}</p>
        <h3 className="text-lg font-bold mt-1">{value}</h3>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

function GoalCard({
  goal,
  onEdit,
  onDelete,
  onAddMoney,
  onViewHistory,
  onComplete,
}) {
  const progress = Math.min(Number(goal.progress || 0), 100);
  const menuRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const badgeClasses =
    goal.status === "completed"
      ? "bg-green-100 text-green-700"
      : goal.status === "overdue"
        ? "bg-red-100 text-red-700"
        : goal.status === "cancelled"
          ? "bg-gray-100 text-gray-700"
          : "bg-indigo-100 text-indigo-700";

  const progressBarColor =
    goal.status === "completed"
      ? "bg-green-500"
      : goal.status === "overdue"
        ? "bg-red-500"
        : "bg-indigo-600";

  return (
    <div
      ref={menuRef}
      className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-gray-100 
  shadow-sm transition-all duration-300 
  hover:scale-105 hover:-translate-y-2 hover:shadow-xl"
    >
      {" "}
      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{goal.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            ₹{Number(goal.saved_amount || 0).toLocaleString()} / ₹
            {Number(goal.target_amount || 0).toLocaleString()}
          </p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${badgeClasses}`}
        >
          {goal.status?.replace("_", " ")}
        </span>
      </div>
      {/* Progress */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{Math.round(progress)}%</span>
          <span>{goal.remaining_days || 0} days left</span>
        </div>

        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${progressBarColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <InfoBox
          label="Remaining"
          value={`₹${Number(goal.remaining_amount || 0).toLocaleString()}`}
        />
        <InfoBox
          label="Daily Target"
          value={`₹${Number(goal.daily_target || 0).toLocaleString()}`}
        />
        <InfoBox
          label="Monthly Target"
          value={`₹${Number(goal.monthly_target || 0).toLocaleString()}`}
        />
        <InfoBox label="Duration" value={`${goal.duration_days || 0} days`} />
      </div>
      {/* Actions */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation(); //
            setMenuOpen(!menuOpen);
          }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <MoreVertical size={18} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
            {goal.status !== "completed" && goal.status !== "cancelled" && (
              <button
                onClick={() => {
                  onAddMoney();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                + Add Money
              </button>
            )}

            <button
              onClick={() => {
                onViewHistory();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              History
            </button>

            <button
              onClick={() => {
                onEdit();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              Edit
            </button>

            {goal.status !== "completed" && goal.status !== "cancelled" && (
              <button
                onClick={() => {
                  onComplete();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-indigo-600"
              >
                Complete
              </button>
            )}

            <button
              onClick={() => {
                onDelete();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-red-100 text-sm text-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ✖
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
