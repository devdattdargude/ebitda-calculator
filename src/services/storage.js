const KEY = "ebitda_scenarios_v1";

import { RoleService } from "./role-service.js";

export const StorageService = {

  saveScenario(name, data, results, property) {
    const all = this.getAll();

    all.push({
      id: Date.now(),
      property,
      name,
      data,
      results,
      ts: new Date().toISOString(),
      audit: {
        role: RoleService.currentRole,
        version: "v6",
        savedAt: new Date().toISOString()
      }
    });

    localStorage.setItem(KEY, JSON.stringify(all));
  },

  getAll() {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  },

  clearAll() {
    localStorage.removeItem(KEY);
  }

};
