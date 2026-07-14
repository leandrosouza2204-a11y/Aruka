import {
  ENABLE_BASELINE,
  ENABLE_CASCADE,
  ENABLE_CLASSIFICATION,
  ENABLE_CONFIDENCE,
  ENABLE_DEDUPLICATION,
  ENABLE_SUPPRESSIONS,
} from "../config.mjs";
import { detectCascades } from "./cascade.mjs";
import { classifyFindings } from "./classification.mjs";
import { applyConfidence } from "./confidence.mjs";
import { deduplicateFindings } from "./deduplication.mjs";
import { applySuppressions } from "./suppression.mjs";
import { buildCalibrationStatistics } from "./statistics.mjs";
import { buildExecutiveSummary } from "./summary.mjs";
import { updateBaseline } from "./baseline.mjs";

function mergeMetrics(...items) {
  return Object.assign({}, ...items.map((item) => item.metrics ?? {}));
}

async function step(enabled, findings, fn) {
  if (!enabled) return { findings, metrics: {} };
  return fn(findings);
}

export async function calibrateAuditResult(result, options = {}) {
  let findings = result.findings.map((finding, index) => ({
    ...finding,
    findingId: `${finding.ruleId}-${index + 1}`,
    originalSeverity: finding.severity,
  }));
  const metrics = {};

  const cascade = await step(ENABLE_CASCADE, findings, detectCascades);
  findings = cascade.findings;
  Object.assign(metrics, mergeMetrics(cascade));

  const dedupe = await step(ENABLE_DEDUPLICATION, findings, deduplicateFindings);
  findings = dedupe.findings;
  Object.assign(metrics, mergeMetrics(dedupe));

  const suppression = await step(ENABLE_SUPPRESSIONS, findings, (items) => applySuppressions(items, options));
  findings = suppression.findings;
  Object.assign(metrics, mergeMetrics(suppression));

  const confidence = await step(ENABLE_CONFIDENCE, findings, applyConfidence);
  findings = confidence.findings;
  Object.assign(metrics, mergeMetrics(confidence));

  const classification = await step(ENABLE_CLASSIFICATION, findings, classifyFindings);
  findings = classification.findings;
  Object.assign(metrics, mergeMetrics(classification));

  const statistics = buildCalibrationStatistics(result, findings);
  const calibration = {
    enabled: true,
    version: "1.1",
    metrics,
    findings,
    statistics,
    summary: {},
    baseline: null,
  };
  calibration.summary = buildExecutiveSummary(result, calibration);

  if (ENABLE_BASELINE) {
    calibration.baseline = await updateBaseline(result, calibration, options);
  }

  return calibration;
}
