import { readLocalSupabaseRuntime } from "./local-supabase-runtime.mjs";

export const QA_SMART_MANAGEMENT_EMAIL = "qa.local@aruka.test";
export const FIXTURE_TAG = "LOCAL_QA_SMART_MANAGEMENT";
export const FIXTURE_IDS = {
  servicePerSession: "00000000-0000-4000-8000-000000000911",
  servicePerStudent: "00000000-0000-4000-8000-000000000912",
  serviceMonthly: "00000000-0000-4000-8000-000000000913",
  serviceFixed: "00000000-0000-4000-8000-000000000914",
  locationNone: "00000000-0000-4000-8000-000000000921",
  locationFixed: "00000000-0000-4000-8000-000000000922",
  locationPerStudent: "00000000-0000-4000-8000-000000000923",
  locationPercentage: "00000000-0000-4000-8000-000000000924",
  locationTiered: "00000000-0000-4000-8000-000000000925",
  ruleNone: "00000000-0000-4000-8000-000000000931",
  ruleFixed: "00000000-0000-4000-8000-000000000932",
  rulePerStudent: "00000000-0000-4000-8000-000000000933",
  rulePercentage: "00000000-0000-4000-8000-000000000934",
  ruleTiered: "00000000-0000-4000-8000-000000000935",
  tierOne: "00000000-0000-4000-8000-000000000941",
  tierTwo: "00000000-0000-4000-8000-000000000942",
  tierThree: "00000000-0000-4000-8000-000000000943",
};

export const FIXTURE_COUNTS = { services: 4, locations: 5, rules: 5, tiers: 3 };

export function isLocalSmartManagementQaEndpoint(apiUrl) {
  try {
    return ["localhost", "127.0.0.1"].includes(new URL(apiUrl).hostname);
  } catch {
    return false;
  }
}

export function assertLocalSmartManagementQaEnvironment() {
  const runtime = readLocalSupabaseRuntime();
  if (!isLocalSmartManagementQaEndpoint(runtime.apiUrl)) throw new Error("LOCAL_ENVIRONMENT_REQUIRED");
  if (Object.values(process.env).some((value) => /supabase\.co|pooler\.supabase\.com/i.test(String(value || "")))) {
    throw new Error("LOCAL_ENVIRONMENT_REQUIRED");
  }
  return runtime;
}

