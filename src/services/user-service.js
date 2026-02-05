export const UserService = {

  currentUser: null,

  login(name) {
    this.currentUser = {
      id: crypto.randomUUID(),
      name
    };

    localStorage.setItem(
      "activeUser",
      JSON.stringify(this.currentUser)
    );
  },

  load() {
    this.currentUser =
      JSON.parse(
        localStorage.getItem("activeUser")
      );
  }

};
