export const ApprovalService = {

  async getPendingCount() {
    try {
      const response = await fetch("http://localhost:4001/api/scenario/all");
      const scenarios = await response.json();
      return scenarios.filter(s => s.status === 'SUBMITTED').length;
    } catch (error) {
      console.error('Failed to get pending count:', error);
      return 0;
    }
  },

  async getPendingApprovals() {
    try {
      const response = await fetch("http://localhost:4001/api/scenario/all");
      const scenarios = await response.json();
      return scenarios.filter(s => s.status === 'SUBMITTED').map(s => ({
        id: s.id,
        scenarioName: s.name,
        submittedBy: s.owner_id || 'Unknown'
      }));
    } catch (error) {
      console.error('Failed to get pending approvals:', error);
      return [];
    }
  },

  async submit(id) {
    await fetch("http://localhost:4001/api/scenario/submit",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({id})
    });
  },

  async approve(id,userId,comment) {
    await fetch("http://localhost:4001/api/scenario/approve",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({id,userId,comment})
    });
  },

  async reject(id,userId,comment) {
    await fetch("http://localhost:4001/api/scenario/reject",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({id,userId,comment})
    });
  }

};
