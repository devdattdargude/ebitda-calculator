import { StorageService }
 from "./storage.js";
import { BudgetService }
 from "./budget-service.js";
import { ForecastService }
 from "./forecast-service.js";

export const MISReportService = {

  buildReport({
    scenarios,
    budgets,
    forecasts
  }) {

    const approved =
      scenarios.filter(s => s.status === "APPROVED");

    const totalEbitda =
      approved.reduce(
        (a,b)=>a+b.results.ebitda,0
      );

    return {
      generatedAt: new Date().toISOString(),
      reportVersion: timestamp,
      kpis: {
        scenarioCount: approved.length,
        totalEbitda,
        avgEbitda:
          approved.length
            ? totalEbitda/approved.length
            : 0
      },
      scenarios: approved,
      budgets: budgets,
      forecasts: forecasts,
      properties: this.buildPropertySection(approved),
      alerts: AlertLogService.getAll()
    };
  },

  buildPropertySection(approved) {

    const propertyMap = {};

    approved.forEach(s => {
      if (!propertyMap[s.property]) {
        propertyMap[s.property] = {
          ebitda: 0,
          count: 0
        };
      }
      propertyMap[s.property].ebitda += s.results.ebitda;
      propertyMap[s.property].count++;
    });

    return Object.entries(propertyMap)
      .map(([prop, data]) => ({
        property: prop,
        ebitda: data.ebitda,
        scenarios: data.count
      }));
  }

};
