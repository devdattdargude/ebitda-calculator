import { StorageService } from "../../src/services/storage.js";

StorageService.saveScenario("test",{a:1},{b:2});
console.assert(
  StorageService.getAll().length > 0,
  "Storage failed"
);
