import React, { useState, useEffect, useMemo } from "react";

import { getCategories } from "../api/categoryApi";
import TransactionCard from "../components/TransactionCard";

import delete_icon from "../assets/delete-alt-2-svgrepo-com.svg";

import { useNavigate, useLocation } from "react-router-dom";

import { toast } from "react-toastify";

import {
  getTransactions,
  createTransaction,
  deleteTransactionApi,
  updateTransactionApi,
  
} from "../api/transactionApi";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const location = useLocation();
  const [selectedIds, setSelectedIds] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const [editData, setEditData] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [viewData, setViewData] = useState(null);
  const [showView, setShowView] = useState(false);
  const [categories, setCategories] = useState({
    income: [],
    expense: [],
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const inputStyle = "w-full border p-2 rounded h-12";

  useEffect(() => {
    if (location.state?.openExpense) {
      setType("expense");
      setShowForm(true);
    }
  }, [location.state]);
  // =============================
  // FETCH TRANSACTIONS
  // =============================
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await getTransactions();

      console.log("API DATA:", res.data); // 👈 DEBUG

      const apiData = res.data?.data ?? res.data ?? [];
      setTransactions(Array.isArray(apiData) ? apiData : []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load transactions ❌");
    } finally {
      setLoading(false);
    }
  };
  const handleEditSave = async () => {
  await updateTransactionApi(editData.id, {
    title: editData.title,
    amount: parseFloat(editData.amount),
    category: editData.category,
    date: editData.date,
    type: editData.type,
  });
  await fetchTransactions(); // re-fetch pannu
  setShowEdit(false);
  toast.success("Updated ✅");
};
  // =============================
  // LAST 1 MONTH FILTER
  // =============================
  const lastMonthTransactions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    lastMonth.setHours(0, 0, 0, 0);

    return (transactions || []).filter((t) => {
      if (!t.date) return false;

      const tDate = new Date(t.date.split("T")[0]);
      tDate.setHours(0, 0, 0, 0);

      return tDate >= lastMonth && tDate <= today;
    });
  }, [transactions]);

  const lastMonthIncome = lastMonthTransactions
    .filter((t) => t.type?.toLowerCase() === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const lastMonthExpense = lastMonthTransactions
    .filter((t) => t.type?.toLowerCase() === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  // =============================
  // LAST 7 DAYS TOTAL
  // =============================

  const last7DaysTransactions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 7);
    last7Days.setHours(0, 0, 0, 0);

    return (transactions || [])
      .filter((t) => {
        if (!t.date) return false;

        // 🔥 ALWAYS safe parsing
        const tDate = new Date(t.date.split("T")[0]);
        tDate.setHours(0, 0, 0, 0);

        return tDate >= last7Days && tDate <= today;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions]);

  const last7DaysIncome = last7DaysTransactions
    .filter((t) => t.type?.toLowerCase() === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const last7DaysExpense = last7DaysTransactions
    .filter((t) => t.type?.toLowerCase() === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);
  // =============================
  // CATEGORIES
  // =============================
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();

      const income = res.data.filter((c) => c.type === "income");
      const expense = res.data.filter((c) => c.type === "expense");

      setCategories({
        income,
        expense,
      });
    } catch (err) {
      console.error("Category fetch error:", err);
    }
  };

  useEffect(() => {
    if (categories[type]?.length > 0) {
      setCategory(categories[type][0].name); // ⚠️ FIX
    } else {
      setCategory("");
    }
  }, [type, categories]);

  // =============================
  // VALIDATION
  // =============================
  const validate = () => {
    let newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!category) newErrors.category = "Category is required";
    if (!amount) newErrors.amount = "Amount is required";
    else if (Number(amount) <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (!date) newErrors.date = "Date is required";
    console.log("VALIDATION ERRORS:", newErrors); // 👈 ADD THIS

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =============================
  // ADD TRANSACTION
  // =============================
  // const addTransaction = async () => {
  //   if (!validate()) return;

  //   try {
  //     const res = await createTransaction({
  //       type: type.toLowerCase(),
  //       amount: parseFloat(amount),
  //       title,
  //       category,
  //       date: date,
  //     });
  //     setShowForm(false);

  //     toast.success("Transaction Added ✅");

  //     // 🔥 IMPORTANT FIX
  //     const newTransaction = res.data?.data || res.data;

  //     setTransactions((prev) => [newTransaction, ...prev]);

  //     // reset form
  //     setAmount("");
  //     setTitle("");
  //     setDate("");
  //     // setCategory(categories[type]?.[0]?.name || "");
  //     setErrors({});
  //     setShowForm(false);
  //   } catch (err) {
  //     console.error("Add error:", err);
  //     toast.error("Failed to add transaction ❌");
  //   }
  // };
  const addTransaction = async () => {
    if (!validate()) return;

    try {
      await createTransaction({
        type: type.toLowerCase(),
        amount: parseFloat(amount),
        title,
        category,
        date,
      });

      toast.success("Transaction Added ✅");
      console.log("🔥 ADD FUNCTION CALLED");

      await fetchTransactions(); // ✅ always correct UI

      setAmount("");
      setTitle("");
      setDate("");
      setErrors({});
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add transaction ❌");
    }
  };

  // =============================
  // DELETE LOGIC
  // =============================
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // =============================
  // TOTALS
  // =============================
  const income = (transactions || [])
    .filter((t) => t.type?.toLowerCase() === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expense = (transactions || [])
    .filter((t) => t.type?.toLowerCase() === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  return (
    <div className="space-y-5 sm:space-y-10 px-3 sm:px-6 py-4 sm:py-6 bg-gray-50 min-h-screen">
      {/* <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button> */}
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
          Manage Transactions
        </h2>
        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => {
              setType("income");
              setShowForm(true);
            }}
            className="flex-1 sm:flex-none bg-green-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition cursor-pointer text-sm sm:text-base"
          >
            + Income
          </button>
          <button
            onClick={() => {
              setType("expense");
              setShowForm(true);
            }}
            className="flex-1 sm:flex-none bg-red-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-red-700 transition cursor-pointer text-sm sm:text-base"
          >
            + Expense
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="p-3 sm:p-6 bg-green-100 rounded-2xl">
          <h3 className="text-xs sm:text-base">Total Income</h3>
          <p className="text-base sm:text-2xl font-bold">
            ₹ {income.toLocaleString()}
          </p>
        </div>
        <div className="p-3 sm:p-6 bg-red-100 rounded-2xl">
          <h3 className="text-xs sm:text-base">Total Expense</h3>
          <p className="text-base sm:text-2xl font-bold">
            ₹ {expense.toLocaleString()}
          </p>
        </div>
        <div className="p-3 sm:p-6 bg-green-50 rounded-2xl">
          <h3 className="text-xs sm:text-base">Last 7 Days Income</h3>
          <p className="text-base sm:text-2xl font-bold">
            ₹ {last7DaysIncome.toLocaleString()}
          </p>
        </div>
        <div className="p-3 sm:p-6 bg-red-50 rounded-2xl">
          <h3 className="text-xs sm:text-base">Last 7 Days Expense</h3>
          <p className="text-base sm:text-2xl font-bold">
            ₹ {last7DaysExpense.toLocaleString()}
          </p>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white p-4 rounded-xl shadow border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Last 7 Days Transactions</h3>

          <div className="flex gap-3">
            {last7DaysTransactions.length > 0 &&
              (!isDeleteMode ? (
                <button
                  onClick={() => setIsDeleteMode(true)}
                  className="bg-white text-white w-16 h-15 px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
                >
                  <img src={delete_icon} alt="Delete" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsDeleteMode(false);
                      setSelectedIds([]);
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={selectedIds.length === 0}
                    onClick={() => setShowConfirm(true)}
                    className={`px-4 py-2 rounded-lg text-white ${
                      selectedIds.length === 0 ? "bg-gray-300" : "bg-red-600"
                    }`}
                  >
                    Confirm Delete ({selectedIds.length})
                  </button>
                </>
              ))}
          </div>
        </div>

        {last7DaysTransactions.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full gap-4">
            <p className="text-gray-500 text-lg font-medium">No Transactions</p>

            <button
              onClick={() => setShowTypeSelector(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Add Transaction
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 items-stretch">
            {" "}
            {last7DaysTransactions.map((t) => {
              const id = t.id || t._id;

              return (
                <TransactionCard
                  key={id}
                  data={t}
                  isDeleteMode={isDeleteMode}
                  toggleSelect={toggleSelect}
                  selectedIds={selectedIds}
                  onDelete={async (id) => {
                    await deleteTransactionApi(id);
                    fetchTransactions();
                    toast.success("Deleted Successfully 🗑️");
                  }}
                  onEdit={(item) => {
                    setEditData(item);
                    setShowEdit(true);
                  }}
                  onView={(item) => {
                    setViewData(item);
                    setShowView(true);
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
      <button
        onClick={() =>
          navigate("/dashboard/history", {
            state: { transactions },
          })
        }
        className="text-gray-600 mt-4 flex items-center gap-1 hover:underline transition cursor-pointer ml-auto"
      >
        View Full History
        <span>→</span>
      </button>
      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-80 rounded-2xl shadow-2xl p-6 animate-scaleIn">
            {/* TITLE */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Delete
            </h2>

            {/* MESSAGE */}
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-500">
                {selectedIds.length}
              </span>{" "}
              transaction(s)?
            </p>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await Promise.all(
                    selectedIds.map((id) => deleteTransactionApi(id)),
                  );

                  fetchTransactions();
                  setSelectedIds([]);
                  setIsDeleteMode(false);
                  setShowConfirm(false);

                  toast.success("Deleted Successfully 🗑️");
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL */}

      {showEdit && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-lg font-bold mb-4">Edit Transaction</h2>

            <input
              type="number"
              value={editData.amount}
              onChange={(e) =>
                setEditData({ ...editData, amount: e.target.value })
              }
              className="w-full border p-2 mb-3"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEdit(false)}>Cancel</button>

              <button
                onClick={async () => {
                  // ⚠️ temp update (later backend API add pannalam)
                  setTransactions((prev) =>
                    prev.map((t) =>
                      (t.id || t._id) === (editData.id || editData._id)
                        ? editData
                        : t,
                    ),
                  );

                  setShowEdit(false);
                  toast.success("Updated ✅");
                }}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* TYPE SELECTOR MODAL */}
      {showTypeSelector && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Select Transaction Type
            </h2>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setType("income");
                  setShowTypeSelector(false);
                  setShowForm(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Income
              </button>

              <button
                onClick={() => {
                  setType("expense");
                  setShowTypeSelector(false);
                  setShowForm(true);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Expense
              </button>
            </div>

            <button
              onClick={() => setShowTypeSelector(false)}
              className="mt-4 text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showView && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-80 rounded-2xl shadow-xl overflow-hidden">
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Transaction Details
              </h2>

              <button
                onClick={() => setShowView(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-5">
              {/* TITLE */}
              <div>
                <p className="text-xs text-gray-400">TITLE</p>
                <p className="text-base font-semibold text-gray-800">
                  {viewData.title}
                </p>
              </div>

              {/* CATEGORY */}
              <div>
                <p className="text-xs text-gray-400">CATEGORY</p>
                <p className="text-sm text-gray-700">{viewData.category}</p>
              </div>

              {/* AMOUNT + TYPE */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">AMOUNT</p>
                  <p
                    className={`text-lg font-bold ${
                      viewData.type === "income"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {viewData.type === "income" ? "+" : "-"} ₹ {viewData.amount}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    viewData.type === "income"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {viewData.type}
                </span>
              </div>

              {/* DATE */}
              <div>
                <p className="text-xs text-gray-400">DATE</p>
                <p className="text-sm text-gray-700">
                  {new Date(viewData.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setShowView(false)}
                className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM (HOME STYLE) */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setShowForm(false)} // ✅ background click close
        >
          <div
            className="bg-white p-8 rounded-2xl w-96 shadow-xl"
            onClick={(e) => e.stopPropagation()} // ✅ prevent inside click
          >
            <h2 className="text-xl font-bold mb-4">
              {type === "income" ? "Add Income" : "Add Expense"}
            </h2>

            <div className="space-y-4">
              {/* TITLE */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`${inputStyle} ${
                    errors.title ? "border-red-500" : ""
                  }`}
                />

                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category <span className="text-red-500">*</span>
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputStyle}
                >
                  {categories[type]?.map((cat, i) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* AMOUNT */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>

                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`${inputStyle} ${
                    errors.amount ? "border-red-500" : ""
                  }`}
                />

                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                )}
              </div>

              {/* DATE */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`${inputStyle} ${
                    errors.date ? "border-red-500" : ""
                  }`}
                />

                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={addTransaction}
                  className={`px-4 py-2 text-white rounded transition ${
                    type === "income"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
