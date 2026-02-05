import { ForecastService }
 from "../services/forecast-service.js";
import { StorageService }
 from "./storage.js";

export const ForecastVsActualService = {

  byProperty(property) {

    const all = StorageService.getAll()
      .filter(s =>
        s.property === property &&
        s.status === "APPROVED"
      );

  const forecast = all.find(s =>
      s.scenarioType === "FORECAST");

  const actual = all.find(s =>
        s.scenarioType === "ACTUAL");

    if (!forecast || !actual) return null;

  return {
    budget: forecast.results.ebitda,
    actual: actual.results.ebitda,
    variance: actual.results.ebitda -
        forecast.results.ebitda,
    variancePct:
      forecast.results.ebitda === 0
        ? 0
       : (actual.results.ebitda /
         forecast.results.ebitda) * 100
  };
  }

};
