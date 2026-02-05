import { AlertRules }
 from "../../config/alert-rules.js";

export const AlertService = {

  checkScenario(
    scenario,
    budget
  ){

    const alerts = [];

    const ebitdaVar =
      variancePercent(
        scenario.results.ebitda,
        budget.ebitda
      );

    if(
      ebitdaVar <
      -AlertRules.EBITDA_DROP_PERCENT
    ){
      alerts.push({
        type: "EBITDA_DROP",
        message:
          "EBITDA below budget threshold"
      });
    }

    if(
      scenario.results.perBed <
      AlertRules.PER_BED_MIN_EBITDA
    ){
      alerts.push({
        type: "LOW_PER_BED",
        message:
          "Per bed EBITDA below safe level"
      });
    }

    return alerts;
  }

};
