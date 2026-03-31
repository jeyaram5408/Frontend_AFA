import React, { useEffect, useState } from "react";
import { getTransactionsPaginated } from "../api/transactionApi";

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    fetchHistory();
  }, [currentPage, filter]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getTransactionsPaginated(
        currentPage,
        itemsPerPage,
        filter,
      );

      setTransactions(res.data.data || []);
      setTotalPages(Math.ceil(res.data.total / itemsPerPage));
    } catch (err) {
      console.error(err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Color based on type
  const getCardColor = (type) => {
    return type === "income"
      ? "bg-green-50 border-green-200"
      : "bg-red-50 border-red-200";
  };

  const getAmountColor = (type) => {
    return type === "income" ? "text-green-600" : "text-red-500";
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">Transaction History</h2>

      {/* FILTER */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border px-3 py-2 rounded-lg"
      >
        <option value="all">All</option>
        <option value="7d">Last 7 Days</option>
        <option value="1m">1 Month</option>
        <option value="3m">3 Months</option>
        <option value="6m">6 Months</option>
        <option value="1y">1 Year</option>
      </select>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-10">No Data 🚫</div>
      ) : (
        <>
          {/* GRID */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 ">
            {transactions.map((t) => (
              <div
                key={t.id}
                className={`border rounded-xl p-4 shadow-sm 
transition-all duration-300 ease-in-out 
hover:scale-100 hover:-translate-y-2 hover:shadow-lg 
${getCardColor(t.type)}`}
              >
                {/* TITLE */}
                <h3 className="font-semibold text-gray-800">{t.title}</h3>

                {/* CATEGORY */}
                <p className="text-sm text-gray-600 mt-1">{t.category}</p>

                {/* DATE + TIME */}
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(t.date).toLocaleString()}
                </p>

                {/* AMOUNT */}
                <p
                  className={`font-bold text-lg mt-3 ${getAmountColor(t.type)}`}
                >
                  ₹ {Number(t.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span>
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default History;
