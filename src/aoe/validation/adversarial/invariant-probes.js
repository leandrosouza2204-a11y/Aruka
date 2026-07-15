export function criticalScenarioSafe(result) {
  return result.status !== "RECOMMENDED";
}
