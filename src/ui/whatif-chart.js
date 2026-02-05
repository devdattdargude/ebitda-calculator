import { WhatIfService }
 from "../services/whatif-service.js";

export function runSensitivitySweep(base) {

  return [
    +10, -10
  ].map(p =>
    WhatIfService.buildVariant(
      base,
      {revPct:p,costPct:0,salaryPct:0}
    )
  );
}

export function renderSensitivityChart(canvasId) {

  const all = runSensitivitySweep(
    FinanceEngine.calculateAll()
  );

  const ctx = document.getElementById(canvasId).getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Revenue +10%", "Revenue -10%", "Cost +10%", "Cost -10%"],
      datasets: [{
        label: "EBITDA",
        data: all.map(s => s.ebitda),
        borderColor: "rgba(75,192,192,75,192)",
        fill: false
      }]
    }
  });
}
