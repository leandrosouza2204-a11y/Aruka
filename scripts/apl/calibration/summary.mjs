function topName(rows) {
  return rows?.[0]?.name ?? "N/A";
}

export function buildExecutiveSummary(result, calibration) {
  const stats = calibration.statistics;
  const severity = stats.bySeverity ?? {};
  const confidenceValues = calibration.findings.map((finding) => finding.confidence ?? 0).filter(Boolean);
  const averageConfidence = confidenceValues.length
    ? Math.round(confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length)
    : 0;

  return {
    version: "AQA v1.1",
    result: result.status,
    blockers: severity.blocker ?? 0,
    errors: severity.error ?? 0,
    warnings: severity.warning ?? 0,
    suggestions: severity.suggestion ?? 0,
    info: severity.info ?? 0,
    duplicatesRemoved: calibration.metrics.duplicatesRemoved ?? 0,
    suppressedCount: calibration.metrics.suppressedCount ?? 0,
    rootCauses: calibration.metrics.rootCauseCount ?? 0,
    averageConfidence,
    mostCriticalModel: topName(stats.topModels),
    mostViolatedRule: topName(stats.topRules),
    mostCriticalSprint: topName(Object.entries(stats.bySprint ?? {}).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)),
  };
}
