import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, cpSync } from "node:fs";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";

export const SUPABASE_CLI_VERSION = "2.109.1";
export const REFERENCE_BASELINE_PATH = "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql";
export const EXECUTABLE_BASELINE_PATH = "supabase/migrations/20260716090000_baseline_aruka_v1.sql";
export const REFERENCE_BASELINE_SHA256 = "67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B";
export const EXPECTED_EXECUTABLE_MIGRATIONS = [
  "supabase/migrations/20260728030000_workout_delivery_integration_v1.sql",
  "supabase/migrations/20260730090000_student_identity_contract.sql",
  "supabase/migrations/20260731190000_reconcile_security_policies_and_grants.sql",
  "supabase/migrations/20260801143335_reconcile_alunos_required_fields.sql",
  "supabase/migrations/20260801173000_revoke_aoe_idempotency_anon_execute.sql",
  "supabase/migrations/20260801180000_harden_workout_templates_updated_at.sql",
  "supabase/migrations/20260811090000_student_tenure_contract_model.sql",
  "supabase/migrations/20260815120000_allow_zero_value_contract_renewal.sql",
  "supabase/migrations/20260816120000_preserve_acompanhamento_motivo_on_renewal.sql",
  "supabase/migrations/20260819090000_student_access_lifecycle.sql",
  "supabase/migrations/20260821120000_subscription_lifecycle_policy.sql",
  "supabase/migrations/20260822120000_workout_execution_history_foundation.sql",
  "supabase/migrations/20260824120000_workout_execution_session_local_date.sql",
  "supabase/migrations/20260829120000_student_pending_invite_claim.sql",
  "supabase/migrations/20260829173000_student_pending_invite_claim_permissions.sql",
  "supabase/migrations/20260830203000_pending_student_claim_allows_default_profile.sql",
  "supabase/migrations/20260831090000_fix_pending_student_claim_return.sql",
  "supabase/migrations/20260905120000_exercise_library_media_v1.sql",
];
export const EXPECTED_EPHEMERAL_MIGRATION_HISTORY = [
  "20260716090000",
  "20260728030000",
  "20260730090000",
  "20260731190000",
  "20260801143335",
  "20260801173000",
  "20260801180000",
  "20260811090000",
  "20260815120000",
  "20260816120000",
  "20260819090000",
  "20260821120000",
  "20260822120000",
  "20260824120000",
  "20260829120000",
  "20260829173000",
  "20260830203000",
  "20260831090000",
  "20260905120000",
];

export function listFiles(root, dir) {
  const absolute = join(root, dir);
  if (!existsSync(absolute)) return [];
  const out = [];
  for (const entry of readdirSync(absolute)) {
    const full = join(absolute, entry);
    const rel = relative(root, full).replaceAll("\\", "/");
    if (statSync(full).isDirectory()) out.push(...listFiles(root, rel));
    else out.push(rel);
  }
  return out.sort();
}

export function sha256CanonicalText(root, file) {
  let bytes = readFileSync(join(root, file));
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) bytes = bytes.subarray(3);
  const text = bytes.toString("utf8").replace(/\r\n?/g, "\n");
  return createHash("sha256").update(Buffer.from(text, "utf8")).digest("hex").toUpperCase();
}

export function validateSupabaseLocalContract(root = process.cwd()) {
  const errors = [];
  if (!existsSync(join(root, REFERENCE_BASELINE_PATH))) errors.push("Reference baseline missing");
  else if (sha256CanonicalText(root, REFERENCE_BASELINE_PATH) !== REFERENCE_BASELINE_SHA256) errors.push("Reference baseline SHA mismatch");
  if (existsSync(join(root, EXECUTABLE_BASELINE_PATH))) errors.push("Reference-only baseline must not be present in executable migrations");
  const executableMigrations = listFiles(root, "supabase/migrations").filter((file) => file.endsWith(".sql"));
  const missing = EXPECTED_EXECUTABLE_MIGRATIONS.filter((file) => !executableMigrations.includes(file));
  const unexpected = executableMigrations.filter((file) => !EXPECTED_EXECUTABLE_MIGRATIONS.includes(file));
  if (missing.length) errors.push(`Expected executable migration missing: ${missing.join(", ")}`);
  if (unexpected.length) errors.push(`Unexpected executable migration found: ${unexpected.join(", ")}`);
  if (executableMigrations.join("\n") !== EXPECTED_EXECUTABLE_MIGRATIONS.join("\n")) errors.push("Executable migration chain mismatch");
  return {
    ok: errors.length === 0,
    errors,
    reference_baseline: REFERENCE_BASELINE_PATH,
    reference_baseline_sha256: existsSync(join(root, REFERENCE_BASELINE_PATH)) ? sha256CanonicalText(root, REFERENCE_BASELINE_PATH) : null,
    executable_migrations: executableMigrations,
    ephemeral_chain: EXPECTED_EPHEMERAL_MIGRATION_HISTORY,
  };
}

export function createEphemeralSupabaseWorkdir(root = process.cwd(), label = "supabase-local") {
  const contract = validateSupabaseLocalContract(root);
  if (!contract.ok) throw new Error(contract.errors.join("; "));

  const tempRoot = join(tmpdir(), `aruka-${label}-${process.pid}-${Date.now()}`);
  const tempSupabase = join(tempRoot, "supabase");
  mkdirSync(join(tempSupabase, "migrations"), { recursive: true });
  mkdirSync(join(tempSupabase, "reference-baselines"), { recursive: true });

  cpSync(join(root, "supabase/config.toml"), join(tempSupabase, "config.toml"));
  if (existsSync(join(root, "supabase/seed.sql"))) cpSync(join(root, "supabase/seed.sql"), join(tempSupabase, "seed.sql"));
  cpSync(join(root, REFERENCE_BASELINE_PATH), join(tempRoot, REFERENCE_BASELINE_PATH));
  cpSync(join(root, REFERENCE_BASELINE_PATH), join(tempRoot, EXECUTABLE_BASELINE_PATH));
  for (const migration of EXPECTED_EXECUTABLE_MIGRATIONS) cpSync(join(root, migration), join(tempRoot, migration));

  const cleanup = () => {
    const resolved = join(tempRoot);
    if (!resolved.startsWith(tmpdir())) throw new Error("Refusing to remove temp workdir outside tmpdir");
    rmSync(resolved, { recursive: true, force: true });
  };

  return {
    root: tempRoot,
    supabaseDir: tempSupabase,
    cleanup,
    migration_chain: EXPECTED_EPHEMERAL_MIGRATION_HISTORY,
  };
}

export function validateNoEphemeralResidue(root = process.cwd()) {
  return !existsSync(join(root, EXECUTABLE_BASELINE_PATH));
}
