import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./20260829120000_student_pending_invite_claim.sql", import.meta.url), "utf8");

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
  assert.match(source, /v_profile\.role <> 'student'/);
  assert.match(source, /message = 'STUDENT_INVITE_PROFILE_INCOMPATIBLE'/);
});

test("claim pending invite links and activates atomically", () => {
  assert.match(source, /set student_user_id = v_student_user_id,[\s\S]*student_access_status = 'active'/);
  assert.match(source, /where id = v_aluno\.id[\s\S]*student_access_status = 'invited'[\s\S]*student_user_id is null/);
  assert.match(source, /grant execute on function public\.claim_pending_student_invite\(\) to authenticated/);
});
