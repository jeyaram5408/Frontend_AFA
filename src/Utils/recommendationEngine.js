export const generateRecommendations = (income, expenses) => {
  const recommendations = [];
  const savings = income - expenses;

  const recommendedSavings = income * 0.2;

  if (savings < recommendedSavings) {
    recommendations.push(
      `Increase savings by ₹${recommendedSavings - savings} to follow 50-30-20 rule`
    );
  }

  if (expenses > income * 0.7) {
    recommendations.push("Your spending is high. Reduce unnecessary expenses by 10%");
  }

  if (recommendations.length === 0) {
    recommendations.push("Great job! Your financial discipline looks strong.");
  }

  return recommendations;
};