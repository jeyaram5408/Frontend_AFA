import API from "./apiClient";

export const getReportData = (filters) => {
  return API.get("/reports", {
    params: filters,
  });
};