import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PROFESSIONAL_DEFAULT_ROUTE,
  STUDENT_DEFAULT_ROUTE,
  STUDENT_V2_DEFAULT_ROUTE,
  resolverDestinoPosLogin,
} from "./loginRouting.js";
import { STUDENT_EXPERIENCE_V2_ROUTES } from "../features/studentExperienceV2/domain/studentExperienceV2Contracts.js";

test("ROUTE-01 GREEN: envia aluno elegivel para Home V2 quando rollout esta ligado", async () => {
  const destino = await resolverDestinoPosLogin(
    async () => ({ student: { id: "student-id" }, studentAccess: { status: "active" } }),
    async () => ({ role: "user", status: "ativo", tipoAcesso: "pendente" }),
    { v2Enabled: true }
  );
  assert.equal(destino, STUDENT_EXPERIENCE_V2_ROUTES.HOME);
});

test("mantem aluno na experiencia legada quando rollout esta desligado", async () => {
  const destino = await resolverDestinoPosLogin(
    async () => ({ student: { id: "student-id" } }),
    async () => ({ role: "user", status: "ativo", tipoAcesso: "pendente" })
  );
  assert.equal(destino, STUDENT_DEFAULT_ROUTE);
});

test("mantem aluno inativo na experiencia legada quando rollout esta ligado", async () => {
  const destino = await resolverDestinoPosLogin(
    async () => ({ student: { id: "student-id" }, studentAccess: { status: "suspended" } }),
    async () => ({ role: "user", status: "ativo", tipoAcesso: "pendente" }),
    { v2Enabled: true }
  );
  assert.equal(destino, STUDENT_DEFAULT_ROUTE);
});

test("mantem aluno com acesso indeterminado na experiencia legada quando rollout esta ligado", async () => {
  const destino = await resolverDestinoPosLogin(
    async () => ({ student: { id: "student-id" } }),
    async () => ({ role: "user", status: "ativo", tipoAcesso: "pendente" }),
    { v2Enabled: true }
  );
  assert.equal(destino, STUDENT_DEFAULT_ROUTE);
});

test("preserva dashboard profissional quando identidade de aluno nao existe", async () => {
  const destino = await resolverDestinoPosLogin(
    async () => ({ student: null }),
    async () => ({ role: "user", status: "ativo", tipoAcesso: "assinante" })
  );
  assert.equal(destino, PROFESSIONAL_DEFAULT_ROUTE);
});

test("prioriza o contexto profissional mesmo quando existe identidade de aluno", async () => {
  const destino = await resolverDestinoPosLogin(
    async () => ({ student: { id: "student-id" } }),
    async () => ({ role: "user", status: "ativo", tipoAcesso: "beta" }),
    { v2Enabled: true }
  );
  assert.equal(destino, PROFESSIONAL_DEFAULT_ROUTE);
});

test("preserva dashboard profissional quando RPC de aluno falha", async () => {
  const destino = await resolverDestinoPosLogin(
    async () => {
      throw new Error("not a student");
    },
    async () => ({ role: "user", status: "ativo", tipoAcesso: "pendente" })
  );
  assert.equal(destino, PROFESSIONAL_DEFAULT_ROUTE);
});

test("preserva dashboard profissional com rollout ligado", async () => {
  const destino = await resolverDestinoPosLogin(
    async () => ({ student: null }),
    async () => ({ role: "user", status: "ativo", tipoAcesso: "assinante" }),
    { v2Enabled: true }
  );
  assert.equal(destino, PROFESSIONAL_DEFAULT_ROUTE);
});

test("entrada direta falha fechada no legado quando descoberta de aluno falha", async () => {
  const destino = await resolverDestinoPosLogin(
    async () => {
      throw new Error("temporary discovery failure");
    },
    async () => ({ role: "user", status: "ativo", tipoAcesso: "pendente" }),
    { v2Enabled: true, fallbackRoute: STUDENT_EXPERIENCE_V2_ROUTES.LEGACY }
  );
  assert.equal(destino, STUDENT_EXPERIENCE_V2_ROUTES.LEGACY);
});

test("exports mantem contrato das rotas canonicas", () => {
  assert.equal(STUDENT_DEFAULT_ROUTE, "/minha-area");
  assert.equal(STUDENT_V2_DEFAULT_ROUTE, "/minha-area/inicio");
  assert.equal(PROFESSIONAL_DEFAULT_ROUTE, "/dashboard");
  assert.equal(typeof resolverDestinoPosLogin, "function");
});
