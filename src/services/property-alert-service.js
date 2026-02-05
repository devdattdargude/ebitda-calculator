import { AlertService }
 from "./alert-service.js";
import { PortfolioService }
 from "./portfolio.js";

export const PropertyAlertService = {

  checkProperty(property) {

    const portfolio = PortfolioService.byProperty(property);
    const alerts = [];

    if (!portfolio) return alerts;

    portfolio.forEach(scenario => {
      const scenarioAlerts = AlertService.checkScenario(scenario, scenario.budget);
      alerts.push(...scenarioAlerts);
    });

    return alerts;
  }

};
