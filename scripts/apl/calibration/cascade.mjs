function targetKey(finding) {
  return finding.file || `${finding.sprint ?? ""}/${finding.block ?? ""}/${finding.modelCode ?? ""}`;
}

function isRootCandidate(finding) {
  return /arquivo vazio|readme .*ausente|titulo principal ausente|codigo .*incompat|diretorio esperado ausente/i.test(finding.message ?? "");
}

export function detectCascades(findings) {
  const grouped = new Map();
  for (const finding of findings) {
    const key = targetKey(finding);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(finding);
  }

  let rootCauseCount = 0;
  const calibrated = [];

  for (const group of grouped.values()) {
    const root = group.find(isRootCandidate) ?? (group.length >= 8 ? group[0] : null);
    if (!root) {
      calibrated.push(...group.map((finding) => ({ ...finding, isCascadeChild: false, depth: 0 })));
      continue;
    }

    rootCauseCount += 1;
    const rootCauseId = `${root.ruleId}:${targetKey(root)}:${root.message}`.replace(/\s+/g, "-").slice(0, 180);
    for (const finding of group) {
      const isRoot = finding === root;
      calibrated.push({
        ...finding,
        rootCauseId,
        rootCauseMessage: root.message,
        rootRule: root.ruleId,
        parentFindingId: isRoot ? undefined : rootCauseId,
        isCascadeChild: !isRoot,
        depth: isRoot ? 0 : 1,
      });
    }
  }

  return {
    findings: calibrated,
    metrics: { rootCauseCount, cascadesDetected: rootCauseCount },
  };
}
