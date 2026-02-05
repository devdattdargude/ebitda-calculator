import { FinanceEngine } from "../../src/core/finance-engine.js";

console.assert(
  FinanceEngine.calcCM1(1000,300) === 700,
  "CM1 failed"
);

console.assert(
  FinanceEngine.calcCM2(700,200) === 500,
  "CM2 failed"
);
