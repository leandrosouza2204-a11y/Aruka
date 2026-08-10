import assert from "node:assert/strict";
import test from "node:test";
import {
  validateAllowedStatements,
  validateAuthenticatedTableGrantContract,
  validateForbiddenSql,
  validateGrantSafety,
  validatePolicySafety,
  validateSecurityReconciliation,
  validateTimestamp,
} from "./validate-supabase-security-reconciliation.mjs";

const validSql = `
begin;
drop policy if exists "p" on public.perfis;
create policy "p" on public.perfis for select to authenticated using (auth.uid() = user_id);
revoke all on table public.perfis from anon;
revoke all on table public.perfis from authenticated;
grant select, insert on table public.perfis to authenticated;
revoke all on function public.f(uuid) from anon;
grant execute on function public.f(uuid) to authenticated;
comment on schema public is 'phase 1';
commit;
`;

test("valid security reconciliation passes", () => {
  assert.deepEqual(validateSecurityReconciliation({
    migrationName: "20260731190000_reconcile_security_policies_and_grants.sql",
    sql: readFixtureMigration(),
    migrations: ["20260731190000_reconcile_security_policies_and_grants.sql"],
  }), []);
});

test("timestamp must be after prior migrations", () => {
  assert.match(validateTimestamp("20260728030000_reconcile_security_policies_and_grants.sql").join("\n"), /after previous/);
});

test("blocks table creation", () => {
  assert.match(validateAllowedStatements("create table public.x(id uuid);").join("\n"), /outside phase 1/);
});

test("blocks column and constraint changes", () => {
  assert.match(validateForbiddenSql("alter table public.alunos alter column valor set not null;").join("\n"), /alter outside|schema contract/);
});

test("blocks data writes", () => {
  assert.match(validateForbiddenSql("update public.pagamentos set valor = 1;").join("\n"), /data write|financial/);
});

test("blocks permissive true policies", () => {
  assert.match(validatePolicySafety("create policy p on public.x for select to authenticated using (true);").join("\n"), /USING true/);
});

test("blocks anon policy and grants", () => {
  assert.match(validatePolicySafety("create policy p on public.x for select to anon using (auth.uid() is not null);").join("\n"), /anon/);
  assert.match(validateGrantSafety("grant insert on table public.x to anon;").join("\n"), /anon/);
});

test("blocks public execute grant", () => {
  assert.match(validateGrantSafety("grant execute on function public.f(uuid) to public;").join("\n"), /EXECUTE/);
});

test("allows minimal authenticated table grants", () => {
  assert.deepEqual(validateAllowedStatements(validSql), []);
});

test("blocks excessive authenticated table grants", () => {
  assert.match(validateAuthenticatedTableGrantContract(`
    revoke all on table public.admin_logs from authenticated;
    grant select, insert, update, delete on table public.admin_logs to authenticated;
  `).join("\n"), /excessive privileges on admin_logs/);
});

test("blocks missing authenticated revoke before grant convergence", () => {
  assert.match(validateAuthenticatedTableGrantContract(`
    grant select on table public.admin_logs to authenticated;
  `).join("\n"), /revoke missing/);
});

test("blocks function execute grants without signatures", () => {
  assert.match(validateGrantSafety("grant execute on function public.entregar_treino to authenticated;").join("\n"), /signature/);
});

test("blocks platform role changes", () => {
  assert.match(validateGrantSafety("grant select on table public.alunos to service_role;").join("\n"), /platform role/);
});

function readFixtureMigration() {
  return `
begin;
${Object.entries({
  perfis: "select, insert",
  alunos: "select, insert, update, delete",
  planos: "select, insert, update, delete",
  assinaturas: "select, insert",
  pagamentos: "select, insert, update, delete",
  admin_logs: "select",
  aceites_legais: "select, insert",
  avaliacoes: "select, insert, update, delete",
  anamneses: "select, insert, update, delete",
  treinos: "select, insert, update, delete",
  treino_dias: "select, insert, update, delete",
  treino_exercicios: "select, insert, update, delete",
  acompanhamento_eventos: "select, insert",
  workout_templates: "select, insert, update, delete",
  aoe_decisions: "select, insert",
  aoe_decision_traces: "select",
  aoe_human_reviews: "select, insert, update",
  aoe_idempotency_keys: "select, insert, update, delete",
  aoe_audit_events: "select",
}).map(([table, grants]) => `
revoke all on table public.${table} from authenticated;
grant ${grants} on table public.${table} to authenticated;`).join("\n")}
revoke all on function public.f(uuid) from anon;
grant execute on function public.f(uuid) to authenticated;
commit;
`;
}
