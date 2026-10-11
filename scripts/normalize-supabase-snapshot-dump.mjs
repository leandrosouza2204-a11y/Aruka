import fs from "node:fs";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const inputPath = argument("--input");
const outputPath = argument("--output");
const mode = argument("--mode");
if (!inputPath || !outputPath || !["roles", "schema", "data"].includes(mode)) {
  throw new Error("USAGE: --mode <roles|schema|data> --input <raw.sql> --output <normalized.sql>");
}
if (fs.existsSync(outputPath)) throw new Error("OUTPUT_ALREADY_EXISTS");

const internalSchemas = "information_schema|pg_.*|_analytics|_realtime|_supavisor|auth|etl|extensions|pgbouncer|realtime|storage|supabase_functions|supabase_migrations|cron|dbdev|graphql|graphql_public|net|pgmq|pgsodium|pgsodium_masks|pgtle|repack|tiger|tiger_data|timescaledb_.*|_timescaledb_.*|topology|vault";
const internalAcl = new RegExp(`^(?:GRANT|REVOKE) .+ ON .+ \"(?:${internalSchemas})\"`, "u");

function normalizeSchemaLine(line) {
  if (/^\\(?:un)?restrict /u.test(line)) return null;
  if (/^CREATE PUBLICATION "supabase_realtime/u.test(line)) return null;
  if (/^CREATE EVENT TRIGGER /u.test(line)) return null;
  if (/^\s+WHEN TAG IN /u.test(line)) return null;
  if (/^\s+EXECUTE FUNCTION /u.test(line)) return null;
  if (/^ALTER EVENT TRIGGER /u.test(line)) return null;
  if (/^ALTER PUBLICATION "supabase_realtime_/u.test(line)) return null;
  if (/^ALTER FOREIGN DATA WRAPPER .+ OWNER TO /u.test(line)) return null;
  if (/^ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin"/u.test(line)) return null;
  if (/^GRANT ALL ON FOREIGN DATA WRAPPER .+ TO "postgres" WITH GRANT OPTION/u.test(line)) return null;
  if (internalAcl.test(line)) return null;
  if (/^COMMENT ON EXTENSION /u.test(line)) return null;
  if (/^CREATE POLICY "cron_job_/u.test(line)) return null;
  if (/^ALTER TABLE "cron"/u.test(line)) return null;
  if (/^SET transaction_timeout = 0;/u.test(line)) return null;
  if (/^--/u.test(line)) return null;

  line = line.replace(/^CREATE SCHEMA "/u, "CREATE SCHEMA IF NOT EXISTS \"");
  line = line.replace(/^CREATE TABLE "/u, "CREATE TABLE IF NOT EXISTS \"");
  line = line.replace(/^CREATE SEQUENCE "/u, "CREATE SEQUENCE IF NOT EXISTS \"");
  line = line.replace(/^CREATE VIEW "/u, "CREATE OR REPLACE VIEW \"");
  line = line.replace(/^CREATE FUNCTION "/u, "CREATE OR REPLACE FUNCTION \"");
  line = line.replace(/^CREATE TRIGGER "/u, "CREATE OR REPLACE TRIGGER \"");
  line = line.replace(/^(CREATE EXTENSION IF NOT EXISTS "(?:pg_tle|pgsodium|pgmq)").*$/u, "$1;");
  return line;
}

const reservedRoles = "anon|authenticated|authenticator|cli_login_.*|dashboard_user|pgbouncer|postgres|service_role|supabase_.*|pgsodium_keyholder|pgsodium_keyiduser|pgsodium_keymaker|pgtle_admin";
const reservedRoleDefinition = new RegExp(`^(?:CREATE|ALTER) ROLE \"(?:${reservedRoles})\"`, "u");
const reservedRoleGrant = new RegExp(`^GRANT \".*\" TO \"(?:${reservedRoles})\"`, "u");
function normalizeRoleLine(line) {
  if (/^\\(?:un)?restrict /u.test(line)) return null;
  if (reservedRoleDefinition.test(line) || reservedRoleGrant.test(line) || /^--/u.test(line)) return null;
  line = line.replace(/ (NOSUPERUSER|NOREPLICATION)/gu, "");
  line = line.replace(/^-- (.* SET "(?:pgaudit.*|pgrst.*|session_replication_role|statement_timeout|track_io_timing)" .*)$/u, "$1");
  return line;
}

const input = fs.readFileSync(inputPath, "utf8").split(/\r?\n/u);
let normalized = input
  .map((line) => {
    if (/^\\(?:un)?restrict /u.test(line)) return null;
    if (mode === "schema") return normalizeSchemaLine(line);
    if (mode === "roles") return normalizeRoleLine(line);
    return line;
  })
  .filter((line) => line !== null)
  .join("\n");
if (mode === "roles") normalized = `${normalized.replace(/\s*$/u, "")}\n\nRESET ALL;`;

fs.writeFileSync(outputPath, normalized.endsWith("\n") ? normalized : `${normalized}\n`, { encoding: "utf8", flag: "wx" });
console.log(JSON.stringify({ status: "PASS", mode, input_retained: true, output_created: true }));
