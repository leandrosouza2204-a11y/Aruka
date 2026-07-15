const FIELDS = ["modelVersion", "aplRelease", "checksum", "status", "experienceLevel", "split", "strategy", "frequency", "minimumSessionDuration", "maximumSessionDuration", "equipmentProfile", "complexity", "recoveryDemand", "adherenceDemand", "specializationTarget"];

export function diffCatalogs(previousCatalog = [], currentCatalog = []) {
  const previous = new Map(previousCatalog.map((model) => [model.modelCode, model]));
  const current = new Map(currentCatalog.map((model) => [model.modelCode, model]));
  const changes = [];
  for (const code of [...new Set([...previous.keys(), ...current.keys()])].sort()) {
    const before = previous.get(code);
    const after = current.get(code);
    if (!before) changes.push({ modelCode: code, status: "ADDED" });
    else if (!after) changes.push({ modelCode: code, status: "REMOVED" });
    else {
      for (const field of FIELDS) {
        const left = JSON.stringify(before[field] ?? null);
        const right = JSON.stringify(after[field] ?? null);
        if (left !== right) changes.push({ modelCode: code, status: "CHANGED", field, previous: before[field] ?? null, current: after[field] ?? null });
      }
    }
  }
  return { changes, hasChanges: changes.length > 0 };
}

export function compareFixtureWithReal(fixtureCatalog, realCatalog) {
  return diffCatalogs(fixtureCatalog, realCatalog).changes.map((change) => ({
    ...change,
    comparisonStatus: change.status === "ADDED" ? "MISSING_IN_FIXTURE" : change.status === "REMOVED" ? "MISSING_IN_REAL" : "DIFFERENT",
  }));
}
