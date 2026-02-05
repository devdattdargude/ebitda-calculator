const KEY = "ebitda_scenarios_v1";

import { RoleService } from "./role-service.js";
import { UserService } from "./user-service.js";

export const StorageService = {

  saveScenario(name, data, results, property) {
    const all = this.getAll();
    const scenarioId = Date.now();
    
    const scenario = {
      id: scenarioId,
      property,
      name,
      owner: UserService.currentUser?.name || "unknown",
      ownerId: UserService.currentUser?.id || "na",
      ts: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scenarioType: scenarioType.value,
      audit: {
        role: RoleService.currentRole,
        version: "v6",
        savedAt: new Date().toISOString(),
        approvalStatus: scenario.status
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
        savedAt: new Date().toISOString(),
        approvalStatus: scenario.status
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

  filterByOwner(name) {
    return this.getAll()
      .filter(s => s.owner === name);
  },

  saveExternal(s) {

    const all = this.getAll();
    const existing = all.find(x => x.id === s.id);

    if (!existing) {
      all.push(s);
      localStorage.setItem(
        this.key,
        JSON.stringify(all)
      );
    } else if (existing.updatedAt < s.updatedAt) {
      const index = all.findIndex(x => x.id === s.id);
      all[index] = s;
      localStorage.setItem(
        this.key,
        JSON.stringify(all)
      );
    }
  },

  clearAll() {
    localStorage.removeItem(KEY);
  }

};
