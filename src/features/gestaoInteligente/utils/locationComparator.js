import { calculateProfitability } from "./profitabilityEngine.js";
import { compareProfitabilityScenarios } from "./profitabilityComparison.js";

export const MAX_LOCATION_COMPARISON_LOCATIONS = 4;

export function buildLocationComparison({ service, locations, selectedLocationIds, studentCount }) {
  const activeLocations = (Array.isArray(locations) ? locations : []).filter((location) => location?.status !== "archived");
  const selected = activeLocations.filter((location) => selectedLocationIds.includes(location.id));
  const scenarioResults = selected.map((location) => ({
    scenarioId: location.id,
    label: location.name,
    location,
    service,
    studentCount: Number(studentCount),
    result: calculateProfitability({ service, location, studentCount }),
  }));
  const comparison = compareProfitabilityScenarios(scenarioResults);
  const invariants = buildInvariants(comparison.scenarioResults);

  return {
    selectedLocationCount: selected.length,
    maxLocations: MAX_LOCATION_COMPARISON_LOCATIONS,
    scenarioResults: comparison.scenarioResults,
    comparison,
    invariants,
  };
}

function buildInvariants(scenarios) {
  const valid = scenarios.filter((scenario) => scenario.valid);
  return {
    sameService: new Set(valid.map((scenario) => scenario.service?.id)).size <= 1,
    sameStudentCount: new Set(valid.map((scenario) => scenario.result.studentCount)).size <= 1,
    sameDuration: new Set(valid.map((scenario) => scenario.result.sessionDurationMinutes ?? "NULL")).size <= 1,
    sameGrossRevenue: new Set(valid.map((scenario) => scenario.result.grossRevenue)).size <= 1,
  };
}
