import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const files = {
  payment: read("src/features/financeiro/components/modals/PagamentoModal.jsx"),
  financeHook: read("src/features/financeiro/hooks/useFinanceiroPage.js"),
  dashboard: read("src/features/dashboard/components/DashboardPage.jsx"),
  queue: read("src/features/dashboard/components/DashboardCoachAttentionQueue.jsx"),
  smartManagement: read("src/features/dashboard/components/DashboardSmartManagement.jsx"),
  revenue: read("src/features/dashboard/components/DashboardAtalhos.jsx"),
  css: read("src/index.css"),
};

assert.match(files.payment, /contentClassName="pagamento-modal"/);
assert.match(files.payment, /className="pagamento-modal-scroll"/);
assert.match(files.payment, /className="financeiro-modal-footer pagamento-modal-footer"/);
assert.match(files.payment, /disabled=\{atualizando\}/);
assert.match(files.payment, /aria-busy=\{atualizando\}/);
assert.match(files.financeHook, /if \(atualizandoId\) return;/);
assert.match(files.financeHook, /Pagamento registrado/);
assert.match(files.financeHook, /Não foi possível registrar o pagamento/);
assert.match(files.css, /\.pagamento-modal-scroll[\s\S]*?overflow-y: auto/);
assert.match(files.css, /height: 100dvh !important/);
assert.match(files.css, /safe-area-inset-bottom/);

const order = [
  "<DashboardHeader",
  "dashboard-operational-section",
  "<DashboardCoachAttentionQueue",
  "<DashboardSinaisFitness",
  "dashboard-financial-section",
  "dashboard-tools-section",
].map((token) => files.dashboard.indexOf(token));
assert.ok(order.every((position) => position >= 0));
assert.deepEqual(order, [...order].sort((a, b) => a - b));

assert.match(files.queue, /aria-expanded=\{expanded\}/);
assert.match(files.queue, /getVisibleAttentionItems\(group, showAll\)/);
assert.match(files.queue, /Ver todos/);
assert.match(files.queue, /Marcar como visto/);
assert.match(files.queue, /item\.primaryAction/);
assert.doesNotMatch(files.smartManagement, /activeLocationsCount|activeServicesCount/);
assert.match(files.smartManagement, /to="\/gestao-inteligente"/);
assert.match(files.revenue, /sr-only dashboard-revenue-table/);
assert.match(files.revenue, /Ver relatórios e histórico/);
assert.match(files.css, /min-width: 360px/);
assert.match(files.css, /repeat\(2, minmax\(0, 1fr\)\)/);

console.log("CYCLE_1_DASHBOARD_RESPONSIVE=PASS");
console.log("PAYMENT_MOBILE_REGRESSION=PASS");
console.log("ATTENTION_QUEUE_GROUPING=PASS");

function read(path) {
  return readFileSync(path, "utf8");
}
