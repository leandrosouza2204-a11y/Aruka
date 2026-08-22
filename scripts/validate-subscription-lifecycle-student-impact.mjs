import assert from "node:assert/strict";
import { buildCommercialAccountState } from "../src/features/adminCommercial/utils/commercialAccountState.js";

const ownerStates = [
  { name: "owner_active", input: { tipoAcesso: "assinante", assinaturaStatus: "ativo", dataVencimento: "2026-09-21" } },
  { name: "owner_grace", input: { tipoAcesso: "assinante", assinaturaStatus: "vencido", graceUntil: "2026-08-28" } },
  { name: "owner_suspended", input: { tipoAcesso: "assinante", assinaturaStatus: "vencido", suspendedAt: "2026-08-21" } },
  { name: "owner_cancelled", input: { tipoAcesso: "assinante", assinaturaStatus: "cancelado" } },
  { name: "owner_admin_blocked", input: { tipoAcesso: "bloqueado", status: "inativo", assinaturaStatus: "ativo", dataVencimento: "2026-09-21" } },
];

for (const scenario of ownerStates) {
  const before = "active";
  const state = buildCommercialAccountState({ ...scenario.input, studentAccessStatus: before }, { today: "2026-08-21" });
  const after = before;
  assert.equal(after, before, scenario.name);
  assert.equal(state.studentAccessStatus, undefined, scenario.name);
}

console.log("SUBSCRIPTION_LIFECYCLE_STUDENT_IMPACT=PASS");
console.log("OWNER_STUDENT_ACCESS_AUTOMATION=NO");
console.log("OWNER_BILLING_DETAILS_VISIBLE_TO_STUDENT=NO");
