import { writeFileSync, mkdirSync } from "node:fs";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";
import { readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";

loadQaEnvFile();
const runtime = readLocalSupabaseRuntime();
const validation = validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });

mkdirSync("reports/product-audit/dashboard-v1/evidence/local-qa", { recursive: true });
writeFileSync("reports/product-audit/dashboard-v1/evidence/local-qa/local-qa-environment.md", [
  "# LOCAL_QA Environment",
  "",
  `- Environment: ${validation.declaredEnvironment}`,
  `- Frontend URL: ${validation.baseUrl}`,
  `- Supabase API URL: ${runtime.apiUrl}`,
  `- Supabase DB URL: ${runtime.dbUrl}`,
  `- Inbucket URL: ${runtime.inbucketUrl}`,
  "- Supabase Cloud: not used",
  "- Production: not used",
  "",
].join("\n"));

console.log(JSON.stringify({
  status: "LOCAL_QA_ENVIRONMENT_READY",
  frontendUrl: validation.baseUrl,
  supabaseApiUrl: runtime.apiUrl,
  dbUrl: runtime.dbUrl,
  inbucketUrl: runtime.inbucketUrl,
}, null, 2));
