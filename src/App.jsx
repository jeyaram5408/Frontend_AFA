// src/App.jsx — Complete Fixed Version

import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Reports from "./Pages/Reports";
import Register from "./Pages/Register";
import Transactions from "./Pages/Transactions";
import Settings from "./Pages/Settings";
import Profile from "./Pages/Profile";
import History from "./Pages/History";
import AIAdvise from "./Pages/AI_Advise";
import VerifyEmail from "./Pages/VerifyEmail";
import VerifyOTP from "./Pages/VerifyOTP";
import ForgotPassword from "./password/ForgetPassword";
import ResetPassword from "./password/ResetPassword";
import GoalsPage from "./Pages/GoalsPage";

// Admin
import AdminLayout from "./Admin_Page/AdminLayout";
import AdminDashboard from "./Admin_Page/AdminDashboard";
import AdminUsers from "./Admin_Page/AdminUsers";
import AdminTransactions from "./Admin_Page/AdminTransaction";
import AdminAnalytics from "./Admin_Page/AdminAnalytics";
import AdminLogs from "./Admin_Page/AdminLogs";
import AdminAISuggestions from "./Admin_Page/AdminAISuggestions";
import AdminUserDetails from "./Admin_Page/AdminUserDetails";
import AdminLogin from "./Admin_Page/AdminLogin";                 
import AdminProtectedRoute from "./Admin_Page/AdminProtectedRoute"; 
import AdminMedia from "./Admin_Page/AdminMedia";

import { AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);

  const isAuth = !!localStorage.getItem("access_token");

  return (
    <AnimatePresence mode="sync">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      <Routes location={location} key={location.pathname}>

        {/* ── Public Routes ── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ── Admin Login ── ✅ NEW */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── User Dashboard ── */}
        <Route
          path="/dashboard"
          element={
            isAuth ? (
              <Dashboard
                transactions={transactions}
                setTransactions={setTransactions}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="transactions" element={<Transactions />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="history" element={<History />} />
          <Route path="ai-advise" element={<AIAdvise />} />
        </Route>

        {/* ── Admin Panel ── ✅ PROTECTED */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetails />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="media" element={<AdminMedia />} />

          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="logs" element={<AdminLogs />} />
          <Route path="ai-suggestion" element={<AdminAISuggestions />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
