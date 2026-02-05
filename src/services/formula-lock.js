export const FormulaLock = {

  locked: true,

  toggle() {
    this.locked = !this.locked;
  },

  isLocked() {
    return this.locked;
  }

};
