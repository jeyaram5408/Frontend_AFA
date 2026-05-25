import API from "./apiClient";

export const getAdminDashboard = () => API.get("/admin/dashboard");

export const getAdminUsers = (params) => API.get("/admin/users", { params });

export const getAdminUser = (id) => API.get(`/admin/users/${id}`);
export const getAdminStats = () => API.get("/admin/stats");
export const getAdminUserById = (id) => API.get(`/admin/users/${id}`);

export const updateAdminUserStatus = (id, data) =>
  API.patch(`/admin/users/${id}/status`, data);

export const updateAdminUserRole = (id, data) =>
  API.patch(`/admin/users/${id}/role`, data);

export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);

export const getAdminTransactions = (params) =>
  API.get("/admin/transactions", { params });
export const deleteAdminTransaction = (id) => API.delete(`/admin/transactions/${id}`);
 
export const getAdminAISuggestions = () => API.get("/admin/ai-suggestions");


export const getAdminAnalytics = () => API.get("/admin/analytics");

export const getAdminLogs = (limit = 50) => 
  API.get("/admin/logs", { params: { limit } });
export const uploadAdminMedia = (formData) =>
  API.post("/admin/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAdminMedia = (params = {}) =>
  API.get("/admin/media", { params });

export const updateAdminMediaStatus = (id, isActive) => {
  const formData = new FormData();
  formData.append("is_active", isActive);
  return API.patch(`/admin/media/${id}/status`, formData);
};

export const deleteAdminMedia = (id) => API.delete(`/admin/media/${id}`);