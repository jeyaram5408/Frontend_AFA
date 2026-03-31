import API from "./apiClient";

export const loginUser = (data) => {
  return API.post("/authentication/login", data);
};