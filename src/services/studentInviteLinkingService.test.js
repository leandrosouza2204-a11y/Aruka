import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./studentInviteLinkingService.js", import.meta.url), "utf8");

test("student invite linking service calls no-argument claim RPC", () => {
  assert.match(source, /supabase\.rpc\("claim_pending_student_invite"\)/);
  assert.doesNotMatch(source, /alunoId|studentUserId|professionalId/);
});

test("student invite linking service sanitizes claim errors", () => {
  assert.match(source, /STUDENT_INVITE_NOT_FOUND/);
  assert.match(source, /STUDENT_INVITE_AMBIGUOUS/);
  assert.match(source, /STUDENT_ACCOUNT_ALREADY_LINKED/);
  const userMessages = Array.from(source.matchAll(/new Error\("([^"]+)"\)/g))
    .map((match) => match[1])
    .join("\n");
  assert.doesNotMatch(userMessages, /SQL|uuid|auth\.uid|rpc/i);
});
