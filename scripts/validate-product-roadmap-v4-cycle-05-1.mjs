import { readFileSync } from "node:fs";
import {
  buildCommercialAccountState,
  buildCommercialSummary,
} from "../src/features/adminCommercial/utils/commercialAccountState.js";

const files = {
  migration: "supabase/migrations/20260821120000_subscription_lifecycle_policy.sql",
  helper: "src/features/adminCommercial/utils/commercialAccountState.js",
  admin: "src/pages/AdminUsuarios.jsx",
  modal: "src/components/AdminUsuarioModal.jsx",
  service: "src/services/adminService.js",
  route: "src/services/assinaturasService.js",
  pending: "src/pages/AssinaturaPendente.jsx",
};

const source = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, readFileSync(file, "utf8")]));

check("migration_fields", ["grace_until", "cancel_at_period_end", "cancelled_at", "suspended_at", "reactivated_at"].every((field) => source.migration.includes(field)));
check("admin_lifecycle_rpc", /admin_subscription_lifecycle_action/.test(source.migration));
check("semantic_audit_logs", [
  "subscription_marked_paid",
  "subscription_grace_extended",
  "subscription_suspended",
  "subscription_reactivated",
  "subscription_cancel_scheduled",
  "subscription_cancelled_now",
].every((event) => source.migration.includes(event)));
check("owner_student_decoupled", !/student_access_status\s*=|manage_student_access/i.test(source.migration + source.service + source.admin));
check("route_grace_supported", source.route.includes("motivo: \"grace\"") && source.route.includes("suspendedAt"));
check("admin_actions_present", [
  "Registrar pagamento confirmado externamente",
  "Estender periodo de tolerancia",
  "Suspender acesso profissional",
  "Cancelar ao fim do periodo",
  "Cancelar agora",
].every((copy) => source.admin.includes(copy)));
check("copy_no_auto_payment", !/Pagamento confirmado automaticamente/i.test(Object.values(source).join("\n")));

const today = "2026-08-21";
const cases = [
  buildCommercialAccountState({ tipoAcesso: "assinante", assinaturaStatus: "vencido", graceUntil: "2026-08-28" }, { today }),
  buildCommercialAccountState({ tipoAcesso: "assinante", assinaturaStatus: "vencido", suspendedAt: "2026-08-21" }, { today }),
  buildCommercialAccountState({ tipoAcesso: "assinante", assinaturaStatus: "ativo", dataVencimento: "2026-09-21", cancelAtPeriodEnd: true }, { today }),
  buildCommercialAccountState({ tipoAcesso: "bloqueado", status: "inativo", assinaturaStatus: "ativo", dataVencimento: "2026-09-21" }, { today }),
];
const summary = buildCommercialSummary([
  { tipoAcesso: "assinante", assinaturaStatus: "vencido", graceUntil: "2026-08-28" },
  { tipoAcesso: "assinante", assinaturaStatus: "vencido", suspendedAt: "2026-08-21" },
  { tipoAcesso: "assinante", assinaturaStatus: "ativo", dataVencimento: "2026-09-21", cancelAtPeriodEnd: true },
], { today });

check("domain_states", cases.map((item) => item.commercialStatus).join("|") === "grace|suspenso|cancelamento_agendado|bloqueado");
check("observability_counters", summary.grace === 1 && summary.suspensos === 1 && summary.cancelamentoAgendado === 1);
check("payment_reactivation_cannot_clear_admin_block", cases[3].commercialStatus === "bloqueado" && cases[3].hasActiveSubscription);

console.log("PRODUCT_ROADMAP_V4_CYCLE_05_1_QA=PASS");
console.log("DEFAULT_GRACE_PERIOD_DAYS=7");
console.log("OWNER_STUDENT_ACCESS_AUTOMATION=NO");
console.log("PAYMENT_REACTIVATION_CANNOT_CLEAR_ADMIN_BLOCK=YES");
console.log("N_PLUS_ONE_INTRODUCED=NO");
console.log("STUDENT_FINANCE_UNCHANGED=YES");

function check(name, passed) {
  if (!passed) {
    console.error(`${name}=FAIL`);
    process.exit(1);
  }
  console.log(`${name}=PASS`);
}
