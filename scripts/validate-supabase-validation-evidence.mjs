import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const reportDir = "reports/supabase-baseline-validation";
const skipDirs = new Set(["negative-tests", "tmp-local-project"]);
const blockedFiles = new Set(["credential-scan.txt"]);
const allowedSupabaseUrls = new Set(["https://supabase.com"]);

function listFiles(dir) {
  const rows = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && skipDirs.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) rows.push(...listFiles(path));
    else rows.push(path);
  }
  return rows;
}

const patterns = [
  ["JWT completo", /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/],
  ["sb_secret", /sb_secret_[A-Za-z0-9_-]+/],
  ["SERVICE_ROLE_KEY com valor", /"SERVICE_ROLE_KEY"\s*:\s*"(?!\[REDACTED_LOCAL_SERVICE_ROLE_KEY\])[^"]+"/i],
  ["ANON_KEY com valor", /"ANON_KEY"\s*:\s*"(?!\[REDACTED_LOCAL_ANON_KEY\])[^"]+"/i],
  ["SECRET_KEY com valor", /"SECRET_KEY"\s*:\s*"(?!\[REDACTED_LOCAL_SECRET_KEY\])[^"]+"/i],
  ["URL PostgreSQL com senha", /postgres(?:ql)?:\/\/(?!\[REDACTED_USER\]:\[REDACTED_PASSWORD\]@\[LOCAL_HOST\]:\[LOCAL_PORT\]\/\[LOCAL_DATABASE\])[^:\s/"']+:[^@\s/"']+@/i],
  ["password com valor", /\b(password|passwd|pwd)=((?!\[REDACTED_LOCAL_PASSWORD\])[^;\s]+)/i],
  ["bearer token", /\bbearer\s+(?!\[REDACTED_LOCAL_TOKEN\])[A-Za-z0-9._~+/=-]+/i],
  ["access token", /\b(access_token|refresh_token)\b\s*[:=]\s*(?!\[REDACTED_LOCAL_TOKEN\])["']?[^"',\s]+/i],
  ["private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["Project Ref remoto", /xrmqdkpxnfvusmenadnf/],
  ["URL supabase.co", /\.supabase\.co/i],
  ["credencial Docker", /"auths"\s*:\s*{|credsStore|identitytoken/i],
];

if (!existsSync(reportDir)) {
  console.error(`Missing ${reportDir}`);
  process.exit(1);
}

const errors = [];
for (const file of listFiles(reportDir)) {
  const name = relative(reportDir, file).replaceAll("\\", "/");
  if (blockedFiles.has(name)) {
    errors.push(`${name}: blocked local-only evidence file must not exist`);
    continue;
  }
  const text = readFileSync(file, "utf8");
  for (const [label, pattern] of patterns) {
    if (pattern.test(text)) {
      if (label === "URL supabase.co" && allowedSupabaseUrls.has(text.match(/https:\/\/supabase\.com/)?.[0])) continue;
      errors.push(`${name}: ${label}`);
    }
  }
}

if (errors.length > 0) {
  console.error("Supabase validation evidence security check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Supabase validation evidence security check passed.");
