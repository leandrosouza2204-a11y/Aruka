import { queryJson, runPsql } from "./supabase-cycle-8-lib.mjs";
import { assertLocalSmartManagementQaEnvironment, buildCleanupSql, buildSetupSql, FIXTURE_IDS, QA_SMART_MANAGEMENT_EMAIL } from "./lib/local-smart-management-qa-fixtures.mjs";

assertLocalSmartManagementQaEnvironment();
runPsql(process.cwd(), process.argv.includes("--cleanup") ? buildCleanupSql() : buildSetupSql());
const action = process.argv.includes("--cleanup") ? "CLEANED" : "READY";
const rows = queryJson(process.cwd(), `
  select u.email, p.user_id = u.id as owned
  from auth.users u join public.perfis p on p.user_id = u.id
  where lower(u.email) = '${QA_SMART_MANAGEMENT_EMAIL}'
`);
if (rows.length !== 1 || !rows[0].owned) throw new Error("QA_PROFESSIONAL_OWNER_RESOLUTION_FAILED");
console.log(`LOCAL_SMART_MANAGEMENT_QA_${action}`);
console.log(`FIXTURE_RECORD_IDS=${Object.keys(FIXTURE_IDS).length}`);
