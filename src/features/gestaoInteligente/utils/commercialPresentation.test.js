import test from "node:test";
import assert from "node:assert/strict";
import { buildCommercialPresentation, formatCommercialServicePrice } from "./commercialPresentation.js";

const baseService = {
  id: "svc-1",
  name: "Personal Individual",
  description: "",
  pricingModel: "MONTHLY_PACKAGE",
  price: 800,
  sessionsPerWeek: 2,
  sessionsPerMonth: null,
  sessionsInPackage: null,
  sessionDurationMinutes: 60,
  minStudents: 1,
  maxStudents: 1,
  status: "active",
};

test("gera mensagem para um serviço mensal individual", () => {
  const message = buildCommercialPresentation({ services: [baseService] });
  assert.match(message, /Olá! Tudo bem\?/);
  assert.match(message, /\*Personal Individual\*/);
  assert.match(message, /R\$\s800,00\/mês/);
  assert.match(message, /2 treinos por semana/);
  assert.match(message, /Sessões de 60 minutos/);
  assert.match(message, /Atendimento individual/);
});

test("gera mensagem para múltiplos serviços sem separadores duplicados", () => {
  const message = buildCommercialPresentation({
    services: [
      baseService,
      { ...baseService, id: "svc-2", name: "Consultoria Online", price: 250, sessionDurationMinutes: null, minStudents: 1, maxStudents: null },
    ],
  });
  assert.match(message, /\*Personal Individual\*/);
  assert.match(message, /\*Consultoria Online\*/);
  assert.doesNotMatch(message, /\n{3,}/);
});

test("formata PER_SESSION", () => {
  assert.match(formatCommercialServicePrice({ ...baseService, pricingModel: "PER_SESSION", price: 120 }), /^R\$\s120,00 por sessão$/);
});

test("formata PER_STUDENT_SESSION para dupla", () => {
  const message = buildCommercialPresentation({
    services: [{ ...baseService, name: "Personal em Dupla", pricingModel: "PER_STUDENT_SESSION", price: 70, minStudents: 2, maxStudents: 2 }],
  });
  assert.match(message, /R\$\s70,00 por aluno\/sessão/);
  assert.match(message, /Para 2 alunos/);
});

test("formata FIXED_PACKAGE com sessões no pacote", () => {
  const message = buildCommercialPresentation({
    services: [{ ...baseService, name: "Pacote Inicial", pricingModel: "FIXED_PACKAGE", price: 900, sessionsInPackage: 10, sessionsPerWeek: null }],
  });
  assert.match(message, /Pacote com 10 sessões/);
  assert.match(message, /R\$\s900,00/);
});

test("omite duração e descrição ausentes", () => {
  const message = buildCommercialPresentation({ services: [{ ...baseService, description: "", sessionDurationMinutes: null }] });
  assert.doesNotMatch(message, /Sessões de/);
  assert.doesNotMatch(message, /undefined|null/);
});

test("inclui descrição curta e capacidade de grupo", () => {
  const message = buildCommercialPresentation({
    services: [{ ...baseService, name: "Grupo Funcional", description: "Treino em grupo com acompanhamento técnico.", minStudents: 3, maxStudents: null }],
  });
  assert.match(message, /Treino em grupo com acompanhamento técnico\./);
  assert.match(message, /Para 3 ou mais alunos/);
});

test("preserva UTF-8 e acentuação", () => {
  const message = buildCommercialPresentation({ services: [{ ...baseService, name: "Avaliação Física", description: "Opções com duração definida." }] });
  assert.match(message, /Avaliação Física/);
  assert.match(message, /Opções com duração definida\./);
  assert.doesNotMatch(message, /Ã|Â|�/);
});

test("retorna mensagem vazia sem serviços selecionados", () => {
  assert.equal(buildCommercialPresentation({ services: [] }), "");
});

test("filtra serviços arquivados", () => {
  assert.equal(buildCommercialPresentation({ services: [{ ...baseService, status: "archived" }] }), "");
});

test("não vaza dados internos de origem", () => {
  const message = buildCommercialPresentation({
    services: [{
      ...baseService,
      transferFee: 120,
      profitability: 0.82,
      netRevenue: 680,
      hourlyValue: 95,
      locationName: "Academia Interna A",
      owner_id: "a1111111-1111-4111-8111-111111111111",
      professional_id: "b2222222-2222-4222-8222-222222222222",
    }],
  });
  assert.doesNotMatch(message, /repasse|rentabilidade|receita líquida|Academia Interna|owner_id|professional_id|[0-9a-f]{8}-[0-9a-f-]{27,}/i);
});

test("mantém texto plain text amigável para WhatsApp", () => {
  const message = buildCommercialPresentation({ services: [baseService] });
  assert.match(message, /\*Personal Individual\*/);
  assert.match(message, /• R\$\s800,00\/mês/);
  assert.doesNotMatch(message, /<[^>]+>|\{|\}|\[|\]|```/);
});
