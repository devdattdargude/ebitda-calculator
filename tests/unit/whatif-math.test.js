import { WhatIfService }
 from "../../src/services/whatif-service.js";

const v = WhatIfService.buildVariant(
  {revenue:100},
  {revPct:10}
);

console.assert(v.revenue === 110);
