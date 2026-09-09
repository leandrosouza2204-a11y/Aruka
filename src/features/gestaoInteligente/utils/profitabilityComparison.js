export const COMPARISON_METRICS = {
  netAfterTransfer: { label: "Receita após repasse", higherIsBetter: true },
  netHourlyRate: { label: "Valor por hora", higherIsBetter: true },
  netPerStudent: { label: "Valor por aluno", higherIsBetter: true },
  transferAmount: { label: "Menor repasse", higherIsBetter: false },
};

export function compareProfitabilityScenarios(scenarios) {
  const scenarioResults = (Array.isArray(scenarios) ? scenarios : []).map((scenario) => ({
    ...scenario,
    valid: Boolean(scenario?.result?.valid),
  }));
  const validScenarios = scenarioResults.filter((scenario) => scenario.valid);

  return {
    scenarioResults,
    validScenarioCount: validScenarios.length,
    highestNet: findWinners(validScenarios, "netAfterTransfer", true),
    highestHourly: findWinners(validScenarios, "netHourlyRate", true),
    highestPerStudent: findWinners(validScenarios, "netPerStudent", true),
    lowestTransfer: findWinners(validScenarios, "transferAmount", false),
  };
}

export function findWinners(scenarios, metric, higherIsBetter = true) {
  const comparable = scenarios.filter((scenario) => Number.isFinite(scenario?.result?.[metric]));
  if (comparable.length === 0) return { metric, value: null, scenarioIds: [], tie: false };

  const values = comparable.map((scenario) => scenario.result[metric]);
  const winningValue = higherIsBetter ? Math.max(...values) : Math.min(...values);
  const scenarioIds = comparable.filter((scenario) => scenario.result[metric] === winningValue).map((scenario) => scenario.scenarioId);

  return {
    metric,
    value: winningValue,
    scenarioIds,
    tie: scenarioIds.length > 1,
  };
}
