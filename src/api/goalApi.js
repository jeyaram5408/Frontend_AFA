import API from "./apiClient";

// ✅ Get all goals
export const getGoals = async () => {
  const res = await API.get("/goals");
  return res.data;
};

// ✅ Create new goal
export const createGoal = async (payload) => {
  const res = await API.post("/goals", payload);
  return res.data;
};

// ✅ Update goal
export const updateGoal = async (goalId, payload) => {
  const res = await API.put(`/goals/${goalId}`, payload);
  return res.data;
};

// ✅ Delete goal
export const deleteGoal = async (goalId) => {
  const res = await API.delete(`/goals/${goalId}`);
  return res.data;
};

// ✅ Add contribution to a goal
export const addGoalContribution = async (goalId, payload) => {
  const res = await API.post(`/goals/${goalId}/contribute`, payload);
  return res.data;
};

// ✅ Get all contributions for a goal
export const getGoalContributions = async (goalId) => {
  const res = await API.get(`/goals/${goalId}/contributions`);
  return res.data;
};

// ✅ Mark goal as completed manually
export const completeGoal = async (goalId) => {
  const res = await API.patch(`/goals/${goalId}/complete`);
  return res.data;
};