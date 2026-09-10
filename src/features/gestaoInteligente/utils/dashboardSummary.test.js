import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSmartManagementDashboardSummary,
  SMART_MANAGEMENT_DASHBOARD_STATE,
} from "./dashboardSummary.js";

test("resume configuração vazia sem inventar percentual", () => {
  const summary = buildSmartManagementDashboardSummary();
  assert.equal(summary.state, SMART_MANAGEMENT_DASHBOARD_STATE.EMPTY);
  assert.equal(summary.activeLocationsCount, 0);
  assert.equal(summary.activeServicesCount, 0);
  assert.match(summary.message, /Configure seus locais e serviços/);
});

test("orienta quando existem apenas locais ativos", () => {
  const summary = buildSmartManagementDashboardSummary({ activeLocationsCount: 1, activeServicesCount: 0 });
  assert.equal(summary.state, SMART_MANAGEMENT_DASHBOARD_STATE.LOCATIONS_ONLY);
  assert.match(summary.message, /Falta adicionar seus serviços/);
});

test("orienta quando existem apenas serviços ativos", () => {
  const summary = buildSmartManagementDashboardSummary({ activeLocationsCount: 0, activeServicesCount: 1 });
  assert.equal(summary.state, SMART_MANAGEMENT_DASHBOARD_STATE.SERVICES_ONLY);
  assert.match(summary.message, /Adicione seus locais/);
});

test("fica pronto somente com local e serviço ativos", () => {
  const summary = buildSmartManagementDashboardSummary({ activeLocationsCount: 2, activeServicesCount: 3 });
  assert.equal(summary.state, SMART_MANAGEMENT_DASHBOARD_STATE.READY);
  assert.match(summary.message, /pronta para simulações e comparações/);
});

test("normaliza contagens inválidas sem criar dado", () => {
  const summary = buildSmartManagementDashboardSummary({ activeLocationsCount: -2, activeServicesCount: "invalido" });
  assert.deepEqual(
    [summary.activeLocationsCount, summary.activeServicesCount, summary.state],
    [0, 0, SMART_MANAGEMENT_DASHBOARD_STATE.EMPTY]
  );
});
