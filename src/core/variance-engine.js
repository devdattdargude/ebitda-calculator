export function variancePercent(actual, budget) {
  if(!budget) return 0;

  return (
    (actual - budget) /
    budget
  ) * 100;
}
