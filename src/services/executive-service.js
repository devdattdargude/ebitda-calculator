import { StorageService } from "./storage.js";

export const ExecutiveService = {

  approvedOnly() {
    return StorageService
      .getAll()
         .filter(s => s.status === "APPROVED");
  },

  totalEBITDA() {
    return this.approvedOnly()
         .reduce((a,s)=>
           a + Number(s.results.ebitda), 0);
  },

  avgMargin() {
    const arr = this.approvedOnly();
    if (!arr.length) return 0;

    return arr.reduce(
           (a,s)=>a+Number(s.results.ebitdaMargin),
           0
         ) / arr.length;
  },

  pendingCount() {
    return StorageService
           .getAll()
           .filter(s=>s.status==="SUBMITTED")
           .length;
  },

  propertyRanking() {

    const map = {};

    this.approvedOnly()
      .forEach(s=>{
        map[s.property] =
           (map[s.property] || 0) +
           Number(s.results.ebitda);
      });

    return Object.entries(map)
      .sort((a,b)=>b[1]-a[1]);
  },

  riskFlags() {

    return this.approvedOnly()
      .filter(s =>
           s.results.ebitda < 0 ||
           s.results.ebitdaMargin < 10
      )
      .map(s => ({
        name: s.name,
        property: s.property
      }));
  }

};