export function buildSetupSql() {
  const ids = Object.values(FIXTURE_IDS).map((id) => `'${id}'`).join(", ");
  return `
begin;
do $$
declare v_owner uuid;
begin
  select u.id into v_owner
  from auth.users u join public.perfis p on p.user_id = u.id
  where lower(u.email) = '${QA_SMART_MANAGEMENT_EMAIL}' and p.role = 'user' and p.status = 'ativo';
  if v_owner is null or (select count(*) from auth.users where lower(email) = '${QA_SMART_MANAGEMENT_EMAIL}') <> 1 then
    raise exception 'QA_PROFESSIONAL_OWNER_RESOLUTION_FAILED';
  end if;

  delete from public.smart_management_services where professional_id = v_owner and id in (${ids});
  delete from public.smart_management_locations where professional_id = v_owner and id in (${ids});

  insert into public.smart_management_services (id, professional_id, name, description, service_type, pricing_model, price, sessions_per_week, sessions_per_month, sessions_in_package, session_duration_minutes, min_students, max_students)
  values
    ('${FIXTURE_IDS.servicePerSession}', v_owner, 'QA - Serviço por Sessão', '${FIXTURE_TAG}', 'personal_training', 'PER_SESSION', 100.00, null, null, null, 60, 1, 6),
    ('${FIXTURE_IDS.servicePerStudent}', v_owner, 'QA - Serviço por Aluno', '${FIXTURE_TAG}', 'personal_training', 'PER_STUDENT_SESSION', 30.00, null, null, null, 45, 2, 6),
    ('${FIXTURE_IDS.serviceMonthly}', v_owner, 'QA - Pacote Mensal', '${FIXTURE_TAG}', 'online_coaching', 'MONTHLY_PACKAGE', 520.00, null, 4, null, null, 1, 8),
    ('${FIXTURE_IDS.serviceFixed}', v_owner, 'QA - Pacote Fixo', '${FIXTURE_TAG}', 'assessment', 'FIXED_PACKAGE', 360.00, null, null, 3, 60, 1, 4);

  insert into public.smart_management_locations (id, professional_id, name, description)
  values
    ('${FIXTURE_IDS.locationNone}', v_owner, 'QA - Local Sem Repasse', '${FIXTURE_TAG}'),
    ('${FIXTURE_IDS.locationFixed}', v_owner, 'QA - Local Repasse Fixo', '${FIXTURE_TAG}'),
    ('${FIXTURE_IDS.locationPerStudent}', v_owner, 'QA - Local Repasse por Aluno', '${FIXTURE_TAG}'),
    ('${FIXTURE_IDS.locationPercentage}', v_owner, 'QA - Local Repasse Percentual', '${FIXTURE_TAG}'),
    ('${FIXTURE_IDS.locationTiered}', v_owner, 'QA - Local Repasse por Faixa', '${FIXTURE_TAG}');

  insert into public.smart_management_transfer_rules (id, location_id, professional_id, rule_type, fixed_amount, per_student_amount, percentage_rate, metadata)
  values
    ('${FIXTURE_IDS.ruleNone}', '${FIXTURE_IDS.locationNone}', v_owner, 'none', null, null, null, jsonb_build_object('fixture', '${FIXTURE_TAG}')),
    ('${FIXTURE_IDS.ruleFixed}', '${FIXTURE_IDS.locationFixed}', v_owner, 'fixed', 150.00, null, null, jsonb_build_object('fixture', '${FIXTURE_TAG}')),
    ('${FIXTURE_IDS.rulePerStudent}', '${FIXTURE_IDS.locationPerStudent}', v_owner, 'per_student', null, 12.00, null, jsonb_build_object('fixture', '${FIXTURE_TAG}')),
    ('${FIXTURE_IDS.rulePercentage}', '${FIXTURE_IDS.locationPercentage}', v_owner, 'percentage', null, null, 15.00, jsonb_build_object('fixture', '${FIXTURE_TAG}')),
    ('${FIXTURE_IDS.ruleTiered}', '${FIXTURE_IDS.locationTiered}', v_owner, 'tiered', null, null, null, jsonb_build_object('fixture', '${FIXTURE_TAG}'));

  insert into public.smart_management_transfer_tiers (id, transfer_rule_id, professional_id, min_students, max_students, amount)
  values
    ('${FIXTURE_IDS.tierOne}', '${FIXTURE_IDS.ruleTiered}', v_owner, 1, 2, 20.00),
    ('${FIXTURE_IDS.tierTwo}', '${FIXTURE_IDS.ruleTiered}', v_owner, 3, 5, 50.00),
    ('${FIXTURE_IDS.tierThree}', '${FIXTURE_IDS.ruleTiered}', v_owner, 6, null, 90.00);
end $$;
commit;`;
}

export function buildCleanupSql() {
  const ids = Object.values(FIXTURE_IDS).map((id) => `'${id}'`).join(", ");
  return `begin;
do $$ declare v_owner uuid; begin
  select u.id into v_owner from auth.users u join public.perfis p on p.user_id = u.id
  where lower(u.email) = '${QA_SMART_MANAGEMENT_EMAIL}' and p.role = 'user' and p.status = 'ativo';
  if v_owner is null then raise exception 'QA_PROFESSIONAL_OWNER_RESOLUTION_FAILED'; end if;
  delete from public.smart_management_services where professional_id = v_owner and id in (${ids});
  delete from public.smart_management_locations where professional_id = v_owner and id in (${ids});
end $$;
commit;`;
}

export function validateFixtureRows(rows) {
  const byKind = Object.groupBy(rows, (row) => row.kind);
  const errors = [];
  for (const [kind, count] of Object.entries(FIXTURE_COUNTS)) {
    if ((byKind[kind] || []).length !== count) errors.push(`${kind}: expected ${count}`);
  }
  if (rows.some((row) => !row.owned || row.status !== "active")) errors.push("ownership or active status failed");
  if (new Set((byKind.services || []).map((row) => row.model)).size !== 4) errors.push("pricing coverage failed");
  if (new Set((byKind.rules || []).map((row) => row.model)).size !== 5) errors.push("transfer coverage failed");
  return { ok: errors.length === 0, errors };
}
