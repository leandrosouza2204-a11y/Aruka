import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const files = {
  definition: "docs/product-roadmap-v4-cycle-coach-workflow-automation/00-cycle-definition.md",
  audit: "docs/product-roadmap-v4-cycle-coach-workflow-automation/01-current-workflow-audit.md",
  result: "reports/product-roadmap-v4/coach-workflow-automation-discovery-result.json",
  summary: "reports/product-roadmap-v4/coach-workflow-automation-discovery-summary.md",
  domain: "src/features/alunos/utils/coachWorkflowSignals.js",
  studentArea: "src/pages/MinhaArea.jsx",
};

for (const file of Object.values(files)) {
  assert.equal(existsSync(file), true, `${file} must exist`);
}

const definition = read(files.definition);
const audit = read(files.audit);
const result = JSON.parse(read(files.result));
const summary = read(files.summary);
const domain = read(files.domain);
const studentArea = read(files.studentArea);
const docs = `${definition}\n${audit}\n${summary}`;

assert.equal(result.cycle, "COACH_WORKFLOW_AUTOMATION");
assert.equal(result.stage, "10.1");
assert.equal(result.decision, "COMPLETE");
assert.equal(result.supabaseImpact.stage10_1Changed, false);
assert.equal(result.architecture.calculatedVsPersisted, "CALCULATED_ONLY_FOR_10_1");
assert.equal(result.architecture.cronRequired, false);
assert.equal(result.architecture.edgeFunctionRequired, false);
assert.equal(result.architecture.externalNotificationRequired, false);
assert.match(definition, /DETECT -> PRIORITIZE -> SURFACE -> SUPPORT DECISION/);
assert.match(definition, /NO_RELIABLE_STALLED_SIGNAL_YET/);
assert.match(audit, /Signal Inventory/);
assert.match(audit, /WORKOUT_REVIEW_DUE/);
assert.match(audit, /NO_ASSESSMENT/);
assert.match(audit, /CALCULATED_ONLY/);
assert.match(summary, /NEXT_STAGE: 10\.2 Coach Attention Queue/);
assert.match(domain, /buildCoachWorkflowSignals/);
assert.doesNotMatch(domain, /from\(["']coach_workflow|insert|update|delete|upsert/i);
assert.doesNotMatch(studentArea, /coach-workflow-signals/);
assert.doesNotMatch(docs, /WhatsApp automation|SMS automation|email automation|push notification automation/i);

console.log("COACH_WORKFLOW_AUTOMATION_DISCOVERY_QA=PASS");
console.log("CYCLE=COACH_WORKFLOW_AUTOMATION");
console.log("STAGE=10.1");
console.log("FIRST_STAGE_READY_FOR_IMPLEMENTATION=YES");
console.log("STALLED_STUDENT_CAPABILITY=PARTIAL_NO_RELIABLE_BROAD_LAST_ACTIVITY");
console.log("PENDING_ACTION_CAPABILITY=PARTIAL_EXISTING_SIGNALS");
console.log("CALCULATED_VS_PERSISTED=CALCULATED_ONLY");
console.log("CRON_REQUIRED=NO");
console.log("EDGE_FUNCTION_REQUIRED=NO");
console.log("EXTERNAL_NOTIFICATION_REQUIRED=NO");
console.log("SUPABASE_CHANGE=NO");
console.log("NEXT_STAGE=10.2_COACH_ATTENTION_QUEUE");

function read(file) {
  return readFileSync(file, "utf8");
}
