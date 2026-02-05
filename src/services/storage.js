const KEY = "ebitda_scenarios_v1";

import { RoleService } from "./role-service.js";

export const StorageService = {

  saveScenario(name, data, results, property) {
    const all = this.getAll();
    const scenarioId = Date.now();
    
    const scenario = {
      id: scenarioId,
      property,
      name,
      ts: new Date().toISOString(),
      audit: {
        role: RoleService.currentRole,
        version: "v6",
        savedAt: new Date().toISOString()
      }
    };

    scenario.versions = scenario.versions || [];

    scenario.versions.push({
      timestamp: new Date().toISOString(),
      inputs: data,
      results,
      audit: {
        role: RoleService.currentRole,
        version: "v6",
        savedAt: new Date().toISOString()
      }
    });

    all.push(scenario);

    localStorage.setItem(KEY, JSON.stringify(all));
  },

  getAll() {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  },

  getScenarioVersions(id) {
    const all = this.getAll();
    return all.find(s => s.id === id)?.versions || [];
  },

  clearAll() {
    localStorage.removeItem(KEY);
  }

};
