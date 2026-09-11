import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const attempts = Number(process.argv[2] || 20);
if (!Number.isInteger(attempts) || attempts < 1) throw new Error("AUTH_RUNTIME_ATTEMPTS_INVALID");

const runner = fileURLToPath(new URL("./validate-local-smart-management-qa-runtime.mjs", import.meta.url));
const failures = [];
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  const result = spawnSync(process.execPath, ["--env-file=.env.local", "--env-file=.env.qa.local", runner], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, LOCAL_AUTH_RUNTIME_DIAGNOSTICS: "1", LOCAL_AUTH_RUNTIME_ATTEMPT: String(attempt) },
  });
  if (result.status !== 0) {
    failures.push({ attempt, pgrst303: /PGRST303/i.test(`${result.stdout}\n${result.stderr}`) });
    console.error(`AUTH_RUNTIME_ATTEMPT=${attempt} FAIL PGRST303=${failures.at(-1).pgrst303 ? "YES" : "NO"}`);
    console.error(`${result.stdout}\n${result.stderr}`.replace(/(access_token|refresh_token|password)\s*[:=]\s*\S+/gi, "$1=[REDACTED]"));
  }
}

console.log(`AUTH_RUNTIME_STABILITY=${attempts - failures.length}/${attempts}`);
console.log(`PGRST303=${failures.filter((failure) => failure.pgrst303).length}`);
if (failures.length) process.exitCode = 1;
