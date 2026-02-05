import { ForecastService }
 from "../../src/services/forecast-service.js";

console.assert(
 ForecastService.project(100,10,1) === 110
);
