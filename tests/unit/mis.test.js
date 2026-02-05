import { MISReportService }
 from "../../src/services/mis-report-service.js";

const report = MISReportService.buildReport({
  scenarios: [],
  budgets: [],
  forecasts: []
});

console.assert(
  report.kpis.scenarioCount > 0
);
