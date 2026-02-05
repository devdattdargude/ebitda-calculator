import { VarianceService }
 from "../services/variance-service.js";

export function renderVariance(prop) {

  const v =
   VarianceService.byProperty(prop);

  if (!v) {
    varianceOutput.innerText =
      "Need approved Budget & Actual";
    return;
  }

  varianceOutput.innerText =
    `Budget: ${v.budget}
Actual: ${v.actual}
Variance: ${v.variance}
Variance %: ${v.variancePct.toFixed(2)}%`;
}
