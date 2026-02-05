export const ForecastService = {

  project(base, growthPct, periods) {

  const g = growthPct / 100;

  return base * Math.pow(1 + g, periods);
  },

  buildForecast(inputs, drivers) {

  return {
    revenue:
      this.project(
        inputs.revenue,
        drivers.revGrowth,
        drivers.periods
      ),

    opex:
      this.project(
        inputs.opex,
        drivers.costGrowth,
        drivers.periods
      ),

    salary:
      this.project(
        inputs.salary,
        drivers.costGrowth,
        drivers.periods
      )
  };

  }

};
