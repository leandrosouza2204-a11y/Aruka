import { existsSync, readFileSync } from "node:fs";

const errors = [];
const requiredScripts = [
  "scripts/supabase-local-preflight.ps1",
  "scripts/supabase-local-bootstrap.ps1",
  "scripts/supabase-local-validate.ps1",
  "scripts/supabase-local-stop.ps1",
  "scripts/supabase-local-clean.ps1",
  "scripts/supabase-local-cli.mjs",
];

for (const script of requiredScripts) {
  if (!existsSync(script)) errors.push(`Missing ${script}`);
}

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const expected = ["supabase:preflight", "supabase:bootstrap", "supabase:validate", "supabase:status", "supabase:stop", "supabase:clean", "qa:supabase-local-reproducibility"];
for (const name of expected) {
  if (!pkg.scripts?.[name]) errors.push(`Missing package script ${name}`);
}

const scanFiles = [...requiredScripts, "package.json"].filter(existsSync);
for (const file of scanFiles) {
  const text = readFileSync(file, "utf8");
  for (const pattern of [/--linked/i, /--project-ref/i, /supabase\.co/i, /xrmqdkpxnfvusmenadnf/i, /\bdb push\b/i, /migration repair/i]) {
    if (pattern.test(text)) errors.push(`${file} contains forbidden pattern ${pattern}`);
  }
}

if (!existsSync("supabase/migrations/20260716090000_baseline_aruka_v1.sql")) errors.push("Missing official baseline");
if (existsSync("supabase/migrations/20260705090000_hardening_admin_functions.sql")) errors.push("Archived migration is active again");
if (!existsSync("docs/supabase-infrastructure-refactor/37-local-development-bootstrap.md")) errors.push("Missing local bootstrap docs");
if (!existsSync("docs/supabase-infrastructure-refactor/38-local-services-and-ports.md")) errors.push("Missing services/ports docs");

const clean = existsSync("scripts/supabase-local-clean.ps1") ? readFileSync("scripts/supabase-local-clean.ps1", "utf8") : "";
if (/docker\s+rm\s+-f\s+\$\(docker ps/i.test(clean) || /docker\s+system\s+prune/i.test(clean)) errors.push("Clean script contains broad Docker removal");
if (!clean.includes("ConsultoriaFitness")) errors.push("Clean script must filter explicit project_id");

if (errors.length) {
  console.error("Supabase local reproducibility validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Supabase local reproducibility validation passed.");
