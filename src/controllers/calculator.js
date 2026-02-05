import { validateField } from "../core/validation.js";
import { FinanceEngine } from "../core/finance-engine.js";
import { Formatter } from "../utils/formatting.js";
import { StorageService } from "../services/storage.js";
import { FormulaLock } from "../services/formula-lock.js";

export const CalculatorController = {

  validateAll(data) {
    const errors = {};

    for (const key in data) {
      const err = validateField(key, data[key]);
      if (err) errors[key] = err;
    }

    return errors;
  },

  calculateAll(data) {

    if (!FormulaLock.isLocked()) {
      console.warn("Formula unlocked mode");
    }

    const clean = {};
    for (const k in data) {
      clean[k] = Formatter.sanitizeNumber(data[k]);
    }

    const ebitda = FinanceEngine.calcEBITDA(
      clean.revenue,
      clean.opex,
      clean.salary
    );

    const cm1 = FinanceEngine.calcCM1(clean.revenue, clean.variableCosts || 0);
    const cm2 = FinanceEngine.calcCM2(cm1, clean.fixedCosts || 0);

    const opProfit = FinanceEngine.calcOperatingProfit(
      cm2,
      clean.salary
    );

    return {
      ebitda,
      ebitdaMargin: FinanceEngine.calcEBITDAMargin(ebitda, clean.revenue),
      grossMargin: FinanceEngine.calcGrossMargin(clean.revenue, clean.cogs || 0),
      cm1,
      cm2,
      operatingProfit: opProfit,
      perBed: FinanceEngine.calcPerBedEBITDA(ebitda, clean.beds),
      perSeat: FinanceEngine.calcPerSeatEBITDA(ebitda, clean.seats)
    };
  },

  resetAll() {
    document.querySelectorAll("input").forEach(i => i.value = "");
  },

  loadInputs(data) {

    Object.keys(data).forEach(k => {
      const el = document.querySelector(
        `[name="${k}"]` 
      );

      if (el) el.value = data[k];
    });

    if (data.ScenarioName) {
      scenarioNameInput.value =
        data.ScenarioName;
    }
  },

  saveRun(name, data, results, property) {
    StorageService.saveScenario(name, data, results, property);
  }

};
