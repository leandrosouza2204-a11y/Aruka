function keyOf(finding) {
  return [finding.ruleId, finding.file, finding.line, finding.message, finding.section].map((value) => value ?? "").join("|");
}

export function deduplicateFindings(findings) {
  const seen = new Set();
  const deduplicated = [];
  let duplicatesRemoved = 0;

  for (const finding of findings) {
    const key = keyOf(finding);
    if (seen.has(key)) {
      duplicatesRemoved += 1;
      continue;
    }
    seen.add(key);
    deduplicated.push({ ...finding });
  }

  return {
    findings: deduplicated,
    metrics: { duplicatesRemoved },
  };
}
