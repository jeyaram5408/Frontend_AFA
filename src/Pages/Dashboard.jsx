// =============================================
// Dashboard.jsx — Full Mobile Responsive Version
// உங்கள் existing Dashboard.jsx-ஐ இதுவாக replace பண்ணுங்க
// =============================================

import React, { useEffect, useState } from "react";
import { getDashboardData } from "../api/dashboardApi";
import API from "../api/apiClient";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaHome,
  FaExchangeAlt,
  FaChartLine,
  FaCog,
  FaHistory,
  FaBars,
  FaTimes,
  FaRobot,
  FaBullseye,
} from "react-icons/fa";
import { motion } from "framer-motion";
import FinancialHealthScore from "../components/FinancialHealthScore";
import ExpensePieChart from "../components/ExpensePieChart";
import BudgetGoal from "../components/BudgetGoal";
import logo from "../assets/logo.png";
import menu from "../assets/menu-6-svgrepo-com.svg";
import income_icon from "../assets/money-bag-svgrepo-com.svg";
import expese_icon from "../assets/wallet-svgrepo-com.svg";
import savings_icon from "../assets/national-tax-svgrepo-com (1).svg";
import AdminDashboard from "../Admin_Page/AdminDashboard";

const NAV_ITEMS = [
  { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
  {
    icon: <FaExchangeAlt />,
    label: "Transactions",
    path: "/dashboard/transactions",
  },
  { icon: <FaChartLine />, label: "Reports", path: "/dashboard/reports" },
  { icon: <FaHistory />, label: "History", path: "/dashboard/history" },
  { icon: <FaBullseye />, label: "Goals", path: "/dashboard/goals" },
  { icon: <FaCog />, label: "Settings", path: "/dashboard/settings" },
  { icon: <FaRobot />, label: "AI-Advise", path: "/dashboard/ai-advise" },
];

const Dashboard = ({ transactions, setTransactions }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isDashboardHome = location.pathname === "/dashboard";

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await API.get("/profile/users/me");
        setUser(res.data.data);
      } catch (err) {
        console.log("User info error:", err);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setDashboardError("");
      const response = await getDashboardData();
      const normalizedData = response?.data ? response.data : response;
      setDashboardData(normalizedData || {});
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setDashboardError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await API.post(
          "/authentication/logout",
          new URLSearchParams({ refresh_token: refreshToken }),
        );
      }
    } catch (err) {
      console.log("Logout error", err);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  const getPageTitle = () => {
    if (location.pathname.includes("transactions")) return "Transactions";
    if (location.pathname.includes("reports")) return "Reports";
    if (location.pathname.includes("history")) return "History";
    if (location.pathname.includes("settings")) return "Settings";
    if (location.pathname.includes("profile")) return "Profile";
    if (location.pathname.includes("ai-advise")) return "AI Advice";
    if (location.pathname.includes("goals")) return "Goals";
    return "Dashboard";
  };

  const profileImage = user?.profile_picture
    ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${user.profile_picture}`
    : `https://ui-avatars.com/api/?name=${user?.name || "User"}&size=128`;

  return (
    <>
      <div className="flex bg-gray-100 min-h-screen">
        {/* =============================================
            DESKTOP SIDEBAR (hidden on mobile: hidden md:flex)
        ============================================= */}
        <div
          className={`${
            sidebarOpen ? "w-52" : "w-16"
          } bg-indigo-700 text-white transition-all duration-300 fixed h-screen flex-col z-50 hidden md:flex`}
        >
          {/* Logo */}
          <div className="p-3 relative flex items-center border-b border-indigo-600">
            <img
              src={logo}
              alt="logo"
              className={`w-9 h-9 rounded-full transition-all duration-300 ${
                sidebarOpen ? "opacity-100" : "opacity-0 scale-0"
              }`}
            />
            <img
              src={menu}
              alt="Menu"
              className={`cursor-pointer w-5 h-5 absolute right-6 top-1/2 -translate-y-1/2 transition-transform duration-300 ${
                sidebarOpen ? "rotate-0" : "rotate-180"
              }`}
              onClick={() => setSidebarOpen((prev) => !prev)}
            />
          </div>

          {/* Nav */}
          <nav className="flex-1 mt-4 space-y-5 px-2">
            {NAV_ITEMS.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                active={
                  item.path === "/dashboard"
                    ? location.pathname === "/dashboard"
                    : location.pathname.includes(item.path.split("/")[2])
                }
                onClick={() => navigate(item.path)}
                sidebarOpen={sidebarOpen}
              />
            ))}
          </nav>
        </div>

        {/* =============================================
            MOBILE SIDEBAR OVERLAY (shown only on mobile)
        ============================================= */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-indigo-700 text-white z-50 transform transition-transform duration-300 md:hidden ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-indigo-600">
            <div className="flex items-center gap-3">
              <img src={logo} alt="logo" className="w-9 h-9 rounded-full" />
              <span className="font-semibold text-sm">AI Finance</span>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="text-white p-1"
            >
              <FaTimes />
            </button>
          </div>

          {/* Mobile Nav Items */}
          <nav className="mt-4 space-y-2 px-3">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileSidebarOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-lg text-sm cursor-pointer transition ${
                  (
                    item.path === "/dashboard"
                      ? location.pathname === "/dashboard"
                      : location.pathname.includes(item.path.split("/")[2])
                  )
                    ? "bg-white text-indigo-700 font-medium shadow-sm"
                    : "hover:bg-indigo-600"
                }`}
              >
                <div className="text-base">{item.icon}</div>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>

          {/* Mobile User Info at bottom */}
          {user && (
            <div className="absolute bottom-4 left-3 right-3">
              <div className="flex items-center gap-3 bg-indigo-600 rounded-xl p-3">
                <img
                  src={profileImage}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover border border-white/30"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-indigo-300 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =============================================
            MAIN CONTENT AREA
        ============================================= */}
        <div
          className={`flex-1 flex flex-col transition-all
    ${sidebarOpen ? "md:ml-52" : "md:ml-16"}
    ml-0
  `}
        >
          {/* =============================================
              TOPBAR / NAVBAR
          ============================================= */}
          <div
            className={`flex justify-between items-center bg-white px-4 md:px-6 py-3 md:py-4 shadow fixed top-0 right-0 z-40 transition-all
  ${sidebarOpen ? "md:left-52" : "md:left-16"} left-0`} // style={{
            //   left: window.innerWidth >= 768 ? (sidebarOpen ? "13rem" : "4rem") : "0",
            // }}
          >
            {/* Left: Hamburger (mobile) + Title */}
            <div className="flex items-center gap-3">
              {/* Hamburger - only on mobile */}
              <button
                className="md:hidden text-gray-600 p-1"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <FaBars className="text-xl" />
              </button>
              <h1 className="text-base md:text-lg font-semibold text-gray-700">
                {getPageTitle()}
              </h1>
            </div>

            {/* Right: Bell + Profile */}
            <div className="flex items-center gap-3 md:gap-5 relative">
              <FaBell className="text-base md:text-lg text-gray-600 cursor-pointer hover:text-indigo-600" />

              <div
                className="relative cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <img
                  src={profileImage}
                  alt="profile"
                  className="w-9 h-9 md:w-12 md:h-12 rounded-full object-cover border-2 border-indigo-500 hover:scale-105 transition"
                />

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg border text-sm overflow-hidden z-50">
                    <div className="px-3 py-2 border-b text-gray-600 truncate">
                      {user?.name}
                    </div>
                    <div
                      onClick={() => {
                        navigate("/dashboard/profile");
                        setProfileOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      Profile
                    </div>
                    <div
                      onClick={() => {
                        setShowLogoutConfirm(true);
                        setProfileOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-red-50 text-red-600 cursor-pointer"
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =============================================
              PAGE CONTENT
              pt-16 (mobile topbar height) md:pt-22
              pb-20 (mobile bottom nav) md:pb-2
          ============================================= */}
          <div className="pt-16 md:pt-22 px-3 md:px-4 pb-24 md:pb-4 overflow-y-auto min-h-screen">
            {isDashboardHome ? (
              !user ? (
                <p className="text-center mt-10 text-gray-500">Loading...</p>
              ) : user.role === "admin" ? (
                <AdminDashboard />
              ) : loading ? (
                <div className="flex items-center justify-center h-[60vh]">
                  <p className="text-sm text-gray-500">Loading dashboard...</p>
                </div>
              ) : dashboardError ? (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                  {dashboardError}
                </div>
              ) : (
                <DashboardHome dashboardData={dashboardData} />
              )
            ) : (
              <Outlet context={{ transactions, setTransactions }} />
            )}
          </div>
        </div>

        {/* =============================================
            MOBILE BOTTOM NAVIGATION
            (shown only on mobile — hidden md:hidden)
        ============================================= */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
          <div className="flex items-center justify-around py-2">
            {/* Show only 5 main items in bottom nav */}
            {NAV_ITEMS.slice(0, 5).map((item) => {
              const isActive =
                item.path === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.includes(item.path.split("/")[2]);

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                    isActive ? "text-indigo-600" : "text-gray-500"
                  }`}
                >
                  <div className={`text-lg ${isActive ? "scale-110" : ""}`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Confirm Logout</h2>
            <p className="text-gray-500 mb-5">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

/* =============================================
   SIDEBAR ITEM (Desktop)
============================================= */
function SidebarItem({ icon, label, active, onClick, sidebarOpen }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-2 rounded-md text-sm cursor-pointer transition ${
        active
          ? "bg-white text-indigo-700 font-medium shadow-sm"
          : "hover:bg-indigo-600"
      }`}
    >
      <div className="text-base">{icon}</div>
      {sidebarOpen && <span>{label}</span>}
    </div>
  );
}

/* =============================================
   DASHBOARD HOME
============================================= */
function DashboardHome({ dashboardData }) {
  if (!dashboardData) return <p>Loading...</p>;

  const {
    income,
    expense,
    savings,
    chartData,
    final_score,
    score,
    health_label,
    summary,
    actions,
    adjustment_reason,
    ai_adjustment,
  } = dashboardData;

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Summary Cards — 1 col mobile, 3 col desktop */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-base"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card
          className="bg-[#DBFCE7]"
          title="Income"
          value={`₹${Number(income || 0).toLocaleString()}`}
          icon={income_icon}
        />
        <Card
          className="bg-[#FFE2E2]"
          title="Expense"
          value={`₹${Number(expense || 0).toLocaleString()}`}
          icon={expese_icon}
        />
        <Card
          className="bg-yellow-100"
          title="Savings"
          value={`₹${Number(savings || 0).toLocaleString()}`}
          icon={savings_icon}
        />
      </motion.div>

      {/* Charts — stacked on mobile, grid on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ExpensePieChart data={chartData || []} />
        </div>
        <BudgetGoal />

        <div className="md:col-span-3">
          <FinancialHealthScore
            score={final_score ?? score ?? 0}
            label={health_label ?? "Fair"}
            summary={summary ?? ""}
            actions={actions ?? []}
            adjustmentReason={adjustment_reason ?? ""}
            aiAdjustment={ai_adjustment ?? 0}
          />
        </div>
      </div>
    </div>
  );
}

/* =============================================
   CARD
============================================= */
function Card({ title, value, icon, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center ${className}`}
    >
      <div>
        <p className="text-base md:text-xl text-gray-500">{title}</p>
        <h3 className="text-base md:text-lg font-semibold mt-1 text-gray-800">
          {value}
        </h3>
      </div>
      <div className="bg-indigo-50 p-2 rounded-lg">
        <img src={icon} alt={title} className="w-8 h-8 md:w-10 md:h-10" />
      </div>
    </motion.div>
  );
}
