import API from "./apiClient";

export const getMySettings = () => API.get("/settings/me");

export const updateMySettings = (data) => API.patch("/settings/me", data);


