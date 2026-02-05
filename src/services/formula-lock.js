import { RoleService } from "./role-service.js";

export const FormulaLock = {

  locked: true,

  toggle() {
    // Only allow unlock/lock if user is admin
    if (!RoleService.isAdmin()) {
      throw new Error('Only administrators can modify formula lock status');
    }
    
    this.locked = !this.locked;
    console.log(`Formula lock ${this.locked ? 'enabled' : 'disabled'} by admin`);
    return this.locked;
  },

  isLocked() {
    return this.locked;
  },

  // Method to check if current user can unlock formulas
  canUnlock() {
    return RoleService.isAdmin();
  }

};
