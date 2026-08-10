import {
  collectLocalQaAuthState,
  normalizeLocalQaAuthUsers,
  summarizeQaUser,
  validateLocalQaAuthState,
} from "./lib/local-qa-auth-fixtures.mjs";

const root = process.cwd();

normalizeLocalQaAuthUsers(root);
const rows = collectLocalQaAuthState(root);
const validation = validateLocalQaAuthState(rows);
const personal = summarizeQaUser(rows, "personal.cycle8@example.invalid");
const admin = summarizeQaUser(rows, "admin.cycle8@example.invalid");

console.log(`PERSONAL_QA_USER_EXISTS=${personal.present ? "YES" : "NO"}`);
console.log(`PERSONAL_QA_AUTH_FIELDS_COMPATIBLE=${personal.auth_fields_compatible ? "YES" : "NO"}`);
console.log(`PERSONAL_QA_DOMAIN_LINKS=${personal.domain_links}`);
console.log(`PERSONAL_QA_HAS_PASSWORD=${personal.has_password ? "YES" : "NO"}`);
console.log(`ADMIN_QA_USER_EXISTS=${admin.present ? "YES" : "NO"}`);
console.log(`ADMIN_QA_AUTH_FIELDS_COMPATIBLE=${admin.auth_fields_compatible ? "YES" : "NO"}`);
console.log(`ADMIN_QA_DOMAIN_LINKS=${admin.domain_links}`);
console.log(`ADMIN_QA_ROLE=${admin.role || "missing"}`);
console.log(`ADMIN_QA_HAS_PASSWORD=${admin.has_password ? "YES" : "NO"}`);
console.log(`LOCAL_QA_PASSWORD_STATE=${
  personal.has_password && admin.has_password
    ? "LOCAL_SECRET_PROVISIONED"
    : "REQUIRES_LOCAL_SECRET_PROVISIONING"
}`);
console.log(`REPAIR_IDEMPOTENT=${validation.ok ? "YES" : "NO"}`);
console.log(`LOCAL_QA_AUTH_STRUCTURAL_SETUP=${validation.ok ? "PASS" : "FAIL"}`);

if (!validation.ok) {
  for (const error of validation.errors) console.error(error);
  process.exit(1);
}
