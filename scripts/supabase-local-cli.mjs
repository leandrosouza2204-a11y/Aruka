import { spawnSync } from "node:child_process";

const commands = {
  preflight: ["scripts/supabase-local-preflight.ps1"],
  bootstrap: ["scripts/supabase-local-bootstrap.ps1"],
  validate: ["scripts/supabase-local-validate.ps1"],
  stop: ["scripts/supabase-local-stop.ps1"],
  clean: ["scripts/supabase-local-clean.ps1", "-CI"],
};

function usage() {
  console.log("Usage: node scripts/supabase-local-cli.mjs <preflight|bootstrap|validate|status|stop|clean>");
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.length === 0) {
  usage();
  process.exit(args.length === 0 ? 1 : 0);
}

const blockedPatterns = [
  new RegExp("--" + "linked", "i"),
  new RegExp("--project" + "-ref", "i"),
  new RegExp("--db" + "-url", "i"),
  new RegExp("supabase" + "\\.co", "i"),
  new RegExp("db\\s+" + "push", "i"),
  new RegExp("migration\\s+" + "repair", "i"),
];

if (args.some((arg) => blockedPatterns.some((pattern) => pattern.test(arg)))) {
  console.error("Remote or unsafe argument rejected.");
  process.exit(1);
}

const command = args[0];
if (command === "status") {
  const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(npxCommand, ["-y", "supabase@2.109.1", "status"], { stdio: "inherit", shell: false });
  process.exit(result.status ?? 1);
}

if (!commands[command]) {
  usage();
  process.exit(1);
}

const [script, ...scriptArgs] = commands[command];
const powershellCommand = process.platform === "win32" ? "powershell.exe" : "pwsh";
const result = spawnSync(powershellCommand, ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", script, ...scriptArgs], {
  stdio: "inherit",
  shell: false,
});
process.exit(result.status ?? 1);
