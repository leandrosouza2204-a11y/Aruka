import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { validateProjectId } from "./supabase-cycle-9-lib.mjs";

const root = process.cwd();
const projectId = process.env.SUPABASE_PROJECT_ID || process.argv.find((arg) => arg.startsWith("--project-id="))?.slice("--project-id=".length);

if (!validateProjectId(projectId)) {
  console.error("Invalid CI project ID.");
  process.exit(1);
}

const configPath = join(root, "supabase/config.toml");
const config = readFileSync(configPath, "utf8");
writeFileSync(configPath, config.replace(/^project_id\s*=\s*"[^"]+"/m, `project_id = "${projectId}"`), "utf8");
console.log("SUPABASE_CI_PROJECT_CONFIGURED");
