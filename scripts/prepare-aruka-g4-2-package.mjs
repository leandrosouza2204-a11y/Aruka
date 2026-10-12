import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";

const root = process.cwd();
const migrationRoot = join(root, "supabase", "migrations");
const args = process.argv.slice(2);
const outputArg = valueAfter("--output");

if (!outputArg || args.includes("--execute")) {
  throw new Error("PREPARE_ONLY_REQUIRES_EXPLICIT_OUTPUT_AND_NEVER_ACCEPTS_EXECUTE");
}

const output = resolve(outputArg);
const outputRelative = relative(root, output);
if (!outputRelative.startsWith("..") && !isAbsolute(outputRelative)) {
  throw new Error("OUTPUT_MUST_BE_OUTSIDE_REPOSITORY");
}
if (existsSync(output)) {
  if (!statSync(output).isDirectory() || readdirSync(output).length > 0) {
    throw new Error("OUTPUT_MUST_BE_A_NEW_OR_EMPTY_DIRECTORY");
  }
} else {
  mkdirSync(output, { recursive: false });
}

const expectedHead = "58980add1a520f31f8b1dac68f801d344ee68704";
const actualHead = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
try {
  execFileSync("git", ["merge-base", "--is-ancestor", expectedHead, actualHead], { cwd: root, stdio: "pipe" });
} catch {
  throw new Error(`APPROVED_SOURCE_COMMIT_NOT_ANCESTOR:${actualHead}`);
}

const migrations = [
  ["20260914130000_cycle12_execution_tracking_and_safety.sql", "6A48E4BAD4FA40582439F5E054E5EAFCC48CD645D109862F121C9ED78856B5EC"],
  ["20260914131000_cycle12_execution_commands.sql", "B225F6DDA04C6D16F1B99FE188246143E1314DE1452D1DB7FA8168C0584689F3"],
  ["20260914132000_cycle12_completion_and_grants.sql", "22383948A5AAB0D904FA17673C52F4717EEE4C45F5F561FFAA041A13515E8C01"],
  ["20260914185833_cycle12_canonical_execution_reads.sql", "A1BA549F13A741242F8C25E1724718E93DAE8D182E43FD4DDA7E85361C329A02"],
  ["20260915014848_cycle12_student_home_v2.sql", "3D4E755613C111A81D3F342BA2ED76DFCE0E1A782F3719D003C49CF3D9450D73"],
  ["20260915140229_cycle12_student_training_library_v2.sql", "26D9A368696175D10B6C008E1D07B25DD2D80C848B7E5BBF2DF3F60C4009FF21"],
  ["20260915201101_cycle12_workout_player_v2.sql", "1B9A5586E7C1ACD3031A7425246BE50F12991F61AC6A29517696705C02BE9AC2"],
  ["20260919120000_cycle12_set_tracking_player_payload.sql", "400AE78D470E223D80EC2758EE7D792FE213B1CB94E42B02D38ECBBA67E1DEFD"],
  ["20260919231657_cycle12_rest_timer_server_clock.sql", "49393304F604859C4D55D2EF4B4EAFB45424E4EAFE63015C87741E1081A9A5FB"],
  ["20260920104727_cycle12_workout_completion_feedback.sql", "1C897F6B75D83DD46086808777FADE3842467AAE4253DA6F23C0118A8AAF9450"],
  ["20260920144904_cycle12_student_evolution_v2.sql", "AC605D3891BF2889F624156E5502CAB73304655F30321248A48E3AAED2A1BB97"],
  ["20260921010053_cycle12_profile_secondary_flows.sql", "FC7AB0F7878CEB545F7021750CA9DEA7674F4589C52BF8E4C1433A37F853796C"],
  ["20261004133801_cycle12_forward_schema_security_reconciliation.sql", "D15B85C13B9B72E67E10DF7A3A40A20D7CDD14DBA27937181820A0DACA4E1708"],
  ["20260926174027_cycle12_schema_rls_hardening.sql", "C4E01665FF8E55D0CDF5BD4A7B0692301E9E224E3EFFDBD9E6748AD2625DE770"],
  ["20261003163830_cycle12_controlled_rollout_foundation.sql", "9D236465C9A7DBA35E2845CA965DD1E1806A73A1DB0D712D04CBBB068E4E6FDB"],
  ["20261011232512_harden_privileged_function_execution.sql", "8673CF833854A1FA6F3572E8E4D1121F1D2E51CABE65CB367FA18D6A1A58EB21"],
];

const manifest = migrations.map(([file, expectedSha256], index) => {
  const sourcePath = join(migrationRoot, file);
  const source = normalizeLf(readFileSync(sourcePath, "utf8"));
  const sha256 = hash(source);
  if (sha256 !== expectedSha256) throw new Error(`MIGRATION_HASH_MISMATCH:${file}:${sha256}`);
  const version = file.slice(0, 14);
  const name = file.slice(15, -4);
  const historySql = `\ninsert into supabase_migrations.schema_migrations(version,name,statements) values ('${version}','${name}',array[$aruka_g4_2$${source}$aruka_g4_2$]);\n`;
  const hasExplicitTransaction = /^\s*begin\s*;/i.test(source) && /commit\s*;\s*$/i.test(source);
  const body = hasExplicitTransaction
    ? source.replace(/commit\s*;\s*$/i, `${historySql}commit;\n`)
    : `begin;\n${source}\n${historySql}commit;\n`;
  const stagedName = `${String(index + 1).padStart(2, "0")}-${version}.sql`;
  const staged = `\\set ON_ERROR_STOP on\n-- PREPARED ONLY. REQUIRES SEPARATE G4.2 PRODUCTION AUTHORIZATION.\n${body}`;
  writeFileSync(join(output, stagedName), staged, { encoding: "utf8", flag: "wx" });
  return {
    step: index + 1,
    version,
    name,
    source_file: file,
    source_sha256_canonical_lf: sha256,
    source_bytes_canonical_lf: Buffer.byteLength(source),
    staged_file: stagedName,
    staged_sha256: hash(staged),
    explicit_transaction: hasExplicitTransaction,
  };
});

const result = {
  status: "PREPARED_NOT_AUTHORIZED_NOT_EXECUTED",
  production_connection_used: false,
  network_used: false,
  approved_source_commit: expectedHead,
  prepared_from_head: actualHead,
  migration_count: manifest.length,
  expected_history_before: 25,
  expected_history_after: 41,
  migrations: manifest,
};
writeFileSync(join(output, "manifest.json"), `${JSON.stringify(result, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
console.log(JSON.stringify({ ...result, migrations: manifest.map(({ step, version, source_sha256_canonical_lf, staged_file }) => ({ step, version, source_sha256_canonical_lf, staged_file })) }, null, 2));

function normalizeLf(value) {
  return value.replace(/\r\n/g, "\n");
}

function hash(value) {
  return createHash("sha256").update(value, "utf8").digest("hex").toUpperCase();
}

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
}
