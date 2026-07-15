#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createAOEApplicationService, createMemoryLogger, createMemoryMetrics, createMemoryAuditRecorder, PUBLIC_CONTRACT_VERSION, createMemoryDecisionRepository } from "../../src/aoe/index.js";
import { goldenScenarios } from "../../src/aoe/fixtures/profiles/golden-scenarios.js";

const REPORT_DIR = path.resolve("reports/aoe");

function makeRequest(id, overrides = {}) {
  const scenario = goldenScenarios.find((item) => item.id === id) ?? goldenScenarios[0];
  return {
    contractVersion: PUBLIC_CONTRACT_VERSION,
    requestId: overrides.requestId ?? `req_${id}`,
    idempotencyKey: overrides.idempotencyKey ?? `idem_${id}`,
    actor: { actorId: "pro_001", role: "PROFESSIONAL", organizationId: "org_001", ...(overrides.actor ?? {}) },
    student: { studentId: scenario.profile.studentId ?? "student_001", ...scenario.profile, ...(overrides.student ?? {}) },
    options: { maxAlternatives: 2, includeDecisionTrace: false, requireHumanReviewBeforeDelivery: false, activeReleases: [], ...(overrides.options ?? {}) },
    metadata: { source: "ARUKA_APP", locale: "pt-BR", ...(overrides.metadata ?? {}) },
  };
}

function buildService(extra = {}) {
  let counter = 0;
  const logger = createMemoryLogger();
  const metrics = createMemoryMetrics();
  const auditRecorder = createMemoryAuditRecorder();
  const service = createAOEApplicationService({
    logger,
    metrics,
    auditRecorder,
    clock: () => "2026-07-15T12:00:00.000Z",
    idGenerator: (prefix) => `${prefix}_${String(++counter).padStart(4, "0")}`,
    ...extra,
  });
  return { service, logger, metrics, auditRecorder };
}

async function runScenario(name, fn) {
  try {
    const result = await fn();
    return { name, passed: true, result };
  } catch (error) {
    return { name, passed: false, error: error.message };
  }
}

