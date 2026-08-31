import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./20260829120000_student_pending_invite_claim.sql", import.meta.url), "utf8");
const defaultProfileFix = readFileSync(new URL("./20260830203000_pending_student_claim_allows_default_profile.sql", import.meta.url), "utf8");
const returnFix = readFileSync(new URL("./20260831090000_fix_pending_student_claim_return.sql", import.meta.url), "utf8");
const ownerState = readFileSync(new URL("./20260819090000_student_access_lifecycle.sql", import.meta.url), "utf8");

test("claim pending invite derives student identity and email server-side", () => {
  assert.match(source, /v_student_user_id uuid := auth\.uid\(\)/);
  assert.match(source, /v_email text := lower\(trim\(coalesce\(auth\.jwt\(\) ->> 'email', ''\)\)\)/);
  assert.doesNotMatch(source, /p_aluno_id|p_student_user_id|p_professional_user_id/);
});

test("claim pending invite blocks no match and ambiguous invite matches", () => {
  assert.match(source, /message = 'STUDENT_INVITE_NOT_FOUND'/);
  assert.match(source, /message = 'STUDENT_INVITE_AMBIGUOUS'/);
  assert.match(source, /v_match_count = 0/);
  assert.match(source, /v_match_count > 1/);
});

test("claim pending invite prevents account reuse and incompatible profiles", () => {
  assert.match(source, /where student_user_id = v_student_user_id/);
  assert.match(source, /message = 'STUDENT_ACCOUNT_ALREADY_LINKED'/);
  assert.match(defaultProfileFix, /where student_user_id = v_student_user_id/);
  assert.match(defaultProfileFix, /message = 'STUDENT_ACCOUNT_ALREADY_LINKED'/);
  assert.match(defaultProfileFix, /message = 'STUDENT_INVITE_PROFILE_INCOMPATIBLE'/);
});

test("claim pending invite accepts default pending profile as transient invited student", () => {
  assert.match(defaultProfileFix, /v_profile\.role = 'user'/);
  assert.match(defaultProfileFix, /v_profile\.tipo_acesso = 'pendente'/);
  assert.match(defaultProfileFix, /v_profile\.status = 'ativo'/);
  assert.match(defaultProfileFix, /set role = 'student'/);
  assert.match(returnFix, /v_profile\.role = 'user'/);
  assert.match(returnFix, /v_profile\.tipo_acesso = 'pendente'/);
  assert.match(returnFix, /v_profile\.status = 'ativo'/);
  assert.match(returnFix, /set role = 'student'/);
  assert.doesNotMatch(defaultProfileFix, /p_aluno_id|p_student_user_id|p_professional_user_id/);
  assert.doesNotMatch(returnFix, /p_aluno_id|p_student_user_id|p_professional_user_id/);
});

test("claim pending invite keeps real professional and incompatible profile blocked", () => {
  assert.match(defaultProfileFix, /elsif found then\s+raise exception using errcode = '22023', message = 'STUDENT_INVITE_PROFILE_INCOMPATIBLE'/);
  assert.match(returnFix, /elsif found then\s+raise exception using errcode = '22023', message = 'STUDENT_INVITE_PROFILE_INCOMPATIBLE'/);
  assert.doesNotMatch(defaultProfileFix, /tipo_acesso = 'assinante'[\s\S]{0,120}set role = 'student'/);
  assert.doesNotMatch(defaultProfileFix, /role = 'admin'[\s\S]{0,120}set role = 'student'/);
  assert.doesNotMatch(returnFix, /tipo_acesso = 'assinante'[\s\S]{0,120}set role = 'student'/);
  assert.doesNotMatch(returnFix, /role = 'admin'[\s\S]{0,120}set role = 'student'/);
});

test("claim pending invite links and activates atomically", () => {
  assert.match(source, /set student_user_id = v_student_user_id,[\s\S]*student_access_status = 'active'/);
  assert.match(returnFix, /set student_user_id = v_student_user_id,[\s\S]*student_access_status = 'active'/);
  assert.match(source, /where id = v_aluno\.id[\s\S]*student_access_status = 'invited'[\s\S]*student_user_id is null/);
  assert.match(returnFix, /where id = v_aluno\.id[\s\S]*student_access_status = 'invited'[\s\S]*student_user_id is null/);
  assert.match(source, /grant execute on function public\.claim_pending_student_invite\(\) to authenticated/);
  assert.match(returnFix, /grant execute on function public\.claim_pending_student_invite\(\) to authenticated/);
});

test("claim pending invite returns a minimal student-safe payload", () => {
  const returnPayload = returnFix.match(/return jsonb_build_object\([\s\S]*?\n  \);/)?.[0] || "";
  assert.doesNotMatch(returnFix, /get_student_access_state/);
  assert.match(returnPayload, /return jsonb_build_object\(/);
  assert.match(returnPayload, /'ok', true/);
  assert.match(returnPayload, /'status', 'active'/);
  assert.match(returnPayload, /'linked', true/);
  assert.doesNotMatch(returnPayload, /'email'|'alunoId'|'professional'|'user_id'|'student_user_id'/);
});

test("professional owner state helper remains protected", () => {
  assert.match(ownerState, /create or replace function public\.get_student_access_state\(p_aluno_id uuid\)/);
  assert.match(ownerState, /where id = p_aluno_id\s+and user_id = v_professional_user_id/);
  assert.match(ownerState, /message = 'STUDENT_ACCESS_OWNER_REQUIRED'/);
});
