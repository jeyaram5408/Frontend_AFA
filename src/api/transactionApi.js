import API from "./apiClient";

export const getTransactions = () => API.get("/transactions/");
export const createTransaction = (data) => API.post("/transactions/", data);
export const updateTransactionApi = (id, data) => API.patch(`/transactions/${id}`, data);
export const deleteTransactionApi = (id) => API.delete(`/transactions/${id}`);
export const getTransactionsPaginated = (page, limit, filter) =>
  API.get(`/transactions/paginated?page=${page}&limit=${limit}&filter=${filter}`);