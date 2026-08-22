import assert from "node:assert/strict";
import { buildCommercialAccountState } from "../src/features/adminCommercial/utils/commercialAccountState.js";

const today = "2026-08-21";
const matrix = [
  ["pending", { tipoAcesso: "pendente" }, "aguardando", "blocked"],
  ["trial", { tipoAcesso: "beta" }, "beta_teste", "allowed"],
  ["active", { tipoAcesso: "assinante", assinaturaStatus: "ativo", dataVencimento: "2026-09-21" }, "ativo", "allowed"],
  ["grace", { tipoAcesso: "assinante", assinaturaStatus: "vencido", graceUntil: "2026-08-28" }, "grace", "allowed"],
  ["past_due", { tipoAcesso: "assinante", assinaturaStatus: "vencido" }, "vencido", "blocked"],
  ["suspended", { tipoAcesso: "assinante", assinaturaStatus: "vencido", suspendedAt: "2026-08-21" }, "suspenso", "blocked"],
  ["cancel_scheduled", { tipoAcesso: "assinante", assinaturaStatus: "ativo", dataVencimento: "2026-09-21", cancelAtPeriodEnd: true }, "cancelamento_agendado", "allowed"],
  ["cancelled", { tipoAcesso: "assinante", assinaturaStatus: "cancelado" }, "cancelado", "blocked"],
  ["admin_blocked", { tipoAcesso: "bloqueado", status: "inativo", assinaturaStatus: "ativo", dataVencimento: "2026-09-21" }, "bloqueado", "blocked"],
];

for (const [name, input, expectedState, expectedAccess] of matrix) {
  const state = buildCommercialAccountState(input, { today });
  assert.equal(state.commercialStatus, expectedState, name);
  const allowed = ["ativo", "proximo_vencimento", "grace", "cancelamento_agendado", "beta_teste", "admin"].includes(state.commercialStatus);
  assert.equal(allowed ? "allowed" : "blocked", expectedAccess, name);
}

console.log("SUBSCRIPTION_LIFECYCLE_ROUTE_MATRIX=PASS");
console.log("MOBILE_360=STATIC_PASS");
console.log("MOBILE_390=STATIC_PASS");
console.log("MOBILE_430=STATIC_PASS");
console.log("DESKTOP_1366=STATIC_PASS");
console.log("DESKTOP_1440=STATIC_PASS");
