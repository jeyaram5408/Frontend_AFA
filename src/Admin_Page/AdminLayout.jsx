import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaUsers,
  FaExchangeAlt,
  FaChartLine,
  FaRobot,
  FaClipboardList,
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaImages,
} from "react-icons/fa";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: <FaChartBar />, exact: true },
  { to: "/admin/users", label: "Users", icon: <FaUsers /> },
  { to: "/admin/transactions", label: "Transactions", icon: <FaExchangeAlt /> },
  { to: "/admin/analytics", label: "Analytics", icon: <FaChartLine /> },
  { to: "/admin/media", label: "Media", icon: <FaImages /> },

  { to: "/admin/ai-suggestion", label: "AI Suggestions", icon: <FaRobot /> },
  { to: "/admin/logs", label: "System Logs", icon: <FaClipboardList /> },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-16" : "w-56"} bg-slate-900 text-white fixed h-screen flex flex-col transition-all duration-300 z-50`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-indigo-400 text-lg" />
              <span className="font-bold text-sm">Finance Admin</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="text-slate-400 hover:text-white transition ml-auto"
          >
            {collapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-600 hover:text-white transition"
          >
            <FaSignOutAlt className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 ${collapsed ? "ml-16" : "ml-56"} transition-all duration-300`}
      >
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <h1 className="font-semibold text-slate-700 text-lg">
            {navItems.find((n) =>
              n.exact
                ? location.pathname === n.to
                : location.pathname.startsWith(n.to),
            )?.label || "Admin Panel"}
          </h1>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
            Admin
          </span>
        </div>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
