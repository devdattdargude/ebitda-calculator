import { ForecastService }
 from "../services/forecast-service.js";

export function renderForecastChart(canvasId) {

  const all = ForecastService.getAll();

  const ctx = document.getElementById(canvasId).getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Base", "Forecast"],
      datasets: [{
        label: "Revenue",
        data: all.map(s => s.revenue),
        borderColor: "rgba(75,192,192, 75,192)",
        fill: false
      }, {
        label: "Forecast",
        data: all.map(s => s.forecastEbitda),
        borderColor: "rgba(75,192,75,192,75,192)",
        fill: false
      }]
    }
  });
}
