import {
  collectLocalQaAuthState,
  summarizeQaUser,
  validateLocalQaAuthState,
} from "./lib/local-qa-auth-fixtures.mjs";

const rows = collectLocalQaAuthState(process.cwd());
const validation = validateLocalQaAuthState(rows);
const personal = summarizeQaUser(rows, "personal.cycle8@example.invalid");
const admin = summarizeQaUser(rows, "admin.cycle8@example.invalid");

console.log(`QA_USERS_EXPECTED_PRESENT=${personal.present && admin.present ? "YES" : "NO"}`);
console.log(`DUPLICATE_QA_USERS=${validation.errors.some((error) => error.includes("duplicate")) ? "YES" : "NO"}`);
console.log(`GOTRUE_STRING_FIELDS_NULL_COUNT=${rows.reduce((total, row) => total + Number(row.gotrue_null_string_fields || 0), 0)}`);
console.log(`PERSONAL_QA_USER_EXISTS=${personal.present ? "YES" : "NO"}`);
console.log(`PERSONAL_QA_AUTH_FIELDS_COMPATIBLE=${personal.auth_fields_compatible ? "YES" : "NO"}`);
console.log(`PERSONAL_QA_DOMAIN_LINKS=${personal.domain_links}`);
console.log(`PERSONAL_HAS_PASSWORD=${personal.has_password ? "YES" : "NO"}`);
console.log(`ADMIN_QA_USER_EXISTS=${admin.present ? "YES" : "NO"}`);
console.log(`ADMIN_QA_AUTH_FIELDS_COMPATIBLE=${admin.auth_fields_compatible ? "YES" : "NO"}`);
console.log(`ADMIN_QA_DOMAIN_LINKS=${admin.domain_links}`);
console.log(`ADMIN_QA_ROLE=${admin.role || "missing"}`);
console.log(`ADMIN_HAS_PASSWORD=${admin.has_password ? "YES" : "NO"}`);
console.log(`LOCAL_AUTH_FIXTURE_COMPATIBILITY=${validation.ok ? "PASS" : "FAIL"}`);

if (!validation.ok) {
  for (const error of validation.errors) console.error(error);
  process.exit(1);
}
