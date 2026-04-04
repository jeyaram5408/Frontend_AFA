import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaMapMarkerAlt,
  FaLock,
  FaCamera,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/profile/users/me",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        const u = data.data;

        setUser({
          id: u.id,
          name: u.name,
          email: u.email,
          user_id: u.user_id,
          phone: u.phone_number || "",
          role: u.role || "",
          profile_picture: u.profile_picture || "",

          gender: u.personal?.gender || "",
          dob: u.personal?.date_of_birth
            ? u.personal.date_of_birth.split("T")[0]
            : "",
          city: u.personal?.address?.city || "",
          state: u.personal?.address?.state || "",
          country: u.personal?.address?.country || "",
          pincode: u.personal?.address?.pincode || "",

          emergency_contact: u.personal?.emergencynumber || "",

          income: u.monthly_income || "",
          occupation: u.occupation || "",
          savings_goal: u.savings_goal || "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [user, setUser] = useState({
    name: "",
    email: "",
    user_id: "",
    phone: "",
    role: "",
    gender: "",
    profile_picture: "",
    dob: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    emergency_contact: "",
    income: "",
    occupation: "",
    savings_goal: "",
    password: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);
  const handleSave = async () => {
    try {
      // ✅ PASSWORD VALIDATION FIRST
      if (user.password) {
        const passwordRegex =
          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).{5,}$/;

        if (!passwordRegex.test(user.password)) {
          alert(
            "Password must be at least 6 characters, include 1 uppercase letter and 1 number",
          );
          return false;
        }

        if (user.password !== confirmPassword) {
          alert("Passwords do not match ❌");
          return false;
        }
      }

      // ✅ PAYLOAD AFTER VALIDATION
      const payload = {
        name: user.name || undefined,
        email: user.email || undefined,
        phone_number: user.phone || undefined,
        password: user.password?.trim() || undefined,
        monthly_income: user.income ? parseFloat(user.income) : undefined,
        occupation: user.occupation || undefined,
        savings_goal: user.savings_goal
          ? parseFloat(user.savings_goal)
          : undefined,
      };

      // ✅ Build personal ONLY if data exists
      const personal = {};

      if (user.gender) personal.gender = user.gender;
      if (user.dob) personal.date_of_birth = user.dob;
      if (user.emergency_contact)
        personal.emergencynumber = parseInt(user.emergency_contact);

      const address = {};
      if (user.city) address.city = user.city;
      if (user.state) address.state = user.state;
      if (user.country) address.country = user.country;
      if (user.pincode) address.pincode = user.pincode;

      if (Object.keys(address).length > 0) {
        personal.address = address;
      }

      if (Object.keys(personal).length > 0) {
        payload.personal = personal;
      }

      // ✅ API CALL
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + `/profile/users/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (data.success) {
        alert("Profile Updated ✅");
        setUser((prev) => ({ ...prev, password: "" }));
        setConfirmPassword("");
        return true;
      } else {
        alert(data.detail || "Update failed ❌");
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/profile/upload_profile_picture",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (data.success) {
        fetchProfile(); // refresh
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        await fetch(
          import.meta.env.VITE_API_BASE_URL + "/authentication/logout",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              refresh_token: refreshToken,
            }),
          },
        );
      }
    } catch (err) {
      console.log("Logout error", err);
    } finally {
      localStorage.clear(); // ✅ clear tokens
      navigate("/login"); // ✅ redirect
    }
  };
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      className="p-6 space-y-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
        <p className="text-gray-500 text-sm">
          Manage your personal & financial details
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT PROFILE CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-md text-center space-y-4 border">
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={
                user.profile_picture
                  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${user.profile_picture}`
                  : `https://ui-avatars.com/api/?name=${user.name}`
              }
              className="w-24 h-24 rounded-full object-cover shadow-lg"
            />

            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
              <FaCamera size={12} />
            </div>

            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleProfileUpload}
              disabled={!isEditing}
            />
          </div>

          <div>
            <h2 className="font-semibold text-lg">{user.name || "No Name"}</h2>{" "}
            <p className="text-gray-500 text-sm">{user.role}</p>
          </div>

          <div className="flex justify-center gap-2">
            <FaEnvelope />
            {user.email || <span className="text-gray-400">No Email</span>}
          </div>

          <div className="flex justify-center gap-2">
            <FaPhone />
            {user.phone || <span className="text-gray-400">No Phone</span>}
          </div>

          <button
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            onClick={() => setShowLogoutConfirm(true)}
          >
            Logout
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md space-y-6 border">
          {isEditing && (
            <p className="text-sm text-yellow-600">Editing Mode Enabled</p>
          )}
          {/* TABS */}
          <div className="flex gap-3 flex-wrap">
            {[
              { id: "basic", label: "Basic", icon: <FaUser /> },
              { id: "address", label: "Address", icon: <FaMapMarkerAlt /> },
              {
                id: "financial",
                label: "Financial",
                icon: <FaMoneyBillWave />,
              },
              { id: "security", label: "Security", icon: <FaLock /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* ================= BASIC ================= */}
          {activeTab === "basic" && (
            <Section title="Basic Information">
              <Input
                label="Full Name"
                name="name"
                value={user.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
                disabled
              />
              <Input
                label="User ID"
                name="user_id"
                value={user.user_id}
                onChange={handleChange}
                disabled
              />
              <Input
                label="Phone"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Gender"
                name="gender"
                value={user.gender}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                type="date"
                label="Date of Birth"
                name="dob"
                value={user.dob}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Section>
          )}

          {/* ================= ADDRESS ================= */}
          {activeTab === "address" && (
            <Section title="Address Details">
              <Input
                label="City"
                name="city"
                value={user.city}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="State"
                name="state"
                value={user.state}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Country"
                name="country"
                value={user.country}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Pincode"
                name="pincode"
                value={user.pincode}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Section>
          )}

          {/* ================= FINANCIAL ================= */}
          {activeTab === "financial" && (
            <Section title="Financial Details">
              <Input
                label="Monthly Income"
                name="income"
                value={user.income}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Occupation"
                name="occupation"
                value={user.occupation}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Savings Goal"
                name="savings_goal"
                value={user.savings_goal}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Section>
          )}

          {/* ================= SECURITY ================= */}
          {activeTab === "security" && (
            <Section title="Security Settings">
              <p className="text-xs text-gray-500">
                Password must be 6+ chars, include 1 uppercase & 1 number
              </p>
              <div className="relative">
                <label className="text-sm text-gray-600">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100 pr-10"
                />

                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <Input
                label="Emergency Contact"
                name="emergency_contact"
                value={user.emergency_contact}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <div className="relative">
                <label className="text-sm text-gray-600">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={!isEditing}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100 pr-10"
                />

                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </Section>
          )}

          {/* SAVE BUTTON */}
          <div className="flex justify-end pt-4 border-t gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile(); // reset changes
                  }}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    const success = await handleSave();
                    if (success) setIsEditing(false);
                  }}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* LOGOUT CONFIRM MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-80 rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Logout
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* SECTION WRAPPER */
const Section = ({ title, children }) => (
  <div>
    <h3 className="text-md font-semibold text-gray-700 mb-3">{title}</h3>
    <div className="grid md:grid-cols-2 gap-4">{children}</div>
  </div>
);

/* INPUT */
const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
}) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
    />
  </div>
);

export default Profile;
