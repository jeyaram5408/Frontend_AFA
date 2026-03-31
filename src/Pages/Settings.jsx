import React, { useEffect, useState } from "react";
import API from "../api/apiClient";
import { getMySettings, updateMySettings } from "../api/settingsApi";
import {
  Bell,
  UserCircle2,
  Mail,
  Smartphone,
  BadgeDollarSign,
  Lock,
  IndianRupee,
} from "lucide-react";

const tabs = [
  { id: "alerts", label: "Alert / Notification Settings" },
  { id: "currency", label: "Default Currency" },
  { id: "budget", label: "Budget Category Settings" },
  { id: "profile", label: "Profile / Account Settings" },
];

const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "LKR", label: "LKR - Sri Lankan Rupee" },
  { value: "AED", label: "AED - UAE Dirham" },
];

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  icon = null,
  disabled = false,
}) => (
  <div className="space-y-2">
    <label className="text-[13px] font-semibold text-slate-600">{label}</label>

    <div
      className={`flex items-center gap-3 rounded-[14px] border px-5 py-4 text-base  ${
        disabled ? "bg-slate-100 border-slate-300" : "bg-white border-slate-400"
      }`}
    >
      {icon && <div className="text-slate-500">{icon}</div>}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-transparent text-sm text-slate-800 outline-none disabled:cursor-not-allowed"
      />
    </div>
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
  icon = null,
  disabled = false,
}) => (
  <div className="space-y-2">
    <label className="text-[13px] font-semibold text-slate-600">{label}</label>

    <div
      className={`flex items-center gap-3 rounded-[14px] border px-4 py-3 ${
        disabled ? "bg-slate-100 border-slate-300" : "bg-white border-slate-400"
      }`}
    >
      {icon && <div className="text-slate-500">{icon}</div>}

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-transparent text-sm text-slate-800 outline-none"
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const ToggleRow = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) => (
  <div className="flex items-center justify-between rounded-[14px] border border-slate-400 bg-white px-4 py-4">
    <div>
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      {description && (
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      )}
    </div>

    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative h-7 w-12 rounded-full ${
        checked ? "bg-[#5848F6]" : "bg-slate-300"
      } ${disabled && "opacity-50 cursor-not-allowed"}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  </div>
);

const PageCard = ({ children, className = "" }) => (
  <div
    className={`rounded-\[18px] border border-slate-500 bg-white px-5 py-5 ${className}`}
  >
    {children}
  </div>
);

const SaveButton = ({ onClick, saving, text }) => (
  <div className="flex justify-end pt-2">
    <button
      onClick={onClick}
      disabled={saving}
      className="rounded-[10px] bg-[#5848F6] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#4737e8] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {saving ? "Saving..." : text}
    </button>
  </div>
);

