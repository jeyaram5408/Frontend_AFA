import React, { useEffect, useState } from "react";
import API from "../api/apiClient";
import { getMySettings, updateMySettings } from "../api/settingsApi";

import {
  UserCircle2,
  Mail,
  Smartphone,
  BadgeDollarSign,
  Lock,
} from "lucide-react";

import { toast } from "react-toastify";

const tabs = [
  { id: "alerts", label: "Alerts", fullLabel: "Alert / Notification Settings" },
  { id: "currency", label: "Currency", fullLabel: "Default Currency" },
  { id: "budget", label: "Budget", fullLabel: "Budget Category Settings" },
  { id: "profile", label: "Profile", fullLabel: "Profile / Account Settings" },
];

const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "LKR", label: "LKR - Sri Lankan Rupee" },
  { value: "AED", label: "AED - UAE Dirham" },
];

/* -------------------------------------------------------------------------- */
/*                                  COMPONENTS                                */
/* -------------------------------------------------------------------------- */

const PageCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl sm:rounded-3xl bg-white shadow-sm sm:shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

const SaveButton = ({ onClick, saving, text }) => (
  <div className="flex justify-end pt-2">
    <button
      onClick={onClick}
      disabled={saving}
      className="w-full sm:w-auto rounded-xl bg-indigo-500 hover:bg-indigo-600 px-6 py-3 text-sm sm:text-base font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
    >
      {saving ? "Saving..." : text}
    </button>
  </div>
);

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
    <label className="text-xs sm:text-sm font-semibold text-slate-600">
      {label}
    </label>

    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-400 transition ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {icon && <div className="text-slate-500 shrink-0">{icon}</div>}

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
    <label className="text-xs sm:text-sm font-semibold text-slate-600">
      {label}
    </label>

    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-400 transition ${
        disabled ? "opacity-60" : ""
      }`}
    >
      {icon && <div className="text-slate-500 shrink-0">{icon}</div>}

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
  <div className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-3 sm:px-4 py-4">
    <div className="flex-1">
      <p className="text-sm font-semibold text-slate-800">{label}</p>

      {description && (
        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
          {description}
        </p>
      )}
    </div>

    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative h-7 w-12 rounded-full transition shrink-0 ${
        checked ? "bg-indigo-500 hover:bg-indigo-600" : "bg-slate-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
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

  const chipNormal = isIncome
    ? "bg-[#eef6ee] text-green-700 border border-green-200"
    : "bg-[#fef0f0] text-red-600 border border-red-200";

  const chipEditing = isIncome
    ? "bg-green-100 text-green-800 border border-green-300 cursor-pointer hover:bg-green-200"
    : "bg-red-100 text-red-700 border border-red-300 cursor-pointer hover:bg-red-200";

  return (
    <div className="bg-white rounded-2xl shadow p-4 min-h-[140px]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-semibold text-slate-600">{title}</p>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleEdit}
            className={`text-[13px] font-semibold transition ${
              isEditing
                ? "text-indigo-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {isEditing ? "Done" : "Edit"}
          </button>

          <button
            onClick={onAdd}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
          >
            +
          </button>
        </div>
      </div>

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
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium transition select-none ${
              isEditing ? chipEditing : chipNormal
            }`}
          >
            <span>{b.name}</span>

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

/* -------------------------------------------------------------------------- */
/*                                   SETTINGS                                 */
/* -------------------------------------------------------------------------- */

const Settings = () => {
  const [activeTab, setActiveTab] = useState("alerts");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [savingCategory, setSavingCategory] = useState(false);

  const [settings, setSettings] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    currency: "INR",
    monthly_budget: "",
    email_notifications: true,
    push_notifications: false,
    budget_alerts: true,
  });

  const [budgets, setBudgets] = useState([]);

  const [isEditingIncome, setIsEditingIncome] = useState(false);

  const [isEditingExpense, setIsEditingExpense] = useState(false);

  const [isEditingAlerts, setIsEditingAlerts] = useState(false);

  const [isEditingCurrency, setIsEditingCurrency] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const [budgetFormType, setBudgetFormType] = useState("income");

  const [newBudget, setNewBudget] = useState({
    name: "",
    amount: "",
  });

  /* -------------------------------------------------------------------------- */
  /*                                   API                                      */
  /* -------------------------------------------------------------------------- */

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setBudgets(res.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

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
        currency: data.currency || "INR",
        monthly_budget: data.monthly_budget || "",
        email_notifications: data.email_notifications ?? true,
        push_notifications: data.push_notifications ?? false,
        budget_alerts: data.budget_alerts ?? true,
      });
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSettings();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                   SAVE                                     */
  /* -------------------------------------------------------------------------- */

  const saveAlerts = async () => {
    try {
      setSaving(true);

      await updateMySettings({
        email_notifications: settings.email_notifications,
        push_notifications: settings.push_notifications,
        budget_alerts: settings.budget_alerts,
      });

      toast.success("Alert settings updated");
    } catch {
      toast.error("Failed to update alerts");
    } finally {
      setSaving(false);
    }
  };

  const saveCurrency = async () => {
    try {
      setSaving(true);

      await updateMySettings({
        currency: settings.currency,
      });

      toast.success("Currency updated");
    } catch {
      toast.error("Failed to update currency");
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      await updateMySettings({
        name: settings.name,
        email: settings.email,
        phone_number: settings.phone_number,
        password: settings.password,
      });

      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   UI                                       */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-white">
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-10 py-4 sm:py-6">
        <div className="w-full max-w-7xl mx-auto space-y-5 sm:space-y-6">
          {/* Intro Card */}
          <PageCard className="px-4 sm:px-6 py-5 sm:py-6">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-slate-800 leading-tight">
              Settings
            </h2>

            <p className="mt-2 text-sm sm:text-base text-slate-500 leading-relaxed">
              Manage your alerts, currency, monthly budget, and account
              details.
            </p>
          </PageCard>

          {/* Tabs */}
          <PageCard className="px-2 sm:px-3 py-2 overflow-hidden">
            <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-2 pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-2 sm:px-5 py-2 sm:py-3 text-[11px] sm:text-sm font-semibold transition-all duration-200 text-center leading-tight ${
                    activeTab === tab.id
                      ? "bg-indigo-500 text-white shadow-md"
                      : "bg-white/70 text-slate-700 shadow-sm hover:bg-slate-200"
                  }`}
                >
                  <span className="sm:hidden">{tab.label}</span>
                  <span className="hidden sm:inline">{tab.fullLabel}</span>
                </button>
              ))}
            </div>
          </PageCard>

          {/* Content */}
          <PageCard className="px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 overflow-hidden">
            {loading ? (
              <div className="py-10 text-sm text-slate-500">
                Loading settings...
              </div>
            ) : (
              <>
                {/* ALERTS */}
                {activeTab === "alerts" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-800">
                        Alert / Notification Settings
                      </h3>

                      <button
                        onClick={() =>
                          setIsEditingAlerts((prev) => !prev)
                        }
                        className="text-sm font-semibold text-indigo-600"
                      >
                        {isEditingAlerts ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <ToggleRow
                        label="Email Notifications"
                        description="Receive updates by email."
                        checked={settings.email_notifications}
                        disabled={!isEditingAlerts}
                        onChange={() =>
                          setSettings((prev) => ({
                            ...prev,
                            email_notifications:
                              !prev.email_notifications,
                          }))
                        }
                      />

                      <ToggleRow
                        label="Push Notifications"
                        description="Get alerts inside app."
                        checked={settings.push_notifications}
                        disabled={!isEditingAlerts}
                        onChange={() =>
                          setSettings((prev) => ({
                            ...prev,
                            push_notifications:
                              !prev.push_notifications,
                          }))
                        }
                      />
                    </div>

                    {isEditingAlerts && (
                      <SaveButton
                        onClick={saveAlerts}
                        saving={saving}
                        text="Save Alerts"
                      />
                    )}
                  </div>
                )}

                {/* CURRENCY */}
                {activeTab === "currency" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-800">
                        Default Currency
                      </h3>

                      <button
                        onClick={() =>
                          setIsEditingCurrency((prev) => !prev)
                        }
                        className="text-sm font-semibold text-indigo-600"
                      >
                        {isEditingCurrency ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    <div className="w-full max-w-2xl bg-slate-50 rounded-xl px-3 sm:px-4 py-3">
                      <SelectField
                        label="Choose Currency"
                        value={settings.currency}
                        disabled={!isEditingCurrency}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            currency: e.target.value,
                          }))
                        }
                        options={currencies}
                        icon={<BadgeDollarSign size={18} />}
                      />
                    </div>

                    {isEditingCurrency && (
                      <SaveButton
                        onClick={saveCurrency}
                        saving={saving}
                        text="Save Currency"
                      />
                    )}
                  </div>
                )}

                {/* BUDGET */}
                {activeTab === "budget" && (
                  <div className="space-y-6">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-800">
                      Monthly Budget Settings
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <BudgetPanel
                        title="Income Budget"
                        type="income"
                        budgets={budgets.filter(
                          (b) => b?.type === "income"
                        )}
                        isEditing={isEditingIncome}
                        onToggleEdit={() =>
                          setIsEditingIncome((prev) => !prev)
                        }
                        onAdd={() => {
                          setBudgetFormType("income");
                          setShowBudgetForm(true);
                        }}
                        onEditChip={(b) => {}}
                        onDeleteChip={async (b) => {
                          try {
                            await API.delete(`/categories/${b.id}`);
                            await fetchCategories();
                            toast.success("Category deleted");
                          } catch {
                            toast.error("Failed to delete");
                          }
                        }}
                      />

                      <BudgetPanel
                        title="Expense Budget"
                        type="expense"
                        budgets={budgets.filter(
                          (b) => b?.type === "expense"
                        )}
                        isEditing={isEditingExpense}
                        onToggleEdit={() =>
                          setIsEditingExpense((prev) => !prev)
                        }
                        onAdd={() => {
                          setBudgetFormType("expense");
                          setShowBudgetForm(true);
                        }}
                        onEditChip={(b) => {}}
                        onDeleteChip={async (b) => {
                          try {
                            await API.delete(`/categories/${b.id}`);
                            await fetchCategories();
                            toast.success("Category deleted");
                          } catch {
                            toast.error("Failed to delete");
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* PROFILE */}
                {activeTab === "profile" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-800">
                        Profile / Account Settings
                      </h3>

                      <button
                        onClick={() =>
                          setIsEditingProfile((prev) => !prev)
                        }
                        className="text-sm font-semibold text-indigo-600"
                      >
                        {isEditingProfile ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        label="Full Name"
                        value={settings.name}
                        disabled={!isEditingProfile}
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
                        value={settings.email}
                        disabled={!isEditingProfile}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Enter email"
                        icon={<Mail size={18} />}
                      />

                      <Field
                        label="Phone Number"
                        value={settings.phone_number}
                        disabled={!isEditingProfile}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            phone_number: e.target.value,
                          }))
                        }
                        placeholder="Enter phone number"
                        icon={<Smartphone size={18} />}
                      />

                      <Field
                        label="Password"
                        type="password"
                        value={settings.password}
                        disabled={!isEditingProfile}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        placeholder="New password"
                        icon={<Lock size={18} />}
                      />
                    </div>

                    {isEditingProfile && (
                      <SaveButton
                        onClick={saveProfile}
                        saving={saving}
                        text="Save Profile"
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </PageCard>
        </div>
      </div>

      {/* ADD BUDGET MODAL */}
      {showBudgetForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
              Add {budgetFormType === "income" ? "Income" : "Expense"} Budget
            </h3>

            <input
              placeholder="Enter category name"
              value={newBudget.name}
              onChange={(e) =>
                setNewBudget({
                  ...newBudget,
                  name: e.target.value,
                })
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBudgetForm(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!newBudget.name.trim()) return;
                  try {
                    setSavingCategory(true);
                    await API.post("/categories", {
                      name: newBudget.name.trim(),
                      type: budgetFormType,
                    });
                    await fetchCategories();
                    setNewBudget({ name: "", amount: "" });
                    setShowBudgetForm(false);
                    toast.success("Category added");
                  } catch {
                    toast.error("Failed to add category");
                  } finally {
                    setSavingCategory(false);
                  }
                }}
                disabled={!newBudget.name.trim() || savingCategory}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold disabled:opacity-60"
              >
                {savingCategory ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;