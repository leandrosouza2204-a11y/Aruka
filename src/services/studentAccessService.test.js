import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeStudentInviteError,
  sanitizeStudentInvitePayload,
} from "./studentInviteErrorService.js";

test("student invite maps existing account code to friendly message", () => {
  const error = sanitizeStudentInvitePayload({ code: "ALREADY_REGISTERED_UNLINKED" });

  assert.equal(
    error.message,
    "Este e-mail já possui uma conta no Aruka. Use outro e-mail ou utilize o fluxo de vinculação quando ele estiver disponível."
  );
  assert.doesNotMatch(error.message, /auth\.users|Supabase|HTTP|409|service role|token|stack/i);
});

test("student invite keeps unknown errors generic", () => {
  const error = sanitizeStudentInvitePayload({
    code: "UNEXPECTED_INTERNAL_CODE",
    error: "database stack trace with token",
  });

  assert.equal(error.message, "Não foi possível enviar o convite agora.");
});

test("student invite reads safe Function error payload when available", async () => {
  const error = await sanitizeStudentInviteError({
    context: {
      json: async () => ({ code: "ALREADY_REGISTERED_UNLINKED" }),
    },
  });

  assert.match(error.message, /já possui uma conta no Aruka/);
});
