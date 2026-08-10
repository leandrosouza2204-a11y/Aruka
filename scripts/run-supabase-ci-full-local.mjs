import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const reportDir = join(root, "reports/supabase-ci");
mkdirSync(reportDir, { recursive: true });

const commands = [
  ["Gate 1/2", "qa:supabase-ci-static"],
  ["Harness static", "qa:supabase-ci-harness-static"],
  ["Gate 3", "supabase:preflight"],
  ["Gate 3", "supabase:bootstrap"],
  ["Gate 3", "supabase:validate"],
  ["Gate 4", "supabase:seed:local"],
  ["Gate 4", "supabase:fixtures:validate"],
  ["Gate 4", "supabase:seed:local"],
  ["Gate 4", "supabase:fixtures:validate"],
  ["Gate 5", "qa:supabase-safe-reset"],
  ["Gate 6", "qa:supabase-seeds-negative"],
  ["Gate 6", "qa:supabase-local-negative"],
  ["Gate 6", "qa:supabase-ci-negative"],
  ["Gate 7", "qa:supabase-local-reproducibility"],
  ["Gate 7", "qa:supabase-clean-worktree-wrapper"],
  ["Gate 7", "qa:supabase-cycle-8"],
  ["Gate 8", "qa:supabase-ci-evidence"],
  ["Gate 9", "qa:supabase-cycle-9"],
  ["Cycle 9.1", "qa:supabase-cycle-9-1-static"],
  ["Cycle 9.1", "qa:supabase-cycle-9-1-negative"],
  ["Cycle 9.1", "qa:supabase-cycle-9-1:prepare"],
];

const startedAt = new Date().toISOString();
const results = [];
let failed = null;

for (const [gate, script] of commands) {
  const started = Date.now();
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const command = process.platform === "win32" ? "cmd.exe" : npmCommand;
  const args = process.platform === "win32" ? ["/d", "/s", "/c", npmCommand, "run", script] : ["run", script];
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: false,
    timeout: script === "qa:supabase-clean-worktree-wrapper" ? 2100000 : 900000,
    env: { ...process.env, SUPABASE_CLI_VERSION: "2.109.1" },
    maxBuffer: 1024 * 1024 * 20,
  });
  const row = {
    gate,
    command: `npm run ${script}`,
    status: result.status ?? 1,
    timed_out: Boolean(result.error && result.error.code === "ETIMEDOUT"),
    duration_seconds: Number(((Date.now() - started) / 1000).toFixed(3)),
  };
  results.push(row);
  console.log(`${gate} ${script} ${row.status === 0 ? "PASS" : "FAIL"}`);
  if (row.status !== 0) {
    failed = { ...row, stdout: result.stdout, stderr: result.stderr || result.error?.message || "" };
    break;
  }
}

const gateStatus = (name) => results.filter((row) => row.gate === name).every((row) => row.status === 0) && results.some((row) => row.gate === name) ? "PASS" : "FAIL";
const payload = {
  decision: failed ? "LOCAL_CI_PARITY_REJECTED" : "LOCAL_CI_PARITY_VALIDATED",
  started_at: startedAt,
  finished_at: new Date().toISOString(),
  gate_1_2: gateStatus("Gate 1/2"),
  gate_3: gateStatus("Gate 3"),
  gate_4: gateStatus("Gate 4"),
  gate_5: gateStatus("Gate 5"),
  gate_6: gateStatus("Gate 6"),
  gate_7: gateStatus("Gate 7"),
  gate_8: gateStatus("Gate 8"),
  gate_9: gateStatus("Gate 9"),
  cycle_9_1: gateStatus("Cycle 9.1"),
  final_ci_local_parity: failed ? "FAIL" : "PASS",
  failed,
  results,
};

writeFileSync(join(reportDir, "supabase-ci-full-local-result.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
writeFileSync(join(reportDir, "supabase-ci-full-local-summary.md"), [
  "# Supabase Full Local CI Parity",
  "",
  `- Decision: ${payload.decision}`,
  `- Gate 1/2: ${payload.gate_1_2}`,
  `- Gate 3: ${payload.gate_3}`,
  `- Gate 4: ${payload.gate_4}`,
  `- Gate 5: ${payload.gate_5}`,
  `- Gate 6: ${payload.gate_6}`,
  `- Gate 7: ${payload.gate_7}`,
  `- Gate 8: ${payload.gate_8}`,
  `- Gate 9: ${payload.gate_9}`,
  `- Cycle 9.1: ${payload.cycle_9_1}`,
  `- Final CI local parity: ${payload.final_ci_local_parity}`,
  `- Failed command: ${failed ? failed.command : "none"}`,
  "",
].join("\n"), "utf8");

if (failed) {
  console.error(`EXACT_FAILED_GATE=${failed.gate}`);
  console.error(`EXACT_COMMAND=${failed.command}`);
  console.error((failed.stderr || failed.stdout || "").slice(0, 4000));
  process.exit(1);
}

console.log("GATE_1_2=PASS");
console.log("GATE_3=PASS");
console.log("GATE_4=PASS");
console.log("GATE_5=PASS");
console.log("GATE_6=PASS");
console.log("GATE_7=PASS");
console.log("GATE_8=PASS");
console.log("GATE_9=PASS");
console.log("GATE_9_1=PASS");
console.log("FINAL_CI_LOCAL_PARITY=PASS");
