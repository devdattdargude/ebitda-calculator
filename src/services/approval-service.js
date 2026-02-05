export const ApprovalService = {

  async submit(id) {
    await fetch("/api/scenario/submit",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({id})
    });
  },

  async approve(id,userId,comment) {
    await fetch("/api/scenario/approve",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({id,userId,comment})
    });
  },

  async reject(id,userId,comment) {
    await fetch("/api/scenario/reject",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({id,userId,comment})
    });
  }

};
