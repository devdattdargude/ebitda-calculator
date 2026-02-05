import { DashboardService } from "../services/dashboard.js";

let trendChart;
let propertyChart;

export function renderTrendChart(canvasId) {

  const d = DashboardService.scenarioTrend();

  if (trendChart) trendChart.destroy();

  trendChart = new Chart(
    document.getElementById(canvasId),
    {
      type: "bar",
      data: {
        labels: d.labels,
        datasets: [{ data: d.values }]
      }
    }
  );
}

export function renderPropertyChart(canvasId) {

  const d = DashboardService.propertyBreakdown();

  if (propertyChart) propertyChart.destroy();

  propertyChart = new Chart(
    document.getElementById(canvasId),
    {
      type: "pie",
      data: {
        labels: d.labels,
        datasets: [{ data: d.values }]
      }
    }
  );
}
