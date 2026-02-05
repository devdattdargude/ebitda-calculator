import { PortfolioService } from "../../src/services/portfolio.js";

const t = PortfolioService.totals();
console.assert(typeof t.ebitda === "number");
