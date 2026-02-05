import { ImportService }
  from "../services/import-service.js";

import { CalculatorController }
  from "./calculator.js";

export function importExcelFile(file) {

  ImportService.readFile(file, data => {

    if (!data.Revenue || !data.Opex) {
      alert("Template invalid");
      return;
    }

    CalculatorController.loadInputs(data);

    CalculatorController.calculateAll();
  });

}
