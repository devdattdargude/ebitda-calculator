export const RoleService = {

  currentRole: localStorage.getItem("role") || "VIEWER",

  setRole(role) {
    localStorage.setItem("role", role);
    this.currentRole = role;
  },

  isAdmin() {
    return this.currentRole === "ADMIN";
  },

  isViewer() {
    return this.currentRole === "VIEWER";
  },

  isAnalyst() {
    return this.currentRole === "ANALYST";
  },

  canRunWhatIf() {
    return this.currentRole === "ADMIN" || 
           this.currentRole === "ANALYST";
  }

};
