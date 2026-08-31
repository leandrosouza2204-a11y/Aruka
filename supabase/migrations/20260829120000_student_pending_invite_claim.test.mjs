import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./20260829120000_student_pending_invite_claim.sql", import.meta.url), "utf8");
const defaultProfileFix = readFileSync(new URL("./20260830203000_pending_student_claim_allows_default_profile.sql", import.meta.url), "utf8");

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
  assert.doesNotMatch(defaultProfileFix, /p_aluno_id|p_student_user_id|p_professional_user_id/);
});

test("claim pending invite keeps real professional and incompatible profile blocked", () => {
  assert.match(defaultProfileFix, /elsif found then\s+raise exception using errcode = '22023', message = 'STUDENT_INVITE_PROFILE_INCOMPATIBLE'/);
  assert.doesNotMatch(defaultProfileFix, /tipo_acesso = 'assinante'[\s\S]{0,120}set role = 'student'/);
  assert.doesNotMatch(defaultProfileFix, /role = 'admin'[\s\S]{0,120}set role = 'student'/);
});

test("claim pending invite links and activates atomically", () => {
  assert.match(source, /set student_user_id = v_student_user_id,[\s\S]*student_access_status = 'active'/);
  assert.match(source, /where id = v_aluno\.id[\s\S]*student_access_status = 'invited'[\s\S]*student_user_id is null/);
  assert.match(source, /grant execute on function public\.claim_pending_student_invite\(\) to authenticated/);
});
