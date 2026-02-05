import { StorageService } from "./storage.js";

export const PortfolioService = {

  async load() {
    console.log('PortfolioService loaded');
  },

  async getTotals() {
    const rows = StorageService.getAll();
    const sum = rows.reduce((acc, r) => {
      acc.ebitda += Number(r.results?.ebitda || 0);
      acc.count += 1;
      if (r.property) {
        acc.properties.add(r.property);
      }
      return acc;
    }, { ebitda: 0, count: 0, properties: new Set() });

    return {
      ebitda: sum.ebitda,
      properties: sum.properties.size,
      margin: sum.ebitda > 0 ? (sum.ebitda / (rows.reduce((a, r) => a + Number(r.inputs?.revenue || 0), 0))) * 100 : 0
    };
  },

  async getTrendData() {
    const rows = StorageService.getAll();
    return {
      labels: rows.map(r => r.name || 'Unknown'),
      values: rows.map(r => Number(r.results?.ebitda || 0))
    };
  },

  async getPropertyPerformance() {
    const rows = StorageService.getAll();
    const map = {};

    rows.forEach(r => {
      if (!map[r.property]) {
        map[r.property] = 0;
      }
      map[r.property] += Number(r.results?.ebitda || 0);
    });

    return {
      labels: Object.keys(map),
      values: Object.values(map)
    };
  },

  totals() {
    const rows = StorageService.getAll();

    const sum = rows.reduce((acc, r) => {
      acc.ebitda += Number(r.results.ebitda || 0);
      acc.count += 1;
      return acc;
    }, { ebitda: 0, count: 0 });

    return sum;
  },

  byProperty() {
    const rows = StorageService.getAll();

    const map = {};

    rows.forEach(r => {
      if (!map[r.property]) {
        map[r.property] = 0;
      }
      map[r.property] += Number(r.results.ebitda || 0);
    });

    return map;
  }

};
