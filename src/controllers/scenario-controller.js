import { CalculatorController } from "./calculator.js";

export const ScenarioController = {

  runScenarioSet(list) {
    return list.map(data => {
      const errors = CalculatorController.validateAll(data);
      if (Object.keys(errors).length > 0) {
        return { errors };
      }
      return CalculatorController.calculateAll(data);
    });
  }

};
