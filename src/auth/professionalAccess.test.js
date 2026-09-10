import assert from "node:assert/strict";
import { test } from "node:test";
import { isProfessionalProfile } from "./professionalAccess.js";

test("reconhece perfis profissionais ativos", () => {
  assert.equal(isProfessionalProfile({ role: "user", status: "ativo", tipoAcesso: "beta" }), true);
  assert.equal(isProfessionalProfile({ role: "user", status: "ativo", tipoAcesso: "assinante" }), true);
  assert.equal(isProfessionalProfile({ role: "admin", status: "ativo", tipoAcesso: "pendente" }), true);
});

test("nao confunde identidade de aluno com perfil profissional", () => {
  assert.equal(isProfessionalProfile({ role: "user", status: "ativo", tipoAcesso: "pendente" }), false);
  assert.equal(isProfessionalProfile({ role: "user", status: "bloqueado", tipoAcesso: "assinante" }), false);
  assert.equal(isProfessionalProfile(null), false);
});
