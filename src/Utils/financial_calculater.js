export const calculateFinancialHealth = (transactions) => {
  // ===============================
  // Calculate Income
  // ===============================
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  // ===============================
  // Calculate Expense
  // ===============================
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  // ===============================
  // Calculate Savings
  // ===============================
  const savings = income - expense;

  let score = 0;
  let message = "";

  // ===============================
  // Financial Score Logic
  // ===============================
  if (income === 0) {
    score = 0;
    message = "No income recorded. Add income to analyze financial health.";
  } else {
    const savingsRate = (savings / income) * 100;

    // Clamp score between 0 and 100
    score = Math.round(
      Math.min(Math.max(savingsRate, 0), 100)
    );

    if (savingsRate >= 30) {
      message = "Excellent financial health. Great savings habit!";
    } else if (savingsRate >= 20) {
      message = "Good savings habit. You are on the right track.";
    } else if (savingsRate >= 10) {
      message = "Average financial stability. Try improving savings.";
    } else if (savingsRate >= 0) {
      message = "Low savings rate. Consider reducing expenses.";
    } else {
      message = "Expenses exceed income. Immediate financial attention required.";
    }
  }

  return {
    income,
    expense,
    savings,
    score,
    message,
  };
};