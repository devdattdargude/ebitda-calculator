export const WhatIfService = {

  applyPct(base, pct) {
    return base * (1 + pct/100);
  },

  buildVariant(inputs, deltas) {

    return {
      revenue:
        this.applyPct(
          inputs.revenue,
          deltas.revPct
        ),

      opex:
        this.applyPct(
          inputs.opex,
          deltas.costPct
        ),

      salary:
        this.applyPct(
          inputs.salary,
          deltas.salaryPct
        )
  };

  }

};
