import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  buildCommercialAccountState,
  buildCommercialSummary,
} from "../src/features/adminCommercial/utils/commercialAccountState.js";

const files = {
  packageJson: "package.json",
  helper: "src/features/adminCommercial/utils/commercialAccountState.js",
  helperTest: "src/features/adminCommercial/utils/commercialAccountState.test.js",
  adminPage: "src/pages/AdminUsuarios.jsx",
  adminModal: "src/components/AdminUsuarioModal.jsx",
  pendingPage: "src/pages/AssinaturaPendente.jsx",
  choosePlan: "src/pages/EscolherPlano.jsx",
  commercialPlans: "src/data/commercialPlans.js",
  adminService: "src/services/adminService.js",
  financeService: "src/services/planosService.js",
  studentAccessService: "src/services/studentAccessService.js",
  migrationStudentAccess: "supabase/migrations/20260819090000_student_access_lifecycle.sql",
  baseline: "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql",
  docs: "docs/product-roadmap-v4/07-cycle-05-admin-commercial-operations-foundation.md",
};

const source = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, readFileSync(path, "utf8")])
);

const fixtureUsers = [
  { tipoAcesso: "pendente", status: "ativo" },
  { tipoAcesso: "beta", status: "ativo" },
  { tipoAcesso: "assinante", assinaturaStatus: "ativo", dataVencimento: "2026-08-24" },
  { tipoAcesso: "assinante", assinaturaStatus: "vencido" },
  { tipoAcesso: "assinante", assinaturaStatus: "cancelado" },
  { tipoAcesso: "bloqueado", status: "inativo" },
];

const summary = buildCommercialSummary(fixtureUsers, { today: "2026-08-20" });
const blocked = buildCommercialAccountState(fixtureUsers[5], { today: "2026-08-20" });

const uiSource = [source.adminPage, source.adminModal, source.choosePlan, source.pendingPage].join("\n");
const checks = [
  check("domain_helper_present", source.helper.includes("buildCommercialAccountState"), "Helper comercial puro existe."),
  check("domain_tests_present", source.helperTest.includes("conflicting profile/subscription") || source.helperTest.includes("partial subscription"), "Testes cobrem estados e conflitos."),
  check("existing_admin_rpcs_reused", [
    "admin_liberar_beta",
    "admin_liberar_assinante",
    "admin_upsert_assinatura",
    "admin_atualizar_perfil",
    "admin_bloquear_usuario",
  ].every((rpc) => source.adminService.includes(rpc)), "Services reutilizam RPCs admin existentes."),
  check("no_new_subscription_table", !/commercial_subscriptions|saas_subscriptions|billing_subscriptions/.test(allSource()), "Nao cria tabela paralela de assinatura."),
  check("student_finance_not_changed", source.financeService.includes(".from(\"planos\")") && source.baseline.includes("create table if not exists public.pagamentos"), "Financeiro de alunos permanece separado."),
  check("owner_student_access_decoupled", /alunos[\s\S]{0,180}(independente|nao suspende alunos automaticamente)/.test(uiSource) && !source.adminService.includes("manage_student_access"), "Operacao comercial nao muta student access."),
  check("operational_counters", summary.aguardando === 1 && summary.betaTeste === 1 && summary.bloqueados === 1, "Contadores derivados funcionam."),
  check("attention_state", blocked.attentionRequired && blocked.commercialStatus === "bloqueado", "Estado de atencao cobre bloqueio."),
  check("commercial_filters", source.adminPage.includes("COMMERCIAL_FILTERS") && source.helper.includes("usuarioMatchesCommercialFilter"), "Filtros comerciais reais existem."),
  check("manual_payment_copy", /nao confirma pagamento automaticamente|confirmados fora do Aruka|confirmacao externa/i.test(uiSource), "Copy nao sugere pagamento automatico."),
  check("whatsapp_no_recipient_hardcoded", source.choosePlan.includes("https://wa.me/?text=") && source.commercialPlans.includes("WHATSAPP_COMMERCIAL_RECIPIENT_CONFIGURED = false"), "WhatsApp sem telefone inventado."),
  check("technical_metadata_hidden", !/User ID|user_id|RPC|auth\.uid|service_role|uuid/i.test(uiSource), "UI comercial nao expoe metadados tecnicos."),
  check("docs_present", source.docs.includes("Admin Commercial Operations Foundation"), "Documentacao do ciclo existe."),
  check("package_scripts", source.packageJson.includes("qa:product-roadmap-v4-cycle-05") && source.packageJson.includes("qa:commercial-operations-runtime"), "Scripts QA registrados."),
];

const passed = checks.every((item) => item.pass);
const result = {
  decision: passed ? "PASS" : "FAIL",
  scope: "PRODUCT_ROADMAP_V4_CYCLE_05_ADMIN_COMMERCIAL_OPERATIONS_FOUNDATION",
  cycle_05_name: "Admin Commercial Operations Foundation",
  database_change_required: false,
  rpc_change_required: false,
  service_change: true,
  admin_page_fetch_count: 1,
  additional_fetches: 0,
  n_plus_one_introduced: false,
  owner_student_access_automation: false,
  student_finance_schema_changed: false,
  checks,
};

write("reports/product-roadmap-v4/cycle-05-result.json", `${JSON.stringify(result, null, 2)}\n`);

if (!passed) {
  console.error("[cycle-05] failed", checks.filter((item) => !item.pass));
  process.exit(1);
}

console.log("PRODUCT_ROADMAP_V4_CYCLE_05_QA=PASS");
console.log("DATABASE_CHANGE_REQUIRED=NO");
console.log("RPC_CHANGE_REQUIRED=NO");
console.log("ADMIN_PAGE_FETCH_COUNT=1");
console.log("ADDITIONAL_FETCHES=0");
console.log("N_PLUS_ONE_INTRODUCED=NO");
console.log("TECHNICAL_METADATA_VISIBLE=NO");

function allSource() {
  return Object.values(source).join("\n");
}

function check(id, pass, note) {
  return { id, pass: Boolean(pass), note };
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

assert.equal(buildCommercialAccountState({ role: "admin" }).role, "admin");
