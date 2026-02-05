// Mock localStorage for Node.js testing
const localStorageMock = {
  storage: {},
  getItem: function(key) { return this.storage[key] || null; },
  setItem: function(key, value) { this.storage[key] = value; },
  removeItem: function(key) { delete this.storage[key]; }
};

const localStorage = typeof window !== 'undefined' ? window.localStorage : localStorageMock;

export const RoleService = {

  currentRole: localStorage.getItem("role") || "VIEWER",
  currentUser: JSON.parse(localStorage.getItem("currentUser") || "null"),

  setRole(role) {
    localStorage.setItem("role", role);
    this.currentRole = role;
  },

  getCurrentRole() {
    return this.currentRole;
  },

  getCurrentUser() {
    return this.currentUser;
  },

  setCurrentUser(user) {
    this.currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
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
