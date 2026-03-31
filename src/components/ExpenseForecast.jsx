import React from "react";

const ExpenseForecast = ({ forecast }) => {
  return (
    <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow">
      <h3 className="text-lg font-semibold">Expense Forecast</h3>

      <div className="mt-4 space-y-2">
        <p>
          Monthly Avg: ₹{(forecast?.monthly_avg || 0).toFixed(2)}
        </p>
        <p>
          Next Month: ₹{(forecast?.next_month || 0).toFixed(2)}
        </p>
        <p>
          6 Month: ₹{(forecast?.six_month || 0).toFixed(2)}
        </p>
      </div>
    </div>
      
  );
};

export default ExpenseForecast;