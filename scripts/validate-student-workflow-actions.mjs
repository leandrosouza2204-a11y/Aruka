import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const files = {
  queue: "src/features/alunos/utils/coachAttentionQueue.js",
  queueTest: "src/features/alunos/utils/coachAttentionQueue.test.js",
  dashboardQueue: "src/features/dashboard/components/DashboardCoachAttentionQueue.jsx",
  alunosHook: "src/features/alunos/hooks/useAlunosPage.js",
  docs: "docs/product-roadmap-v4-cycle-coach-workflow-automation/05-student-workflow-actions.md",
  result: "reports/product-roadmap-v4/student-workflow-actions-result.json",
  summary: "reports/product-roadmap-v4/student-workflow-actions-summary.md",
};

for (const file of Object.values(files)) {
  assert.equal(existsSync(file), true, `${file} must exist`);
}

const queue = read(files.queue);
const queueTest = read(files.queueTest);
const dashboardQueue = read(files.dashboardQueue);
const alunosHook = read(files.alunosHook);
const docs = read(files.docs);
const result = JSON.parse(read(files.result));

assert.match(queue, /COACH_WORKFLOW_ACTION_TYPE/);
assert.match(queue, /OPEN_WORKOUTS/);
assert.match(queue, /OPEN_ACCESS/);
assert.match(queue, /OPEN_FINANCE/);
assert.match(queue, /primaryAction/);
assert.match(queue, /secondaryAction/);
assert.match(queue, /resolveCoachWorkflowAction/);
assert.match(queue, /montarUrlContextualAluno\("treinos"/);
assert.match(queue, /alunoId=/);
assert.doesNotMatch(queue, /insert|update|delete|upsert|localStorage|sessionStorage|acknowledge|dismissed|resolved/i);
assert.match(dashboardQueue, /primaryAction/);
assert.match(dashboardQueue, /secondaryAction/);
assert.match(dashboardQueue, /aria-label/);
assert.match(alunosHook, /normalizarAlunoIdDaUrl/);
assert.match(queueTest, /OPEN_WORKOUTS/);
assert.match(queueTest, /OPEN_ACCESS/);
assert.match(queueTest, /OPEN_FINANCE/);
assert.match(queueTest, /acknowledgedAt/);
assert.match(docs, /READ_STATE: NOT_IMPLEMENTED/);
assert.match(docs, /PERSISTENCE_DECISION: NO/);
assert.equal(result.cycle, "COACH_WORKFLOW_AUTOMATION");
assert.equal(result.stage, "10.3");
assert.equal(result.decision, "IN_PROGRESS");
assert.equal(result.readState.implemented, false);
assert.equal(result.persistence.implemented, false);
assert.equal(result.supabaseChange, false);
assert.equal(result.financeImpact.functionalChange, false);
assert.equal(result.autoAction, false);

console.log("STUDENT_WORKFLOW_ACTIONS_QA=PASS");
console.log("CYCLE=COACH_WORKFLOW_AUTOMATION");
console.log("STAGE=10.3");
console.log("READ_STATE=NOT_IMPLEMENTED");
console.log("PERSISTENCE_DECISION=NO");
console.log("AUTO_ACTION=NO");
console.log("SUPABASE_CHANGE=NO");
console.log("FINANCE_FUNCTIONAL_CHANGE=NO");

function read(file) {
  return readFileSync(file, "utf8");
}
