import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const files = {
  queue: "src/features/alunos/utils/coachAttentionQueue.js",
  queueTest: "src/features/alunos/utils/coachAttentionQueue.test.js",
  dashboard: "src/features/dashboard/components/DashboardCoachAttentionQueue.jsx",
  dashboardHook: "src/features/dashboard/hooks/useDashboardPage.js",
  docs: "docs/product-roadmap-v4-cycle-coach-workflow-automation/03-coach-attention-queue.md",
  result: "reports/product-roadmap-v4/coach-attention-queue-result.json",
  summary: "reports/product-roadmap-v4/coach-attention-queue-summary.md",
};

for (const file of Object.values(files)) {
  assert.equal(existsSync(file), true, `${file} must exist`);
}

const queue = read(files.queue);
const dashboard = read(files.dashboard);
const hook = read(files.dashboardHook);
const docs = read(files.docs);
const result = JSON.parse(read(files.result));

assert.match(queue, /buildCoachAttentionQueue/);
assert.match(queue, /COACH_ATTENTION_QUEUE_SIGNAL_MAP/);
assert.match(queue, /ACTION_REQUIRED/);
assert.match(queue, /REVIEW/);
assert.match(queue, /buildActionTarget/);
assert.doesNotMatch(queue, /from\(|insert|update|delete|upsert|localStorage|sessionStorage/i);
assert.doesNotMatch(dashboard, /\b(dispensar|resolver|concluir|snooze|notification|notifications|bell)\b/i);
assert.match(dashboard, /role="status"/);
assert.match(dashboard, /role="alert"/);
assert.match(dashboard, /aria-label/);
assert.match(hook, /coachAttentionQueue/);
assert.match(docs, /CALCULATED_ONLY/);
assert.match(docs, /QUEUE_GROUPING_STRATEGY: GROUP_BY_STUDENT/);
assert.equal(result.cycle, "COACH_WORKFLOW_AUTOMATION");
assert.equal(result.stage, "10.2");
assert.equal(result.decision, "COMPLETE");
assert.equal(result.supabaseChange, false);
assert.equal(result.financeImpact.functionalChange, false);
assert.equal(result.autoAction, false);
assert.equal(result.calculatedOnly, true);

console.log("COACH_ATTENTION_QUEUE_QA=PASS");
console.log("CYCLE=COACH_WORKFLOW_AUTOMATION");
console.log("STAGE=10.2");
console.log("QUEUE_GROUPING_STRATEGY=GROUP_BY_STUDENT");
console.log("CALCULATED_ONLY=YES");
console.log("AUTO_ACTION=NO");
console.log("SUPABASE_CHANGE=NO");
console.log("FINANCE_FUNCTIONAL_CHANGE=NO");

function read(file) {
  return readFileSync(file, "utf8");
}
