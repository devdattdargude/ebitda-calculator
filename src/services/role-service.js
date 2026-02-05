export const RoleService = {

  currentRole: "analyst", // default

  setRole(role) {
    this.currentRole = role;
    localStorage.setItem("userRole", role);
  },

  loadRole() {
    this.currentRole =
      localStorage.getItem("userRole") || "analyst";
  },

  isViewer() { return this.currentRole === "viewer"; },
  isAnalyst() { return this.currentRole === "analyst"; },
  isAdmin() { return this.currentRole === "admin"; }

};
