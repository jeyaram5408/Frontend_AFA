import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const goToLoginByContext = () => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  window.location.href = isAdminRoute ? "/admin/login" : "/login";
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/authentication/refresh") &&
      !originalRequest.url.includes("/authentication/login")
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.clear();
        goToLoginByContext();
        return Promise.reject(err);
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/authentication/refresh`,
          new URLSearchParams({
            refresh_token: refreshToken,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const newAccessToken = res.data.access_token;
        const newRefreshToken = res.data.refresh_token;

        localStorage.setItem("access_token", newAccessToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (error) {
        localStorage.clear();
        goToLoginByContext();
        return Promise.reject(error);
      }
    }

    return Promise.reject(err);
  }
);

export default API;
