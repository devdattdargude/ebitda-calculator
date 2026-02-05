export const CloudAdapter = {

  async pushScenario(s) {
    console.log("Cloud push stub", s.id);
  },

  async pullAll() {
    console.log("Cloud pull stub");
    return [];
  }

};
