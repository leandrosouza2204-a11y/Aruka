#!/usr/bin/env node
import fs from "node:fs";

const FUNCTION_FILE = "supabase/functions/aoe/index.ts";
const CATALOG_FILE = "supabase/functions/aoe/generated/apl-catalog.generated.ts";

const forbidden = [
  /SUPABASE_SERVICE_ROLE_KEY.*console/i,
  /VITE_SUPABASE/i,
  /docs\/apl/i,
  new RegExp(`\\b(?:TO${"DO"}|FIX${"ME"})\\b`),
  new RegExp(`\\bplace${"holder"}\\b`, "i"),
];

if (!fs.existsSync(FUNCTION_FILE)) {
  process.stderr.write("AOE Edge Function not found.\n");
  process.exit(1);
}
if (!fs.existsSync(CATALOG_FILE)) {
  process.stderr.write("Runtime catalog not found. Run npm run aoe:infra:build-catalog first.\n");
  process.exit(1);
}

const source = fs.readFileSync(FUNCTION_FILE, "utf8");
const catalog = fs.readFileSync(CATALOG_FILE, "utf8");
const findings = forbidden.filter((pattern) => pattern.test(source) || pattern.test(catalog)).map(String);

if (findings.length > 0) {
  process.stderr.write(`Forbidden runtime content: ${findings.join(", ")}\n`);
  process.exit(1);
}

process.stdout.write("AOE Edge Function static build validation passed\n");
