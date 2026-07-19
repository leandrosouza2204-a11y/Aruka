import {
  BASELINE_PATH,
  DECISION,
  EXPECTED_BASELINE_SHA,
  collectFixtureCounts,
  collectInventory,
  listFiles,
  nowIso,
  queryJson,
  scanFilesForUnsafeContent,
  sha256CanonicalText,
  validateLocalGuard,
  writeJsonReport,
  writeMarkdownReport,
} from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const startedAt = nowIso();
const started = Date.now();
const errors = [];

function fail(message) {
  errors.push(message);
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) fail(`${label}: expected ${expected}, got ${actual}`);
}

let counts = {};
let inventory = null;
let duplicateRows = [];
let fkViolations = [];

try {
  const guard = validateLocalGuard(root);
  if (!guard.ok) guard.errors.forEach(fail);
  if (sha256CanonicalText(root, BASELINE_PATH) !== EXPECTED_BASELINE_SHA) fail("Official baseline SHA mismatch");

  inventory = collectInventory(root);
  if (inventory.migration_history.length !== 1 || inventory.migration_history[0] !== "20260716090000") {
    fail(`Unexpected migration history: ${inventory.migration_history.join(",")}`);
  }
  counts = collectFixtureCounts(root);
  const expected = {
    admin_logs: 1,
    anamneses: 1,
    aoe_audit: 1,
    aoe_decisions: 2,
    aoe_idempotency: 1,
    aoe_reviews: 2,
    aoe_traces: 2,
    assessments: 1,
    auth_users: 2,
    followup_events: 2,
    legal_acceptances: 2,
    payments: 2,
    plans: 3,
    profiles: 2,
    students: 3,
    subscriptions: 1,
    workout_days: 1,
    workout_exercises: 2,
    workout_templates: 1,
    workouts: 1,
  };
  for (const [domain, total] of Object.entries(expected)) expectEqual(counts[domain], total, domain);

  duplicateRows = queryJson(
    root,
    `select domain, key, total from (
      select 'auth_users' as domain, email as key, count(*)::int as total from auth.users where email like '%.cycle8@example.invalid' group by email having count(*) > 1
      union all select 'aoe_idempotency', idempotency_key, count(*)::int from public.aoe_idempotency_keys where id like 'cycle8-%' group by idempotency_key having count(*) > 1
      union all select 'followup_events', event_key, count(*)::int from public.acompanhamento_eventos where event_key like 'cycle8-%' group by event_key having count(*) > 1
    ) d`
  );
  if (duplicateRows.length) fail("Duplicate fixture records found");

  fkViolations = queryJson(
    root,
    `select issue from (
      select 'student_user_missing' as issue from public.alunos a left join auth.users u on u.id = a.user_id where a.id in ('00000000-0000-4000-8000-000000000821','00000000-0000-4000-8000-000000000822','00000000-0000-4000-8000-000000000823') and u.id is null
      union all select 'payment_student_missing' from public.pagamentos p left join public.alunos a on a.id = p.aluno_id where p.id in ('00000000-0000-4000-8000-000000000881','00000000-0000-4000-8000-000000000882') and a.id is null
      union all select 'workout_student_missing' from public.treinos t left join public.alunos a on a.id = t.aluno_id where t.id = '00000000-0000-4000-8000-000000000821' and a.id is null
      union all select 'aoe_decision_student_missing' from public.aoe_decisions d left join public.alunos a on a.id = d.student_id where d.id like 'cycle8-%' and a.id is null
    ) issues`
  );
  if (fkViolations.length) fail("Fixture foreign key validation failed");

  const personalDataRows = queryJson(
    root,
    `select issue from (
      select 'non_fixture_email' as issue from auth.users where id in ('00000000-0000-4000-8000-000000000801','00000000-0000-4000-8000-000000000802') and email not like '%@example.invalid'
      union all select 'cpf_like_student_observation' from public.alunos where observacoes ~ '\\m[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}-?[0-9]{2}\\M'
      union all select 'unexpected_phone' from public.alunos where id in ('00000000-0000-4000-8000-000000000821','00000000-0000-4000-8000-000000000822','00000000-0000-4000-8000-000000000823') and whatsapp !~ '^\\+550000000000[0-9]$'
    ) p`
  );
  if (personalDataRows.length) fail("Real personal data pattern found in fixtures");

  const scanTargets = [
    ...listFiles(root, "supabase/seeds"),
    "supabase/seed.sql",
    "package.json",
  ];
  const findings = scanFilesForUnsafeContent(root, scanTargets);
  if (findings.length) fail(`Unsafe content scan failed: ${findings.map((item) => `${item.file} ${item.reason}`).join("; ")}`);
} catch (error) {
  fail(error.message);
}

const payload = {
  cycle: "8",
  result: errors.length ? "DETERMINISTIC_FIXTURES_REJECTED" : "DETERMINISTIC_FIXTURES_VALIDATED",
  decision: errors.length ? "LOCAL_SEEDS_AND_SAFE_RESET_REJECTED" : DECISION,
  started_at: startedAt,
  finished_at: nowIso(),
  duration_seconds: Number(((Date.now() - started) / 1000).toFixed(3)),
  fixtures_loaded: !errors.length,
  idempotency_runs: 2,
  idempotency_validated: !errors.length,
  duplicate_records_found: duplicateRows.length > 0,
  foreign_keys_validated: fkViolations.length === 0,
  expected_ids_validated: !errors.some((error) => /expected/.test(error)),
  expected_counts_validated: !errors.some((error) => /expected/.test(error)),
  real_personal_data_found: errors.some((error) => /personal data/.test(error)),
  credential_scan_passed: !errors.some((error) => /Unsafe content/.test(error)),
  remote_url_scan_passed: !errors.some((error) => /URL/.test(error)),
  domain_counts: counts,
  inventory,
  errors,
  primary_error: errors[0] ?? null,
  residual_risks: [],
};

writeJsonReport(root, "fixtures-result.json", payload);
writeMarkdownReport(root, "fixtures-summary.md", [
  "# Cycle 8 Fixture Validation",
  "",
  `- Result: ${payload.result}`,
  `- Decision: ${payload.decision}`,
  `- Idempotency validated: ${payload.idempotency_validated ? "yes" : "no"}`,
  `- Duplicate records found: ${payload.duplicate_records_found ? "yes" : "no"}`,
  `- Foreign keys validated: ${payload.foreign_keys_validated ? "yes" : "no"}`,
  `- Credential scan passed: ${payload.credential_scan_passed ? "yes" : "no"}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
  "",
  "| Domain | Count |",
  "| --- | ---: |",
  ...Object.entries(counts).map(([domain, total]) => `| ${domain} | ${total} |`),
]);

if (errors.length) {
  console.error("Cycle 8 fixture validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("DETERMINISTIC_FIXTURES_VALIDATED");
