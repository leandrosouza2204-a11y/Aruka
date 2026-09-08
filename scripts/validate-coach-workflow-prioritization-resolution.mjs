import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const files = {
  queue: "src/features/alunos/utils/coachAttentionQueue.js",
  queueTest: "src/features/alunos/utils/coachAttentionQueue.test.js",
  dashboard: "src/features/dashboard/components/DashboardCoachAttentionQueue.jsx",
  dashboardHook: "src/features/dashboard/hooks/useDashboardPage.js",
  docs: "docs/product-roadmap-v4-cycle-coach-workflow-automation/07-prioritization-and-resolution.md",
  result: "reports/product-roadmap-v4/prioritization-and-resolution-result.json",
  summary: "reports/product-roadmap-v4/prioritization-and-resolution-summary.md",
};

for (const file of Object.values(files)) {
  assert.equal(existsSync(file), true, `${file} must exist`);
}

const queue = read(files.queue);
const queueTest = read(files.queueTest);
const dashboard = read(files.dashboard);
const hook = read(files.dashboardHook);
const docs = read(files.docs);
const result = JSON.parse(read(files.result));

assert.match(queue, /COACH_WORKFLOW_ITEM_STATE/);
assert.match(queue, /ACKNOWLEDGED/);
assert.match(queue, /acknowledgedItemIds/);
assert.match(queue, /getWorkflowStateRank/);
assert.match(queueTest, /acknowledged items move after items requiring attention before the queue limit/);
assert.match(queueTest, /current deterministic item identity/);
assert.match(dashboard, /Marcar como visto/);
assert.match(dashboard, /aria-pressed/);
assert.match(hook, /toggleCoachAttentionAcknowledgement/);
assert.doesNotMatch(queue, /from\(|insert|update|delete|upsert|localStorage|sessionStorage/i);
assert.doesNotMatch(dashboard, /\b(dispensar|resolver|concluir|snooze)\b/i);
assert.match(docs, /PERSISTENCE: NO/);
assert.match(docs, /DISMISS: NOT_IMPLEMENTED/);
assert.match(docs, /MANUAL_PRIORITY: NOT_IMPLEMENTED/);
assert.match(docs, /MANUAL_RESOLVE: NOT_IMPLEMENTED/);
assert.equal(result.cycle, "COACH_WORKFLOW_AUTOMATION");
assert.equal(result.stage, "10.4");
assert.equal(result.persistence.implemented, false);
assert.equal(result.supabaseChange, false);
assert.equal(result.autoAction, false);

console.log("COACH_WORKFLOW_PRIORITIZATION_RESOLUTION_QA=PASS");
console.log("CYCLE=COACH_WORKFLOW_AUTOMATION");
console.log("STAGE=10.4");
console.log("ACKNOWLEDGE=LOCAL_SESSION_ONLY");
console.log("DISMISS=NOT_IMPLEMENTED");
console.log("MANUAL_RESOLVE=NOT_IMPLEMENTED");
console.log("MANUAL_PRIORITY=NOT_IMPLEMENTED");
console.log("PERSISTENCE=NO");
console.log("SUPABASE_CHANGE=NO");
console.log("AUTO_ACTION=NO");

function read(file) {
  return readFileSync(file, "utf8");
}
