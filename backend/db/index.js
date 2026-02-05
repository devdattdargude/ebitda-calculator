// Mock database for testing - in-memory storage
const mockData = {
  users: [],
  scenarios: [],
  scenario_versions: []
};

module.exports = {
  query: async (text, params) => {
    console.log(`[MOCK DB] Query: ${text}`);
    console.log(`[MOCK DB] Params:`, params);
    
    // Mock different query types
    if (text.includes('insert into users')) {
      const [id, name] = params;
      mockData.users.push({ id, name, created_at: new Date() });
      return { rows: [] };
    }
    
    if (text.includes('select * from scenarios')) {
      return { rows: mockData.scenarios };
    }
    
    if (text.includes('insert into scenarios')) {
      const [id, name, property, ownerId, updatedAt, scenarioType] = params;
      
      // Check if scenario already exists and update instead of duplicate
      const existingScenario = mockData.scenarios.find(s => s.id === id);
      if (existingScenario) {
        // Update existing scenario
        existingScenario.name = name;
        existingScenario.property = property;
        existingScenario.owner_id = ownerId;
        existingScenario.updated_at = updatedAt;
        existingScenario.scenario_type = scenarioType;
      } else {
        // Create new scenario
        const scenario = {
          id, name, property, owner_id: ownerId,
          updated_at: updatedAt, scenario_type: scenarioType,
          status: 'DRAFT', created_at: new Date()
        };
        mockData.scenarios.push(scenario);
      }
      return { rows: [] };
    }
    
    if (text.includes('insert into scenario_versions')) {
      const [id, scenarioId, versionNo, inputs, results, audit] = params;
      mockData.scenario_versions.push({
        id, scenario_id: scenarioId, version_no: versionNo,
        inputs, results, audit, created_at: new Date()
      });
      return { rows: [] };
    }
    
    if (text.includes('select coalesce(max(version_no)')) {
      const [scenarioId] = params;
      const versions = mockData.scenario_versions.filter(v => v.scenario_id === scenarioId);
      const maxVersion = Math.max(0, ...versions.map(v => v.version_no));
      return { rows: [{ coalesce: maxVersion }] };
    }
    
    // Handle approve query specifically (check before generic update)
    if (text.includes('set status=\'APPROVED\'')) {
      const [userId, comment, scenarioId] = params;
      console.log(`[MOCK DB] Approving scenario ${scenarioId} by user ${userId}`);
      const scenario = mockData.scenarios.find(s => s.id === scenarioId);
      if (scenario) {
        console.log(`[MOCK DB] Found scenario, updating status to APPROVED`);
        scenario.status = 'APPROVED';
        scenario.approved_by = userId;
        scenario.approved_at = new Date();
        scenario.approval_comment = comment;
      } else {
        console.log(`[MOCK DB] Scenario not found for approval!`);
      }
      return { rows: [] };
    }
    
    // Handle reject query specifically (check before generic update)
    if (text.includes('set status=\'REJECTED\'')) {
      const [comment, scenarioId] = params;
      console.log(`[MOCK DB] Rejecting scenario ${scenarioId}`);
      const scenario = mockData.scenarios.find(s => s.id === scenarioId);
      if (scenario) {
        console.log(`[MOCK DB] Found scenario, updating status to REJECTED`);
        scenario.status = 'REJECTED';
        scenario.approval_comment = comment;
      } else {
        console.log(`[MOCK DB] Scenario not found for rejection!`);
      }
      return { rows: [] };
    }
    
    // Handle all update scenarios queries (only for submit)
    if (text.includes('update scenarios') && text.includes('set status')) {
      console.log(`[MOCK DB] Processing status update query`);
      const [scenarioId] = params;
      console.log(`[MOCK DB] Looking for scenario with ID: ${scenarioId}`);
      console.log(`[MOCK DB] Available scenarios:`, mockData.scenarios.map(s => s.id));
      const scenario = mockData.scenarios.find(s => s.id === scenarioId);
      if (scenario) {
        console.log(`[MOCK DB] Found scenario, updating status from ${scenario.status} to SUBMITTED`);
        scenario.status = 'SUBMITTED';
      } else {
        console.log(`[MOCK DB] Scenario not found!`);
      }
      return { rows: [] };
    }
    
    // Default mock response
    return { rows: [] };
  }
};
