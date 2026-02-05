import { AlertRules }
 from "../../config/alert-rules.js";

export const AlertService = {

  async load() {
    // Initialize alerts if needed
    console.log('AlertService loaded');
  },

  async getActiveAlerts() {
    // Mock alerts for testing
    return [
      {
        id: '1',
        severity: 'medium',
        title: 'EBITDA Variance Alert',
        message: 'Property A EBITDA is 15% below budget',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        severity: 'low',
        title: 'Data Sync Reminder',
        message: 'Last data sync was 2 hours ago',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  },

  async dismissAlert(alertId) {
    console.log(`Alert ${alertId} dismissed`);
  },

  async setOverride(enabled) {
    console.log(`Alert override ${enabled ? 'enabled' : 'disabled'}`);
  },

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
