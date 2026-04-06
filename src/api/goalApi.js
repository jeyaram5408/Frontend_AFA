import API from "./apiClient";

export const getGoals = async () => {
  const res = await API.get("/goals/");
  return res.data;
};

export const createGoal = async (payload) => {
  const res = await API.post("/goals/", payload);
  return res.data;
};

export const updateGoal = async (goalId, payload) => {
  const res = await API.put(`/goals/${goalId}`, payload);
  return res.data;
};

export const deleteGoal = async (goalId) => {
  const res = await API.delete(`/goals/${goalId}`);
  return res.data;
};

export const addGoalContribution = async (goalId, payload) => {
  const res = await API.post(`/goals/${goalId}/contribute`, payload);
  return res.data;
};

export const getGoalContributions = async (goalId) => {
  const res = await API.get(`/goals/${goalId}/contributions`);
  return res.data;
};

export const completeGoal = async (goalId) => {
  const res = await API.patch(`/goals/${goalId}/complete`);
  return res.data;
};