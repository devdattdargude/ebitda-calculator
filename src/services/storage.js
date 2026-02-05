// Mock localStorage for Node.js testing
const localStorageMock = {
  storage: {},
  getItem: function(key) { return this.storage[key] || null; },
  setItem: function(key, value) { this.storage[key] = value; },
  removeItem: function(key) { delete this.storage[key]; }
};

const localStorage = typeof window !== 'undefined' ? window.localStorage : localStorageMock;
const KEY = "ebitda_scenarios_v1";

import { RoleService } from "./role-service.js";
import { UserService } from "./user-service.js";

export const StorageService = {

  async load() {
    // Initialize storage if needed
    if (!localStorage.getItem(KEY)) {
      localStorage.setItem(KEY, JSON.stringify([]));
    }
    console.log('StorageService loaded');
  },

  getAll() {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  },

  async getRecentScenarios(limit = 10) {
    const all = this.getAll();
    return all
      .sort((a, b) => new Date(b.updatedAt || b.ts) - new Date(a.updatedAt || a.ts))
      .slice(0, limit)
      .map(s => ({
        ...s,
        ebitda: s.results?.ebitda || 0,
        margin: s.results?.ebitdaMargin || 0,
        type: s.scenarioType || 'Unknown',
        status: s.status || 'Draft'
      }));
  },

  saveScenario(name, data, results, property, scenarioType = 'ACTUAL') {
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
      scenarioType: scenarioType,
      status: 'DRAFT',
      inputs: data,
      results: results,
      audit: {
        role: RoleService.currentRole,
        version: "v6",
        savedAt: new Date().toISOString(),
        approvalStatus: 'DRAFT'
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
        approvalStatus: 'DRAFT'
      }
    });

    all.push(scenario);

    localStorage.setItem(KEY, JSON.stringify(all));
    return scenario;
  },

  saveMIS(report) {

  const mis = {
    type: "MIS_SNAPSHOT",
    generatedAt: new Date().toISOString(),
    report
  };

  const all = this.getAll();
  all.push(mis);

  localStorage.setItem(KEY, JSON.stringify(all));
},

checkAlerts(scenario) {

  const budgets = BudgetService.getAll();

  const alerts = AlertService.checkScenario(scenario, budgets);

  if (alerts.length > 0) {
    AlertLogService.store(scenario.id, alerts);
  }

  return alerts;
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

// Export as ScenarioService for compatibility
export const ScenarioService = StorageService;
