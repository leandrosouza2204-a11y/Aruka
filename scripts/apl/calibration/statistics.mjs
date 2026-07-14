function countBy(items, keyFactory) {
  const counts = {};
  for (const item of items) {
    const key = keyFactory(item);
    if (!key) continue;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function top(counts, limit = 10) {
  return Object.entries(counts ?? {})
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

export function buildCalibrationStatistics(result, findings) {
  const byRule = countBy(findings, (finding) => finding.ruleId);
  const byFile = countBy(findings, (finding) => finding.file);
  const byModel = countBy(findings, (finding) => finding.modelCode);
  const bySeverity = countBy(findings, (finding) => finding.severity);
  const byConfidence = countBy(findings, (finding) => String(finding.confidence ?? "unknown"));

  return {
    byRule,
    bySprint: countBy(findings, (finding) => finding.sprint),
    byBlock: countBy(findings, (finding) => finding.block),
    byModel,
    byFile,
    bySeverity,
    byConfidence,
    byCategory: countBy(findings, (finding) => finding.category),
    topRules: top(byRule),
    topFiles: top(byFile),
    topModels: top(byModel),
    performance: {
      byRule: Object.fromEntries((result.ruleRuns ?? []).map((rule) => [rule.id, rule.durationMs])),
      bySprint: countBy(findings, (finding) => finding.sprint),
      totalMs: result.durationMs,
    },
  };
}
