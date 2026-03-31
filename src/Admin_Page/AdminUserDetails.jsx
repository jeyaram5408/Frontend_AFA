import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdminUserById } from "../api/adminApi";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaBriefcase, FaChartBar } from "react-icons/fa";

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-800">{value || "—"}</span>
  </div>
);

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUserById(id)
      .then((res) => setUser(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!user) return <div className="text-center py-20 text-gray-400">User not found</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
      >
        <FaArrowLeft size={12} /> Back to Users
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {user.is_active ? "Active" : "Blocked"}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold capitalize">
                {user.role || "user"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaUser className="text-indigo-500" /> Personal Info
            </h3>
            <InfoRow label="User ID" value={user.user_id} />
            <InfoRow label="Phone" value={user.phone_number} />
            <InfoRow label="Gender" value={user.personal?.gender} />
            <InfoRow label="Date of Birth" value={user.personal?.date_of_birth} />
            <InfoRow label="Emergency No" value={user.personal?.emergencynumber} />
            <InfoRow label="Joined" value={user.created_at ? new Date(user.created_at).toLocaleDateString("en-GB") : null} />
          </div>

          {/* Financial Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaBriefcase className="text-indigo-500" /> Financial Info
            </h3>
            <InfoRow label="Monthly Income" value={user.monthly_income ? `₹${Number(user.monthly_income).toLocaleString()}` : null} />
            <InfoRow label="Occupation" value={user.occupation} />
            <InfoRow label="Savings Goal" value={user.savings_goal ? `₹${Number(user.savings_goal).toLocaleString()}` : null} />
            {user.personal?.address && (
              <InfoRow
                label="City"
                value={[user.personal.address.city, user.personal.address.state].filter(Boolean).join(", ")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Transactions", value: user.stats?.total_transactions || 0, color: "bg-purple-50 text-purple-700" },
          { label: "Total Income", value: `₹${Number(user.stats?.total_income || 0).toLocaleString()}`, color: "bg-green-50 text-green-700" },
          { label: "Total Expense", value: `₹${Number(user.stats?.total_expense || 0).toLocaleString()}`, color: "bg-red-50 text-red-700" },
          { label: "Net Savings", value: `₹${Number(user.stats?.savings || 0).toLocaleString()}`, color: "bg-indigo-50 text-indigo-700" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.color.split(" ")[0]}`}>
            <p className={`text-xs font-medium ${s.color.split(" ")[1]}`}>{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color.split(" ")[1]}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserDetails;
