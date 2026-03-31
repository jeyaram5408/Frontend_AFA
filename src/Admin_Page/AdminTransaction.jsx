import React, { useEffect, useState } from "react";
import { getAdminTransactions, deleteAdminTransaction } from "../api/adminApi";
import { FaSearch, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [search, type, page]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await getAdminTransactions({ search, type: type || undefined, page, page_size: 10 });
      setTransactions(res.data.items || []);
      setTotalPages(res.data.total_pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteAdminTransaction(id);
      fetchTransactions();
    } catch (err) {
      alert(err?.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
        <p className="text-sm text-gray-500 mt-1">All platform transactions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search title, user..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["#", "Title", "User", "Category", "Type", "Amount", "Date", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400 text-sm">Loading...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400 text-sm">No transactions found</td></tr>
              ) : (
                transactions.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-500">{(page - 1) * 10 + idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{t.title}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-gray-800">{t.user_name}</p>
                        <p className="text-xs text-gray-400">{t.user_email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs font-semibold w-fit px-2.5 py-1 rounded-full ${
                        t.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {t.type === "income" ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                        {t.type}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm font-bold ${
                      t.type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {t.type === "income" ? "+" : "-"}₹{Number(t.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{t.date}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <FaTrash size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200">← Previous</button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransactions;
