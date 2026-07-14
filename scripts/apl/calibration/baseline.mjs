import path from "node:path";
import { ROOT_REPORTS } from "../config.mjs";
import { exists, read, write } from "../utils/files.mjs";

function total(counts) {
  return Object.values(counts ?? {}).reduce((sum, value) => sum + value, 0);
}

function diff(current, previous) {
  return current - previous;
}

function snapshot(result, calibration) {
  const stats = calibration.statistics;
  return {
    updatedAt: new Date().toISOString(),
    target: result.target,
    totalFindings: calibration.findings.length,
    byRule: stats.byRule,
    bySeverity: stats.bySeverity,
    bySprint: stats.bySprint,
    byBlock: stats.byBlock,
  };
}

export async function updateBaseline(result, calibration, options = {}) {
  const reportRoot = options.rootReports ?? ROOT_REPORTS;
  const baselinePath = path.resolve(reportRoot, ".baseline.json");
  const current = snapshot(result, calibration);
  let previous = null;

  if (await exists(baselinePath)) {
    previous = JSON.parse(await read(baselinePath));
  }

  const trend = previous
    ? {
        findingsDelta: diff(current.totalFindings, previous.totalFindings ?? 0),
        blockersDelta: diff(current.bySeverity.blocker ?? 0, previous.bySeverity?.blocker ?? 0),
        errorsDelta: diff(current.bySeverity.error ?? 0, previous.bySeverity?.error ?? 0),
        warningsDelta: diff(current.bySeverity.warning ?? 0, previous.bySeverity?.warning ?? 0),
        suggestionsDelta: diff(current.bySeverity.suggestion ?? 0, previous.bySeverity?.suggestion ?? 0),
        previousTotal: previous.totalFindings ?? total(previous.bySeverity),
        currentTotal: current.totalFindings,
      }
    : {
        findingsDelta: 0,
        blockersDelta: 0,
        errorsDelta: 0,
        warningsDelta: 0,
        suggestionsDelta: 0,
        previousTotal: 0,
        currentTotal: current.totalFindings,
      };

  await write(baselinePath, JSON.stringify(current, null, 2));

  return {
    baselinePath,
    previous,
    current,
    trend,
  };
}
