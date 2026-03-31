import React, { useState, useEffect, useRef } from "react";
import dot_icon from "../assets/three-dots-vertical-svgrepo-com.svg";
import tick_icon from "../assets/tick-circle-svgrepo-com.svg";

const TransactionCard = ({
  data,
  onDelete,
  onEdit,
  onView,
  isDeleteMode,
  toggleSelect,
  selectedIds,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  const isIncome = data.type?.toLowerCase() === "income";

  const getCategoryColor = () => {
    if (isIncome) return "bg-green-500";

    switch (data.category?.toLowerCase()) {
      case "food":
        return "bg-orange-500";
      case "travel":
        return "bg-blue-500";
      case "shopping":
        return "bg-purple-500";
      default:
        return "bg-red-500";
    }
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={menuRef}
      onClick={() => {
        if (isDeleteMode) {
          toggleSelect(data.id || data._id);
        }
      }}
      className={`relative p-3 pl-4 rounded-xl shadow-sm hover:shadow-md transition border w-full cursor-pointer ${
        selectedIds.includes(data.id || data._id)
          ? "bg-blue-100 border-blue-400"
          : "bg-white"
      }`}
    >
      <div
        className={`absolute left-0 top-0 h-full w-3 ${getCategoryColor()}`}
        style={{
          borderTopLeftRadius: "1rem",
          borderBottomLeftRadius: "1rem",
        }}
      />

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-gray-800 capitalize mb-1">
            {data.category || "General"}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"
        >
          <img src={dot_icon} alt="Menu" className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-gray-700 truncate">{data.title || "No Title"}</p>

      <div className="flex justify-between items-end mt-2">
        <p className="text-[14px] text-gray-500">
          {data.date
            ? new Date(data.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              })
            : "No Date"}
        </p>

        <div
          className={`text-sm font-bold px-4 py-1.5 rounded-full whitespace-nowrap flex items-center justify-center ${
            isIncome ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
          }`}
        >
          {isIncome ? "+" : "-"} ₹ {data.amount}
        </div>
      </div>

      {selectedIds.includes(data.id || data._id) && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 rounded-xl">
          <div className="bg-white p-2 rounded-full shadow-md">
            <img src={tick_icon} alt="Selected" className="w-6 h-6" />
          </div>
        </div>
      )}

      {showMenu && (
        <div className="absolute right-2 top-12 bg-white shadow-lg rounded-lg w-28 z-50 border">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(data);
              setShowMenu(false);
            }}
            className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-t-lg"
          >
            View
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(data);
              setShowMenu(false);
            }}
            className="block w-full text-left px-3 py-2 hover:bg-gray-100"
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(data.id || data._id);
              setShowMenu(false);
            }}
            className="block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 rounded-b-lg"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
