export const ValidationRules = {
  revenue: { type: 'number', min: 0, max: 999999999, required: true },
  opex: { type: 'number', min: 0, max: 999999999, required: true },
  salary: { type: 'number', min: 0, max: 999999999, required: true },
  cogs: { type: 'number', min: 0, max: 999999999, required: false },
  variableCosts: { type: 'number', min: 0, max: 999999999, required: false },
  fixedCosts: { type: 'number', min: 0, max: 999999999, required: false },
  beds: { type: 'number', min: 1, max: 5000, required: false },
  seats: { type: 'number', min: 1, max: 5000, required: false }
};

export function validateField(name, value) {
  const rule = ValidationRules[name];
  if (!rule) return null;

  if (rule.required && value === "") {
    return `${name} is required`;
  }

  const num = Number(value);
  if (rule.type === "number" && isNaN(num)) {
    return `${name} must be numeric`;
  }

  if (num < rule.min || num > rule.max) {
    return `${name} out of allowed range`;
  }

  return null;
}
