import API from "./apiClient";

// GET ALL
export const getGoals = async () => {
  const res = await API.get("/goals/");
  return res.data;
};

// CREATE
export const createGoal = async (payload) => {
  const res = await API.post("/goals/", payload);
  return res.data;
};

// UPDATE
export const updateGoal = async (goalId, payload) => {
  const res = await API.put(`/goals/${goalId}`, payload);
  return res.data;
};

// DELETE
export const deleteGoal = async (goalId) => {
  const res = await API.delete(`/goals/${goalId}`);
  return res.data;
};

// ADD CONTRIBUTION
export const addGoalContribution = async (goalId, payload) => {
  const res = await API.post(`/goals/${goalId}/contribute`, payload);
  return res.data;
};

// GET CONTRIBUTIONS
export const getGoalContributions = async (goalId) => {
  const res = await API.get(`/goals/${goalId}/contributions`);
  return res.data;
};

// COMPLETE
export const completeGoal = async (goalId) => {
  const res = await API.patch(`/goals/${goalId}/complete`);
  return res.data;
};