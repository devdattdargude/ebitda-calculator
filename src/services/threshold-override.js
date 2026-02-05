import { AlertRules }
 from "../../config/alert-rules.js";

export const ThresholdOverride = {

  getRules() {

    if (RoleService.isAdmin()) {
      return {
        EBITDA_DROP_PERCENT: 10,
        COST_OVERRUN_PERCENT: 10,
        REVENUE_SHORTFALL_PERCENT: 5,
        PER_BED_MIN_EBITDA: 1000
      };
    }

    return AlertRules;
  }

};
