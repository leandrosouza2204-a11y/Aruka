import assert from "node:assert/strict";
import test from "node:test";
import { selecionarAgendaDeHoje, statusAgendaNoMomento } from "./dashboardAgenda.js";

const now = new Date("2026-10-21T15:00:00.000Z");
const event = (id, inicio, fim, status = "agendado") => ({ id, inicio, fim, status });

test("prioriza somente compromissos futuros ou em andamento e limita em tres", () => {
  const result = selecionarAgendaDeHoje([
    event("passado", "2026-10-21T12:00:00Z", "2026-10-21T13:00:00Z"),
    event("cancelado", "2026-10-21T16:00:00Z", "2026-10-21T17:00:00Z", "cancelado"),
    event("terceiro", "2026-10-21T18:00:00Z", "2026-10-21T19:00:00Z"),
    event("agora", "2026-10-21T14:30:00Z", "2026-10-21T15:30:00Z"),
    event("segundo", "2026-10-21T17:00:00Z", "2026-10-21T18:00:00Z"),
    event("quarto", "2026-10-21T20:00:00Z", "2026-10-21T21:00:00Z"),
  ], now);
  assert.deepEqual(result.map(({ id }) => id), ["agora", "segundo", "terceiro"]);
});

test("identifica compromisso em andamento sem alterar o status persistido", () => {
  const compromisso = event("agora", "2026-10-21T14:30:00Z", "2026-10-21T15:30:00Z");
  assert.equal(statusAgendaNoMomento(compromisso, now), "em_andamento");
  assert.equal(compromisso.status, "agendado");
});
