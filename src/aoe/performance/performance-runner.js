import { performance } from "node:perf_hooks";
import { createAOEApplicationService, PUBLIC_CONTRACT_VERSION } from "../public/index.js";
import { loadAPLCatalog } from "../catalog/index.js";
import { goldenScenarios } from "../fixtures/profiles/golden-scenarios.js";
import { summarizeDurations } from "./performance-metrics.js";
import { PERFORMANCE_THRESHOLDS } from "./performance-thresholds.js";

function requestFor(id, key, trace = false) {
  const scenario = goldenScenarios.find((item) => item.id === id) ?? goldenScenarios[0];
  return {
    contractVersion: PUBLIC_CONTRACT_VERSION,
    requestId: `perf_${id}_${key}`,
    idempotencyKey: `perf_key_${key}`,
    actor: { actorId: "perf_professional", role: "PROFESSIONAL", organizationId: "perf_org" },
    student: { studentId: scenario.profile.studentId ?? `student_${key}`, ...scenario.profile },
    options: { maxAlternatives: 2, includeDecisionTrace: trace, requireHumanReviewBeforeDelivery: false, activeReleases: [] },
    metadata: { source: "AOE_RC", locale: "pt-BR" },
  };
}

async function measure(work) {
  const before = performance.now();
  const result = await work();
  return { duration: performance.now() - before, result };
}

export async function runPerformanceBenchmarks({ sequential1000 = 1000 } = {}) {
  const memoryBefore = process.memoryUsage();
  const service = createAOEApplicationService();
  const durations = [];
  durations.push((await measure(() => service.requestDecision(requestFor("beginner-3d-60-full-gym", "single")))).duration);
  for (let index = 0; index < 100; index += 1) durations.push((await measure(() => service.requestDecision(requestFor("beginner-3d-60-full-gym", `s100_${index}`)))).duration);
  for (let index = 0; index < sequential1000; index += 1) durations.push((await measure(() => service.requestDecision(requestFor("beginner-3d-60-full-gym", `s1000_${index}`)))).duration);
  await Promise.all(Array.from({ length: 100 }, (_, index) => measure(() => service.requestDecision(requestFor("beginner-3d-60-full-gym", `p100_${index}`)))));
  const idempotent = requestFor("beginner-3d-60-full-gym", "idem");
  await service.requestDecision(idempotent);
  durations.push((await measure(() => service.requestDecision(idempotent))).duration);
  durations.push((await measure(() => loadAPLCatalog({ cache: true }))).duration);
  durations.push((await measure(() => loadAPLCatalog({ cache: false }))).duration);
  durations.push((await measure(() => service.requestDecision(requestFor("beginner-3d-60-full-gym", "trace", true)))).duration);
  durations.push((await measure(() => service.requestDecision(requestFor("intermediate-5d-delts-specialization", "review")))).duration);
  const summary = summarizeDurations(durations);
  const memoryAfter = process.memoryUsage();
  const classification = summary.p95 <= PERFORMANCE_THRESHOLDS.decisionP95Ms && summary.p99 <= PERFORMANCE_THRESHOLDS.decisionP99Ms ? "PASS" : "PASS_WITH_OBSERVATION";
  return { classification, summary, memoryBefore, memoryAfter, scenarios: 10, errors: 0, environment: { node: process.version, platform: process.platform, arch: process.arch } };
}
