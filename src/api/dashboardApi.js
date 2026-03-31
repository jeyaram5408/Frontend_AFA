import API from "./apiClient";

export const getDashboardData = async () => {
  const [dashboardRes, healthRes] = await Promise.all([
    API.get("/dashboard"),
    API.get("/financial-health"),
  ]);

  const dashboard = dashboardRes.data || {};
  const health = healthRes.data?.data || {};

  return {
    income: Number(dashboard.income) || 0,
    expense: Number(dashboard.expense) || 0,
    savings: Number(dashboard.savings) || 0,
    chartData: dashboard.chartData || [],

    score: Number(health.final_score ?? health.base_score ?? dashboard.score ?? 0),
    final_score: Number(health.final_score ?? health.base_score ?? dashboard.score ?? 0),
    health_label: health.health_label || health.base_label || "No Data",
    summary: health.summary || "",
    actions: Array.isArray(health.actions) ? health.actions : [],
    adjustment_reason: health.adjustment_reason || "",
    ai_adjustment: Number(health.ai_adjustment) || 0,
  };
};