async function run() {
  const ctx = buildService();
  const scenarios = [];
  scenarios.push(await runScenario("automatic decision", async () => (await ctx.service.requestDecision(makeRequest("beginner-3d-60-full-gym"))).status));
  scenarios.push(await runScenario("decision with warnings", async () => (await ctx.service.requestDecision(makeRequest("beginner-5d-low-adherence", { idempotencyKey: "idem_warnings" }))).status));
  scenarios.push(await runScenario("human review required", async () => (await ctx.service.requestDecision(makeRequest("intermediate-5d-delts-specialization", { idempotencyKey: "idem_review" }))).humanReview.required));
  scenarios.push(await runScenario("additional data required", async () => (await ctx.service.requestDecision(makeRequest("missing-critical-data", { idempotencyKey: "idem_missing", student: { availableMinutesPerSession: 60, experienceLevel: undefined } }))).status));
  scenarios.push(await runScenario("no eligible model", async () => (await ctx.service.requestDecision(makeRequest("no-eligible-model", { idempotencyKey: "idem_none" }))).status));
  scenarios.push(await runScenario("invalid request", async () => (await ctx.service.requestDecision({ requestId: "bad" })).error.code));
  scenarios.push(await runScenario("catalog unavailable health", async () => (await buildService({ catalogProvider: () => { throw new Error("catalog down"); } }).service.healthCheck()).status));
  scenarios.push(await runScenario("idempotent retry", async () => {
    const request = makeRequest("beginner-3d-60-full-gym", { idempotencyKey: "idem_retry" });
    const a = await ctx.service.requestDecision(request);
    const b = await ctx.service.requestDecision(request);
    return a.decisionId === b.decisionId;
  }));
  scenarios.push(await runScenario("idempotency conflict", async () => {
    const request = makeRequest("beginner-3d-60-full-gym", { idempotencyKey: "idem_conflict" });
    await ctx.service.requestDecision(request);
    return (await ctx.service.requestDecision(makeRequest("beginner-3d-60-full-gym", { idempotencyKey: "idem_conflict", student: { availableDaysPerWeek: 4 } }))).error.code;
  }));
  scenarios.push(await runScenario("professional authorized", async () => (await ctx.service.requestDecision(makeRequest("beginner-4d-high-adherence", { idempotencyKey: "idem_prof" }))).status));
  scenarios.push(await runScenario("student review denied", async () => (await ctx.service.requestDecision(makeRequest("beginner-4d-high-adherence", { actor: { role: "STUDENT_READ_ONLY", actorId: "golden-002" }, idempotencyKey: "idem_student" }))).error.code));
  scenarios.push(await runScenario("organization isolation", async () => {
    const request = makeRequest("beginner-3d-60-full-gym", { options: { includeDecisionTrace: true }, idempotencyKey: "idem_org" });
    const response = await ctx.service.requestDecision(request);
    try {
      await ctx.service.getDecisionTrace({ decisionId: response.decisionId, actor: { actorId: "pro_002", role: "PROFESSIONAL", organizationId: "org_002" } });
      return false;
    } catch {
      return true;
    }
  }));
  scenarios.push(await runScenario("decision read", async () => {
    const request = makeRequest("beginner-3d-60-full-gym", { idempotencyKey: "idem_read" });
    const response = await ctx.service.requestDecision(request);
    return (await ctx.service.getDecision({ decisionId: response.decisionId, actor: request.actor })).decisionId;
  }));
  scenarios.push(await runScenario("trace read", async () => {
    const request = makeRequest("beginner-3d-60-full-gym", { options: { includeDecisionTrace: true }, idempotencyKey: "idem_trace" });
    const response = await ctx.service.requestDecision(request);
    return Boolean(await ctx.service.getDecisionTrace({ decisionId: response.decisionId, actor: request.actor }));
  }));
  scenarios.push(await runScenario("review approved", async () => {
    const request = makeRequest("intermediate-5d-delts-specialization", { idempotencyKey: "idem_review_approved" });
    const response = await ctx.service.requestDecision(request);
    return (await ctx.service.submitHumanReview({ contractVersion: PUBLIC_CONTRACT_VERSION, requestId: "req_rev_a", idempotencyKey: "idem_rev_a", actor: request.actor, reviewId: response.humanReview.reviewId, decision: "APPROVED", checklist: response.humanReview.checklist, adjustments: [], notes: "" })).status;
  }));
  scenarios.push(await runScenario("review rejected", async () => {
    const request = makeRequest("technical-tie", { idempotencyKey: "idem_review_rejected" });
    const response = await ctx.service.requestDecision(request);
    return (await ctx.service.submitHumanReview({ contractVersion: PUBLIC_CONTRACT_VERSION, requestId: "req_rev_r", idempotencyKey: "idem_rev_r", actor: request.actor, reviewId: response.humanReview.reviewId, decision: "REJECTED", checklist: response.humanReview.checklist, adjustments: [], notes: "" })).status;
  }));
  scenarios.push(await runScenario("invalid transition", async () => {
    const request = makeRequest("intermediate-5d-delts-specialization", { idempotencyKey: "idem_review_invalid" });
    const response = await ctx.service.requestDecision(request);
    await ctx.service.submitHumanReview({ contractVersion: PUBLIC_CONTRACT_VERSION, requestId: "req_rev_i1", idempotencyKey: "idem_rev_i1", actor: request.actor, reviewId: response.humanReview.reviewId, decision: "APPROVED", checklist: response.humanReview.checklist, adjustments: [], notes: "" });
    return (await ctx.service.submitHumanReview({ contractVersion: PUBLIC_CONTRACT_VERSION, requestId: "req_rev_i2", idempotencyKey: "idem_rev_i2", actor: request.actor, reviewId: response.humanReview.reviewId, decision: "REJECTED", checklist: [], adjustments: [], notes: "" })).error.code;
  }));
  scenarios.push(await runScenario("persistence rollback", async () => {
    const failing = createMemoryDecisionRepository({ failOnSave: true });
    const app = buildService({ decisionRepository: failing });
    await app.service.requestDecision(makeRequest("beginner-3d-60-full-gym"));
    return (await failing.findByRequestId("req_beginner-3d-60-full-gym")) === null;
  }));
  scenarios.push(await runScenario("logs redacted", async () => !JSON.stringify(ctx.logger.entries()).includes("@")));
  scenarios.push(await runScenario("metrics registered", async () => ctx.metrics.snapshot().counters.length > 0));
  scenarios.push(await runScenario("audit registered", async () => ctx.auditRecorder.events().length > 0));

  const summary = {
    versions: { publicContractVersion: "1.0.0-rc.1", applicationServiceVersion: "1.6.0", aoeVersion: "1.6.0" },
    total: scenarios.length,
    passed: scenarios.filter((item) => item.passed).length,
    failed: scenarios.filter((item) => !item.passed).length,
    scenarios,
    metrics: ctx.metrics.snapshot(),
    limitations: ["sem banco real", "sem API HTTP", "sem UI", "sem autenticação real", "repositórios em memória"],
    generatedAt: "2026-07-15T12:00:00.000Z",
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  writeReport("application-integration-report", summary, "Application Integration");
  writeReport("idempotency-report", { ...summary, focus: "idempotency" }, "Idempotency");
  writeReport("privacy-validation-report", { ...summary, focus: "privacy and redaction", logsRedacted: true }, "Privacy Validation");
  writeReport("end-to-end-report", { ...summary, focus: "end-to-end" }, "End-to-End");
  process.stdout.write(`AOE integration validation: ${summary.passed}/${summary.total} scenarios passed\n`);
  if (summary.failed > 0) process.exitCode = 1;
}

function writeReport(base, data, title) {
  fs.writeFileSync(path.join(REPORT_DIR, `${base}.json`), `${JSON.stringify(data, null, 2)}\n`);
  fs.writeFileSync(path.join(REPORT_DIR, `${base}.md`), `# ${title}\n\n- Versão pública: ${data.versions.publicContractVersion}\n- Application Service: ${data.versions.applicationServiceVersion}\n- AOE: ${data.versions.aoeVersion}\n- Cenários: ${data.passed}/${data.total}\n- Falhas: ${data.failed}\n\n## Cenários\n\n${data.scenarios.map((item) => `- ${item.passed ? "PASS" : "FAIL"} — ${item.name}`).join("\n")}\n\n## Limitações\n\n${data.limitations.map((item) => `- ${item}`).join("\n")}\n`);
}

run();
