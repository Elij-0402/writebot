export function getRiskLevel(input: { isHighRisk: boolean }) {
  return input.isHighRisk ? "high" : "low";
}
