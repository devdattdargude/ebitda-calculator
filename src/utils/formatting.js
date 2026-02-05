export const Formatter = {

  sanitizeNumber(input) {
    if (!input) return 0;
    return Number(input.toString().replace(/[₹,]/g, ""));
  },

  formatCurrency(value) {
    return "₹" + Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

};
