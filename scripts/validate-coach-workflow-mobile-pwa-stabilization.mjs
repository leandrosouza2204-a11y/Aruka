import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const files = {
  dashboard: "src/features/dashboard/components/DashboardCoachAttentionQueue.jsx",
  dashboardPage: "src/features/dashboard/components/DashboardPage.jsx",
  dashboardHook: "src/features/dashboard/hooks/useDashboardPage.js",
  queue: "src/features/alunos/utils/coachAttentionQueue.js",
  css: "src/index.css",
  docs: "docs/product-roadmap-v4-cycle-coach-workflow-automation/09-mobile-pwa-stabilization.md",
  result: "reports/product-roadmap-v4/coach-workflow-mobile-pwa-stabilization-result.json",
  summary: "reports/product-roadmap-v4/coach-workflow-mobile-pwa-stabilization-summary.md",
};

for (const file of Object.values(files)) {
  assert.equal(existsSync(file), true, `${file} must exist`);
}

const dashboard = read(files.dashboard);
const page = read(files.dashboardPage);
const hook = read(files.dashboardHook);
const queue = read(files.queue);
const css = read(files.css);
const docs = read(files.docs);
const result = JSON.parse(read(files.result));

assert.match(dashboard, /role="alert"/);
assert.match(dashboard, /role="status" aria-live="polite"/);
assert.match(dashboard, /data-testid="coach-attention-queue-retry"/);
assert.match(dashboard, /onClick=\{onRetry\}/);
assert.match(dashboard, /aria-pressed=\{acknowledged\}/);
assert.match(dashboard, /Marcar como visto/);
assert.match(page, /onRetry=\{dashboard\.recarregarDashboard\}/);
assert.match(hook, /useCallback/);
assert.match(hook, /recarregarDashboard: carregarDashboard/);
assert.match(hook, /setCarregando\(true\)/);
assert.match(hook, /Promise\.allSettled/);
assert.match(css, /@media \(max-width: 768px\)[\s\S]*?\.coach-attention-queue-item > \.app-button \{[\s\S]*?min-height: 44px;[\s\S]*?width: 100%;/);
assert.doesNotMatch(queue, /from\(|insert|update|delete|upsert|localStorage|sessionStorage/i);
assert.match(docs, /RUNTIME_AUTHENTICATED_BROWSER: NOT_EXECUTED/);
assert.match(docs, /SUPABASE_CHANGE: NO/);
assert.equal(result.cycle, "COACH_WORKFLOW_AUTOMATION");
assert.equal(result.stage, "10.5");
assert.equal(result.supabaseChange, false);
assert.equal(result.persistence.implemented, false);
assert.equal(result.autoAction, false);

console.log("COACH_WORKFLOW_MOBILE_PWA_STABILIZATION_QA=PASS");
console.log("RETRY=RELOAD_CALLBACK");
console.log("MOBILE_TOUCH_TARGET=44PX");
console.log("ACCESSIBILITY=STATIC_CONTRACT_PASS");
console.log("PERSISTENCE=NO");
console.log("SUPABASE_CHANGE=NO");
console.log("AUTHENTICATED_RUNTIME=NOT_EXECUTED");

function read(file) {
  return readFileSync(file, "utf8").replace(/\r\n/g, "\n");
}
