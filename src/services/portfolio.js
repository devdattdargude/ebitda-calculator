import { StorageService } from "./storage.js";

export const PortfolioService = {

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
