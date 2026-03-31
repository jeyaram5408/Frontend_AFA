export const calculateExpenseForecast = (transactions) => {
  const expenses = transactions.filter((t) => t.type === "expense");

  if (expenses.length === 0) {
    return {
      monthlyAverage: 0,
      nextMonthPrediction: 0,
      sixMonthProjection: 0,
    };
  }

const totalExpense = expenses.reduce(
  (sum, t) => sum + Number(t.amount),
  0
);

const monthlyAverage = totalExpense / expenses.length;
const nextMonthPrediction = monthlyAverage * 1.05;
const sixMonthProjection = monthlyAverage * 6;

return {
  monthlyAverage,
  nextMonthPrediction,
  sixMonthProjection,
}};