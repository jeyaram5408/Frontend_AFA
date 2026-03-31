// import API from "../api/apiClient";

// // Stats
// export const getAdminStats = () => API.get("/admin/stats");

// // Users
// export const getAdminUsers = (params = {}) => API.get("/admin/users", { params });
// export const getAdminUserById = (id) => API.get(`/admin/users/${id}`);
// export const updateAdminUserStatus = (id, payload) => API.patch(`/admin/users/${id}/status`, payload);
// export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);
// export const updateAdminUserRole = (id, role) => API.patch(`/admin/update-role/${id}?role=${role}`);

// // Transactions
// export const getAdminTransactions = (params = {}) => API.get("/admin/transactions", { params });
// export const deleteAdminTransaction = (id) => API.delete(`/admin/transactions/${id}`);

// // Analytics
// export const getAdminAnalytics = () => API.get("/admin/analytics");

// // AI Suggestions
// export const getAdminAISuggestions = () => API.get("/admin/ai-suggestions");

// // Logs
// export const getAdminLogs = (limit = 50) => API.get(`/admin/logs?limit=${limit}`);

// // Categories
// export const getAdminCategories = () => API.get("/admin/categories");
// export const createAdminCategory = (payload) => API.post("/admin/categories", payload);
// export const updateAdminCategory = (id, payload) => API.patch(`/admin/categories/${id}`, payload);
// export const deleteAdminCategory = (id) => API.delete(`/admin/categories/${id}`);
