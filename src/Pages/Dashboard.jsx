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
import AdminDashboard from "../Admin_Page/AdminDashboard";

const Dashboard = ({ transactions, setTransactions }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isDashboardHome = location.pathname === "/dashboard";

  /* ================= USER FETCH ================= */
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
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  /* ================= DASHBOARD FETCH ================= */
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

  /* ================= LOGOUT ================= */
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

  /* ================= PAGE TITLE ================= */
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

  /* ================= PROFILE IMAGE ================= */
  const profileImage = user?.profile_picture
    ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${user.profile_picture}`
    : `https://ui-avatars.com/api/?name=${user?.name || "User"}&size=128`;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* ================= SIDEBAR ================= */}
      <div
        className={`${
          sidebarOpen ? "w-52" : "w-16"
        } bg-indigo-700 text-white transition-all duration-300 fixed h-screen flex flex-col z-50`}
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
            className={`cursor-pointer w-4 h-6 absolute right-3 transition-all duration-300 ${
              sidebarOpen ? "rotate-90" : "left-3"
            }`}
            onClick={() => setSidebarOpen((prev) => !prev)}
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 mt-4 space-y-5 px-2">
          <SidebarItem
            icon={<FaHome />}
            label="Dashboard"
            active={location.pathname === "/dashboard"}
            onClick={() => navigate("/dashboard")}
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            icon={<FaExchangeAlt />}
            label="Transactions"
            active={location.pathname.includes("transactions")}
            onClick={() => navigate("/dashboard/transactions")}
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            icon={<FaChartLine />}
            label="Reports"
            active={location.pathname.includes("reports")}
            onClick={() => navigate("/dashboard/reports")}
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            icon={<FaHistory />}
            label="History"
            active={location.pathname.includes("history")}
            onClick={() => navigate("/dashboard/history")}
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            icon={<FaBullseye />}
            label="Goals"
            active={location.pathname.includes("goals")}
            onClick={() => navigate("/dashboard/goals")}
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            icon={<FaCog />}
            label="Settings"
            active={location.pathname.includes("settings")}
            onClick={() => navigate("/dashboard/settings")}
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            icon={<FaRobot />}
            label="AI-Advise"
            active={location.pathname.includes("ai-advise")}
            onClick={() => navigate("/dashboard/ai-advise")}
            sidebarOpen={sidebarOpen}
          />
        </nav>
      </div>

      {/* ================= MAIN ================= */}
      <div
        className={`flex-1 flex flex-col ${sidebarOpen ? "ml-52" : "ml-16"} transition-all`}
      >
        {/* ================= NAVBAR ================= */}
        <div
          className="flex justify-between items-center bg-white px-6 py-4 shadow fixed top-0 right-0 z-40"
          style={{ left: sidebarOpen ? "13rem" : "4rem" }}
        >
          <h1 className="text-lg font-semibold text-gray-700">
            {getPageTitle()}
          </h1>

          <div className="flex items-center gap-5 relative">
            <FaBell className="text-lg text-gray-600 cursor-pointer hover:text-indigo-600" />

            {/* Profile */}
            <div
              className="relative cursor-pointer"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <img
                src={profileImage}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 hover:scale-105 transition"
              />

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg border text-sm overflow-hidden">
                  <div className="px-3 py-2 border-b text-gray-600">
                    {user?.name}
                  </div>

                  <div
                    onClick={() => navigate("/dashboard/profile")}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    Profile
                  </div>

                  <div
                    onClick={handleLogout}
                    className="px-3 py-2 hover:bg-red-50 text-red-600 cursor-pointer"
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= PAGE ================= */}
        <div className="pt-22 px-4 pb-2 overflow-y-auto min-h-screen">
          {isDashboardHome ? (
            !user ? (
              <p>Loading...</p>
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
    </div>
  );
};

export default Dashboard;

/* ================= SIDEBAR ITEM ================= */
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

/* ================= DASHBOARD HOME ================= */
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
    <div className="space-y-5">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-sm gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card
          title="Income"
          value={`₹${Number(income || 0).toLocaleString()}`}
        />
        <Card
          title="Expense"
          value={`₹${Number(expense || 0).toLocaleString()}`}
        />
        <Card
          title="Savings"
          value={`₹${Number(savings || 0).toLocaleString()}`}
        />
      </motion.div>

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

/* ================= CARD ================= */
function Card({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
    >
      <p className="text-lg text-gray-500">{title}</p>
      <h3 className="text-lg font-semibold mt-1 text-gray-800">{value}</h3>
    </motion.div>
  );
}
