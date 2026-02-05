import { ImportService }
 from "../../src/services/import-service.js";

const m =
 ImportService.mapRows([
   {Field:"Revenue",Value:100}
 ]);

console.assert(m.Revenue === 100);
