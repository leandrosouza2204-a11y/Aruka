import { queryJson } from "./supabase-cycle-8-lib.mjs";
import { assertLocalSmartManagementQaEnvironment, FIXTURE_COUNTS, FIXTURE_IDS, QA_SMART_MANAGEMENT_EMAIL, validateFixtureRows } from "./lib/local-smart-management-qa-fixtures.mjs";

assertLocalSmartManagementQaEnvironment();
const ids = Object.values(FIXTURE_IDS).map((id) => `'${id}'`).join(", ");
const rows = queryJson(process.cwd(), `
  with owner as (
    select u.id from auth.users u join public.perfis p on p.user_id = u.id
    where lower(u.email) = '${QA_SMART_MANAGEMENT_EMAIL}' and p.role = 'user' and p.status = 'ativo'
  )
  select 'services' as kind, s.pricing_model as model, s.status, s.professional_id = (select id from owner) as owned
  from public.smart_management_services s where s.id in (${ids})
  union all
  select 'locations', null, l.status, l.professional_id = (select id from owner) from public.smart_management_locations l where l.id in (${ids})
  union all
  select 'rules', r.rule_type, r.status, r.professional_id = (select id from owner) from public.smart_management_transfer_rules r where r.id in (${ids})
  union all
  select 'tiers', null, 'active', t.professional_id = (select id from owner) from public.smart_management_transfer_tiers t where t.id in (${ids})
`);
const result = validateFixtureRows(rows);
if (!result.ok) throw new Error(`LOCAL_SMART_MANAGEMENT_QA_INVALID: ${result.errors.join('; ')}`);
console.log("LOCAL_SMART_MANAGEMENT_QA_VALID=YES");
console.log(`SERVICES=${FIXTURE_COUNTS.services} LOCATIONS=${FIXTURE_COUNTS.locations} RULES=${FIXTURE_COUNTS.rules} TIERS=${FIXTURE_COUNTS.tiers}`);
