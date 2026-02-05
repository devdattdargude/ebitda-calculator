export const FinanceEngine = {

  calcEBITDA(revenue, opex, salary) {
    return revenue - opex - salary;
  },

  calcEBITDAMargin(ebitda, revenue) {
    if (revenue === 0) return 0;
    return (ebitda / revenue) * 100;
  },

  calcGrossMargin(revenue, cogs) {
    if (revenue === 0) return 0;
    return ((revenue - cogs) / revenue) * 100;
  },

  calcContributionMargin1(revenue, variableCosts) {
    return revenue - variableCosts;
  },

  calcContributionMargin2(cm1, fixedCosts) {
    return cm1 - fixedCosts;
  },

  calcOperatingProfit(ebitda, otherExpenses = 0) {
    return ebitda - otherExpenses;
  },

  calcPerUnitEBITDA(ebitda, units) {
    if (!units || units === 0) return 0;
    return ebitda / units;
  },

  calcCM1(revenue, variableCosts) {
    return revenue - variableCosts;
  },

  calcCM2(cm1, fixedCosts) {
    return cm1 - fixedCosts;
  },

  calcOperatingProfit(cm2, salaries) {
    return cm2 - salaries;
  },

  calcPerBedEBITDA(ebitda, beds) {
    if (!beds || beds === 0) return 0;
    return ebitda / beds;
  },

  calcPerSeatEBITDA(ebitda, seats) {
    if (!seats || seats === 0) return 0;
    return ebitda / seats;
  }

};
