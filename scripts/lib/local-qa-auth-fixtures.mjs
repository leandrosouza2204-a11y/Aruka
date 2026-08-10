import { queryJson, runPsql } from "../supabase-cycle-8-lib.mjs";
import { readLocalSupabaseRuntime } from "./local-supabase-runtime.mjs";

export const QA_AUTH_STRING_FIELDS = [
  "confirmation_token",
  "recovery_token",
  "email_change_token_new",
  "email_change_token_current",
  "email_change",
  "phone_change",
  "phone_change_token",
  "reauthentication_token",
];

export const QA_USERS = [
  {
    id: "00000000-0000-4000-8000-000000000801",
    email: "admin.cycle8@example.invalid",
    role: "admin",
    tipoAcesso: "admin",
    status: "ativo",
  },
  {
    id: "00000000-0000-4000-8000-000000000802",
    email: "personal.cycle8@example.invalid",
    role: "user",
    tipoAcesso: "assinante",
    status: "ativo",
  },
];

export function normalizeLocalQaAuthUsers(root = process.cwd()) {
  assertLocalOnlyAuthTarget();

  const sql = `
    update auth.users
    set
      confirmation_token = coalesce(confirmation_token, ''),
      recovery_token = coalesce(recovery_token, ''),
      email_change_token_new = coalesce(email_change_token_new, ''),
      email_change_token_current = coalesce(email_change_token_current, ''),
      email_change = coalesce(email_change, ''),
      phone_change = coalesce(phone_change, ''),
      phone_change_token = coalesce(phone_change_token, ''),
      reauthentication_token = coalesce(reauthentication_token, ''),
      email_confirmed_at = coalesce(email_confirmed_at, '2026-01-01T00:00:00Z'::timestamptz)
    where id in (${QA_USERS.map((user) => `'${user.id}'`).join(", ")});
  `;

  runPsql(root, sql);
}

export function collectLocalQaAuthState(root = process.cwd()) {
  assertLocalOnlyAuthTarget();

  return queryJson(root, `
    select
      u.id,
      u.email,
      u.email_confirmed_at is not null as email_confirmed,
      u.encrypted_password is not null as has_password,
      p.role,
      p.tipo_acesso,
      p.status,
      p.user_id = u.id as domain_link_valid,
      (
        select count(*)::int
        from (values
          (u.confirmation_token),
          (u.recovery_token),
          (u.email_change_token_new),
          (u.email_change_token_current),
          (u.email_change),
          (u.phone_change),
          (u.phone_change_token),
          (u.reauthentication_token)
        ) as fields(value)
        where value is null
      ) as gotrue_null_string_fields,
      (
        select count(*)::int
        from auth.users duplicates
        where lower(duplicates.email) = lower(u.email)
      ) as duplicate_auth_users
    from auth.users u
    left join public.perfis p on p.user_id = u.id
    where u.id in (${QA_USERS.map((user) => `'${user.id}'`).join(", ")})
    order by u.email
  `);
}

function assertLocalOnlyAuthTarget() {
  const runtime = readLocalSupabaseRuntime();
  const parsed = new URL(runtime.apiUrl);

  if (!["localhost", "127.0.0.1"].includes(parsed.hostname)) {
    throw new Error("BLOCKED_NON_LOCAL_AUTH_TARGET");
  }

  const remoteEnv = Object.entries(process.env)
    .filter(([key]) => /SUPABASE|DATABASE|POSTGRES|PROJECT|URL/i.test(key))
    .filter(([, value]) => /supabase\.co|pooler\.supabase\.com/i.test(String(value || "")));

  if (remoteEnv.length) {
    throw new Error("BLOCKED_REMOTE_SUPABASE_CONTEXT");
  }
}

export function validateLocalQaAuthState(rows) {
  const errors = [];
  const byEmail = new Map(rows.map((row) => [String(row.email || "").toLowerCase(), row]));

  for (const expected of QA_USERS) {
    const row = byEmail.get(expected.email);
    if (!row) {
      errors.push(`${expected.email}: missing QA user`);
      continue;
    }

    if (row.id !== expected.id) errors.push(`${expected.email}: unexpected id`);
    if (row.duplicate_auth_users !== 1) errors.push(`${expected.email}: duplicate QA user`);
    if (!row.email_confirmed) errors.push(`${expected.email}: email not confirmed`);
    if (row.gotrue_null_string_fields !== 0) errors.push(`${expected.email}: GoTrue string NULL fields`);
    if (!row.domain_link_valid) errors.push(`${expected.email}: invalid domain link`);
    if (row.role !== expected.role) errors.push(`${expected.email}: wrong role`);
    if (row.tipo_acesso !== expected.tipoAcesso) errors.push(`${expected.email}: wrong access type`);
    if (row.status !== expected.status) errors.push(`${expected.email}: wrong status`);
  }

  return {
    ok: errors.length === 0,
    errors,
    rows,
  };
}

export function summarizeQaUser(rows, email) {
  const row = rows.find((item) => item.email === email);

  return {
    present: Boolean(row),
    auth_fields_compatible: Boolean(row && row.email_confirmed && row.gotrue_null_string_fields === 0),
    domain_links: row?.domain_link_valid ? "PASS" : "FAIL",
    has_password: Boolean(row?.has_password),
    role: row?.role || null,
    status: row?.status || null,
    tipo_acesso: row?.tipo_acesso || null,
  };
}
