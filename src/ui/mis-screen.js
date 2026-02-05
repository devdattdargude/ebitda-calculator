export function renderMISPreview(report) {

  misOutput.innerHTML = `
    Total EBITDA:
  ${report.kpis.totalEbitda}

    Scenario Count:
  ${report.kpis.scenarioCount}
    Average EBITDA:
    ${report.kpis.avgEbitda}
  `;
}
