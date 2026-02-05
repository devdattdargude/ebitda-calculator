import { StorageService } from "./storage.js";

export const DashboardService = {

  scenarioTrend() {
    const rows = StorageService.getAll();

    return {
      labels: rows.map(r => r.name),
      values: rows.map(r => Number(r.results.ebitda))
    };
  },

  propertyBreakdown() {
    const rows = StorageService.getAll();
    const map = {};

    rows.forEach(r => {
      map[r.property] = (map[r.property] || 0) +
        Number(r.results.ebitda);
    });

    return {
      labels: Object.keys(map),
      values: Object.values(map)
    };
  },

  count() {
    return StorageService.getAll().length;
  },

  averageEBITDA() {
    const rows = StorageService.getAll();
    if (!rows.length) return 0;

    const sum = rows.reduce(
      (a,r) => a + Number(r.results.ebitda),
      0
    );

    return sum / rows.length;
  }

};
