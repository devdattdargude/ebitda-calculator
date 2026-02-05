const KEY = "ebitda_scenarios_v1";

export const StorageService = {

  saveScenario(name, data, results) {
    const all = this.getAll();

    all.push({
      id: Date.now(),
      name,
      data,
      results,
      ts: new Date().toISOString()
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
