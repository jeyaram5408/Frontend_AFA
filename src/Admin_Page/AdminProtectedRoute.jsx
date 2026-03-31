import React from "react";
import { Navigate } from "react-router-dom";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (!token) return <Navigate to="/admin/login" replace />;

  const payload = parseJwt(token);

  if (!payload) {
    localStorage.clear();
    return <Navigate to="/admin/login" replace />;
  }

  if (Date.now() >= payload.exp * 1000) {
    localStorage.clear();
    return <Navigate to="/admin/login" replace />;
  }

  const role = payload?.role?.toLowerCase?.().trim?.();

  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
