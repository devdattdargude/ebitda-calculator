import { DashboardService } from "../../src/services/dashboard.js";

const c = DashboardService.count();
console.assert(typeof c === "number");