const BudgetPanel = ({
  title,
  type,
  budgets,
  isEditing,
  onToggleEdit,
  onAdd,
  onEditChip,
  onDeleteChip,
}) => {
  const isIncome = type === "income";

  // Green for income, Red/Pink for expense (matching categories screenshot)
  const chipNormal = isIncome
    ? "bg-[#eef6ee] text-green-700 border border-green-200"
    : "bg-[#fef0f0] text-red-600 border border-red-200";

  const chipEditing = isIncome
    ? "bg-green-100 text-green-800 border border-green-300 cursor-pointer hover:bg-green-200"
    : "bg-red-100 text-red-700 border border-red-300 cursor-pointer hover:bg-red-200";

  return (
    <div className="rounded-\[14px] border border-slate-300 bg-white p-4 min-h-35">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-semibold text-slate-600">{title}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleEdit}
            className={`text-[13px] font-semibold transition ${
              isEditing
                ? "text-[#5848F6]"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {isEditing ? "Done" : "Edit"}
          </button>
          <button
            onClick={onAdd}
            className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-400 text-slate-500 hover:border-[#5848F6] hover:text-[#5848F6] transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 min-h-10">
        {budgets.length === 0 && (
          <p className="text-xs text-slate-400 italic">
            No {title.toLowerCase()} added yet.
          </p>
        )}
        {budgets.map((b) => (
          <div
            key={b.id}
            onClick={() => isEditing && onEditChip(b)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium transition select-none
              ${isEditing ? chipEditing : chipNormal}`}
          >
            <span>{b.name}</span>
            <span className="opacity-60 text-\[11px]">₹{b.amount}</span>

            {isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChip(b);
                }}
                className="ml-0.5 text-current opacity-50 hover:opacity-100 font-bold text-xs leading-none"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("alerts");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    default_currency: "USD",
    monthly_budget: "",
    email_notifications: true,
    push_notifications: false,
    budget_alerts: true,
  });

  // Replace existing budget-related states with these:
  const [budgets, setBudgets] = useState([]);

  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [isEditingExpense, setIsEditingExpense] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetFormType, setBudgetFormType] = useState("income"); // "income" | "expense"
  const [newBudget, setNewBudget] = useState({ name: "", amount: "" });

  const [showEditBudgetForm, setShowEditBudgetForm] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [editBudget, setEditBudget] = useState({ name: "", amount: "" });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  // ✅ FIX: moved confirmDelete AFTER state declarations
  const confirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await API.delete(`/categories/${deleteItem.id}`);
      setShowDeleteConfirm(false);
      fetchCategories();
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setBudgets(res.data); // you can keep state name as budgets
    } catch (err) {
      alert("Failed to load categories ❌");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await getMySettings();
      const data = res.data.data;
      setSettings({
        name: data.name || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        password: "",
        default_currency: data.default_currency || "USD",
        monthly_budget:
          data.monthly_budget === null || data.monthly_budget === undefined
            ? ""
            : data.monthly_budget,
        email_notifications: data.email_notifications ?? true,
        push_notifications: data.push_notifications ?? false,
        budget_alerts: data.budget_alerts ?? true,
      });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      alert("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const saveAlerts = async () => {
    try {
      setSaving(true);
      await updateMySettings({
        email_notifications: settings.email_notifications,
        push_notifications: settings.push_notifications,
        budget_alerts: settings.budget_alerts,
      });
      alert("Alert settings updated ✅");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Failed to update alerts");
    } finally {
      setSaving(false);
    }
  };

  const saveCurrency = async () => {
    try {
      setSaving(true);
      await updateMySettings({ default_currency: settings.default_currency });
      alert("Currency updated ✅");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Failed to update currency");
    } finally {
      setSaving(false);
    }
  };

  const saveBudget = async () => {
    try {
      setSaving(true);
      await updateMySettings({
        monthly_budget:
          settings.monthly_budget === ""
            ? null
            : Number(settings.monthly_budget),
      });
      alert("Monthly budget updated ✅");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Failed to update budget");
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const payload = {
        name: settings.name,
        email: settings.email,
        phone_number: settings.phone_number,
      };
      if (settings.password?.trim()) {
        payload.password = settings.password;
      }
      await updateMySettings(payload);
      setSettings((prev) => ({ ...prev, password: "" }));
      alert("Profile updated ✅");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    // ✅ FIX: Single root wrapper — all content including modals lives inside here
    <div className="min-h-screen bg-\[#F5F6FA]  ">
      {/* Top strip */}
      {/* <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <h1 className="text-\[15px] font-semibold text-slate-700">Settings</h1>
        <div className="flex items-center gap-4 text-slate-600">
          <Bell size={18} />
          <UserCircle2 size={22} />
        </div>
      </div> */}

      <div className="w-full px-10 py-6">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {" "}
          {/* Intro Card */}
          <PageCard className="px-6 py-6   ">
            <h2 className="text-4xl font-bold leading-none text-slate-800">
              Settings
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Manage your alerts, currency, monthly budget, and account details.
            </p>
          </PageCard>
          {/* Tab Card */}
          <PageCard className="px-3 py-2 ">
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-[10px] px-5 py-3 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-[#5848F6] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </PageCard>
          {/* Main Content Card */}
          <PageCard className="px-8 py-8">
            {" "}
            {loading ? (
              <div className="py-10 text-sm text-slate-500">
                Loading settings...
              </div>
            ) : (
              <>
                {/* ── Alerts Tab ── */}
                {activeTab === "alerts" && (
                  <div className="space-y-5">
                    <h3 className="text-\[28px] font-semibold text-slate-800">
                      Alert / Notification Settings
                    </h3>
                    <div className="space-y-4">
                      <ToggleRow
                        label="Email Notifications"
                        description="Receive account and activity updates by email."
                        checked={settings.email_notifications}
                        disabled={!isEditing}
                        onChange={() =>
                          setSettings((prev) => ({
                            ...prev,
                            email_notifications: !prev.email_notifications,
                          }))
                        }
                      />
                      <ToggleRow
                        label="Push Notifications"
                        description="Get quick alerts directly inside the app."
                        checked={settings.push_notifications}
                        disabled={!isEditing}
                        onChange={() =>
                          setSettings((prev) => ({
                            ...prev,
                            push_notifications: !prev.push_notifications,
                          }))
                        }
                      />
                      <ToggleRow
                        label="Budget Alerts"
                        description="Notify when your monthly spending nears the limit."
                        checked={settings.budget_alerts}
                        disabled={!isEditing}
                        onChange={() =>
                          setSettings((prev) => ({
                            ...prev,
                            budget_alerts: !prev.budget_alerts,
                          }))
                        }
                      />
                    </div>
                    {isEditing && (
                      <SaveButton
                        onClick={saveAlerts}
                        saving={saving}
                        text="Save Alerts"
                      />
                    )}
                  </div>
                )}

                {/* ── Currency Tab ── */}
                {activeTab === "currency" && (
                  <div className="space-y-5">
                    <h3 className="text-\[28px] font-semibold text-slate-800">
                      Default Currency
                    </h3>
                    <div className="max-w-2xl">
                      <SelectField
                        label="Choose Currency"
                        value={settings.default_currency}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            default_currency: e.target.value,
                          }))
                        }
                        options={currencies}
                        icon={<BadgeDollarSign size={18} />}
                      />
                    </div>
                    <SaveButton
                      onClick={saveCurrency}
                      saving={saving}
                      text="Save Currency"
                    />
                  </div>
                )}

                {/* ── Budget Tab ── */}
                {activeTab === "budget" && (
                  <div className="space-y-6">
                    <h3 className="text-\[28px] font-semibold text-slate-800">
                      Monthly Budget Settings
                    </h3>

                    {/* ── Two Panels ── */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
                      {/* ── Income Budget Panel ── */}
                      <BudgetPanel
                        title="Income Budget"
                        type="income"
                        budgets={budgets.filter((b) => b.type === "income")}
                        isEditing={isEditingIncome}
                        onToggleEdit={() => setIsEditingIncome((prev) => !prev)}
                        onAdd={() => {
                          setBudgetFormType("income");
                          setShowBudgetForm(true);
                        }}
                        onEditChip={(b) => {
                          setSelectedBudget(b);
                          setEditBudget({ name: b.name, amount: b.amount });
                          setShowEditBudgetForm(true);
                        }}
                        onDeleteChip={(b) => {
                          setDeleteItem(b);
                          setShowDeleteConfirm(true);
                        }}
                      />

                      {/* ── Expense Budget Panel ── */}
                      <BudgetPanel
                        title="Expense Budget"
                        type="expense"
                        budgets={budgets.filter((b) => b.type === "expense")}
                        isEditing={isEditingExpense}
                        onToggleEdit={() =>
                          setIsEditingExpense((prev) => !prev)
                        }
                        onAdd={() => {
                          setBudgetFormType("expense");
                          setShowBudgetForm(true);
                        }}
                        onEditChip={(b) => {
                          setSelectedBudget(b);
                          setEditBudget({ name: b.name, amount: b.amount });
                          setShowEditBudgetForm(true);
                        }}
                        onDeleteChip={(b) => {
                          setDeleteItem(b);
                          setShowDeleteConfirm(true);
                        }}
                      />
                    </div>

                    <SaveButton
                      onClick={saveBudget}
                      saving={saving}
                      text="Save Budget"
                    />
                  </div>
                )}

                {/* ── Profile Tab ── */}
                {activeTab === "profile" && (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <h3 className="text-3xl font-semibold text-slate-800">
                        Profile / Account Settings
                      </h3>

                      <button
                        onClick={() => setIsEditing((prev) => !prev)}
                        className="text-sm font-semibold text-[#5848F6]"
                      >
                        {isEditing ? "Cancel" : "Edit"}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field
                        label="Full Name"
                        value={settings.name}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter your name"
                        icon={<UserCircle2 size={18} />}
                      />
                      <Field
                        label="Email"
                        type="email"
                        value={settings.email}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Enter your email"
                        icon={<Mail size={18} />}
                      />
                      <Field
                        label="Phone Number"
                        value={settings.phone_number}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            phone_number: e.target.value,
                          }))
                        }
                        placeholder="Enter your phone number"
                        icon={<Smartphone size={18} />}
                      />
                      <Field
                        label="New Password"
                        type="password"
                        value={settings.password}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        placeholder="Leave blank if no change"
                        icon={<Lock size={18} />}
                      />
                    </div>
                    <SaveButton
                      onClick={saveProfile}
                      saving={saving}
                      text="Save Profile"
                    />
                  </div>
                )}
              </>
            )}
          </PageCard>
        </div>
      </div>

      {/* ✅ FIX: All modals placed INSIDE the root wrapper div */}

      {/* Edit Budget Modal */}
      {showEditBudgetForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Edit Budget
            </h3>
            <input
              value={editBudget.name}
              onChange={(e) =>
                setEditBudget({ ...editBudget, name: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
              placeholder="Budget name"
            />
            <input
              type="number"
              value={editBudget.amount}
              onChange={(e) =>
                setEditBudget({ ...editBudget, amount: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
              placeholder="Amount"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditBudgetForm(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold"
              >
                Close
              </button>
              <button
                onClick={async () => {
                  await API.patch(`/categories/${selectedBudget.id}`, {
                    name: editBudget.name,
                    type: selectedBudget.type,
                  });
                  setShowEditBudgetForm(false);
                  fetchCategories();
                }}
                className="px-4 py-2 rounded-lg bg-[#5848F6] text-white text-sm font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showBudgetForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-800">
              Add {budgetFormType === "income" ? "Income" : "Expense"} Budget
            </h3>

            <input
              placeholder={
                budgetFormType === "income"
                  ? "Name (e.g. Salary, Bonus)"
                  : "Name (e.g. Food, Rent)"
              }
              value={newBudget.name}
              onChange={(e) =>
                setNewBudget({ ...newBudget, name: e.target.value })
              }
              className="w-full border border-slate-300 p-2.5 rounded-lg text-sm outline-none focus:border-[#5848F6]"
            />
            {/* <input
              type="number"
              placeholder="Amount (₹)"
              value={newBudget.amount}
              onChange={(e) =>
                setNewBudget({ ...newBudget, amount: e.target.value })
              }
              className="w-full border border-slate-300 p-2.5 rounded-lg text-sm outline-none focus:border-[#5848F6]"
            /> */}

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  setShowBudgetForm(false);
                  setNewBudget({ name: "", amount: "" });
                }}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await API.post("/categories", {
                    name: newBudget.name,
                    type: budgetFormType, // income / expense
                  });
                  setShowBudgetForm(false);
                  setNewBudget({ name: "", amount: "" });
                  fetchCategories();
                }}
                className="px-4 py-2 rounded-lg bg-[#5848F6] text-white text-sm font-semibold hover:bg-[#4737e8]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 text-center space-y-3">
            <h3 className="text-lg font-semibold text-slate-800">
              Confirm Delete ❗
            </h3>
            <p className="text-sm text-slate-600">Delete {deleteItem?.name}?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div> // ← single root closing tag
  );
};

export default Settings;
