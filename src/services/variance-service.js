import { StorageService }
 from "./storage.js";

export const VarianceService = {

  byProperty(property) {

  const all =
   StorageService.getAll()
    .filter(s =>
      s.property === property &&
      s.status === "APPROVED"
    );

  const budget =
   all.find(s =>
    s.scenarioType === "BUDGET");

  const actual =
   all.find(s =>
    s.scenarioType === "ACTUAL");

  if (!budget || !actual) return null;

  const v =
   actual.results.ebitda -
   budget.results.ebitda;

  return {
   budget: budget.results.ebitda,
   actual: actual.results.ebitda,
   variance: v,
   variancePct:
    budget.results.ebitda === 0
     ? 0
     : v / budget.results.ebitda * 100
  };
 }

};
