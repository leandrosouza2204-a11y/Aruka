#!/usr/bin/env node
import { createAOEApplicationService, PUBLIC_CONTRACT_VERSION, createMemoryLogger, createMemoryMetrics } from "../../src/aoe/index.js";
import { goldenScenarios } from "../../src/aoe/fixtures/profiles/golden-scenarios.js";

function parseArgs(argv) {
  return argv.reduce((acc, arg) => {
    if (arg.startsWith("--scenario=")) acc.scenario = arg.slice("--scenario=".length);
    else if (arg.startsWith("--review=")) acc.review = arg.slice("--review=".length);
    else if (arg === "--request") acc.request = true;
    else if (arg === "--repeat") acc.repeat = true;
    else if (arg === "--trace") acc.trace = true;
    else if (arg === "--health") acc.health = true;
    else if (arg === "--json") acc.json = true;
    else if (arg === "--deny") acc.deny = true;
    else if (arg === "--conflict") acc.conflict = true;
    return acc;
  }, {});
}

function createRequest(scenarioId, overrides = {}) {
  const scenario = goldenScenarios.find((item) => item.id === scenarioId) ?? goldenScenarios[0];
  return {
    contractVersion: PUBLIC_CONTRACT_VERSION,
    requestId: `req_${scenario.id}`,
    idempotencyKey: `idem_${scenario.id}`,
    actor: { actorId: "pro_001", role: overrides.role ?? "PROFESSIONAL", organizationId: "org_001" },
    student: { studentId: scenario.profile.studentId ?? "student_001", ...scenario.profile },
    options: { maxAlternatives: 2, includeDecisionTrace: Boolean(overrides.trace), requireHumanReviewBeforeDelivery: false, activeReleases: [] },
    metadata: { source: "ARUKA_APP", locale: "pt-BR" },
  };
}

function print(value, json) {
  if (json) {
    process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
    return;
  }
  if (value.status === "ERROR") {
    process.stdout.write(`ERROR ${value.error.code}: ${value.error.message}\n`);
    return;
  }
  process.stdout.write(`status: ${value.status}\n`);
  if (value.decisionId) process.stdout.write(`decisionId: ${value.decisionId}\n`);
  if (value.selectedModel) process.stdout.write(`selected: ${value.selectedModel.modelCode}\n`);
  if (value.humanReview?.reviewId) process.stdout.write(`reviewId: ${value.humanReview.reviewId}\n`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const logger = createMemoryLogger();
  const metrics = createMemoryMetrics();
  const service = createAOEApplicationService({ logger, metrics });
  if (args.health) {
    print(await service.healthCheck(), args.json);
    return;
  }
  const request = createRequest(args.scenario ?? "beginner-3d-60-full-gym", { trace: args.trace, role: args.deny ? "STUDENT_READ_ONLY" : "PROFESSIONAL" });
  if (args.request) {
    print(request, true);
    if (!args.repeat && !args.conflict && !args.review) return;
  }
  const first = await service.requestDecision(request);
  if (args.conflict) {
    const conflicting = structuredClone(request);
    conflicting.student.availableDaysPerWeek = Math.max(1, conflicting.student.availableDaysPerWeek - 1);
    print(await service.requestDecision(conflicting), args.json);
    return;
  }
  if (args.repeat) {
    const second = await service.requestDecision(request);
    print({ firstDecisionId: first.decisionId, secondDecisionId: second.decisionId, sameDecision: first.decisionId === second.decisionId, metrics: metrics.snapshot() }, args.json);
    return;
  }
  if (args.review && first.humanReview?.reviewId) {
    const review = await service.submitHumanReview({
      contractVersion: PUBLIC_CONTRACT_VERSION,
      requestId: `${request.requestId}_review`,
      idempotencyKey: `${request.idempotencyKey}_review`,
      actor: request.actor,
      reviewId: first.humanReview.reviewId,
      decision: args.review,
      checklist: first.humanReview.checklist,
      adjustments: [],
      notes: "",
    });
    print(review, args.json);
    return;
  }
  if (args.trace && first.decisionId) {
    print(await service.getDecisionTrace({ decisionId: first.decisionId, actor: request.actor }), args.json);
    return;
  }
  print(first, args.json);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
