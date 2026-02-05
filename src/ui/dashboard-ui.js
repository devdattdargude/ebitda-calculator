import { DashboardService } from "../services/dashboard.js";
import { ExecutiveService } from "../services/executive-service.js";

let trendChart;
let propertyChart;

export function renderTrendChart(canvasId) {

  const approved = ExecutiveService.approvedOnly();

  const ctx = document.getElementById(canvasId).getContext("2d");

  if (trendChart) trendChart.destroy();

  trendChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: approved.map(s => s.property),
      datasets: [{
        label: "EBITDA Trend",
        data: approved.map(s => s.results.ebitda)
      }]
    }
  });
}

export function renderPropertyChart(canvasId) {

  const approved = ExecutiveService.approvedOnly();

  const ctx = document.getElementById(canvasId).getContext("2d");

  if (propertyChart) propertyChart.destroy();

  propertyChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: approved.map(s => s.property),
      datasets: [{
        label: "EBITDA by Property",
        data: approved.map(s => s.results.ebitda)
      }]
    }
  });
}
