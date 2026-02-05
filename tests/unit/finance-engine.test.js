import { FinanceEngine } from "../../src/core/finance-engine.js";

console.assert(
  FinanceEngine.calcEBITDA(1000,200,300) === 500,
  "EBITDA failed"
);
