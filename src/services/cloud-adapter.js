export const CloudAdapter = {

  async pushScenario(s) {

    await fetch(
      "http://localhost:4000/api/scenario/save",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify(s)
      }
    );
  },

  async pullAll() {

    const r =
      await fetch(
        "http://localhost:4000/api/scenario/all");

    return await r.json();
  }

};
