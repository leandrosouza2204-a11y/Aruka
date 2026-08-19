import assert from "node:assert/strict";
import { test } from "node:test";
import { PROFESSIONAL_DEFAULT_ROUTE, STUDENT_DEFAULT_ROUTE, resolverDestinoPosLogin } from "./loginRouting.js";

test("envia usuario com identidade de aluno para minha area", async () => {
  const destino = await resolverDestinoPosLogin(async () => ({ student: { id: "student-id" } }));
  assert.equal(destino, STUDENT_DEFAULT_ROUTE);
});

test("preserva dashboard profissional quando identidade de aluno nao existe", async () => {
  const destino = await resolverDestinoPosLogin(async () => ({ student: null }));
  assert.equal(destino, PROFESSIONAL_DEFAULT_ROUTE);
});

test("preserva dashboard profissional quando RPC de aluno falha", async () => {
  const destino = await resolverDestinoPosLogin(async () => {
    throw new Error("not a student");
  });
  assert.equal(destino, PROFESSIONAL_DEFAULT_ROUTE);
});

test("exports mantem contrato das rotas canonicas", () => {
  assert.equal(STUDENT_DEFAULT_ROUTE, "/minha-area");
  assert.equal(PROFESSIONAL_DEFAULT_ROUTE, "/dashboard");
  assert.equal(typeof resolverDestinoPosLogin, "function");
});
