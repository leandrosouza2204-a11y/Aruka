import assert from "node:assert/strict";
import test from "node:test";
import {
  addDays,
  agendaRange,
  eventsByDate,
  moveAgendaDate,
  startOfWeek,
  validateAgendaForm,
} from "./agendaDate.js";

test("agenda ranges keep day, Monday-first week and calendar month boundaries", () => {
  assert.deepEqual(agendaRange("2026-10-21", "dia"), { startKey: "2026-10-21", endKey: "2026-10-22" });
  assert.equal(startOfWeek("2026-10-21"), "2026-10-19");
  assert.deepEqual(agendaRange("2026-10-21", "semana"), { startKey: "2026-10-19", endKey: "2026-10-26" });
  assert.deepEqual(agendaRange("2026-12-20", "mes"), { startKey: "2026-12-01", endKey: "2027-01-01" });
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(moveAgendaDate("2026-10-21", "semana", 1), "2026-10-28");
});

test("events are grouped by professional timezone and sorted chronologically", () => {
  const grouped = eventsByDate([
    { id: "late", inicio: "2026-10-22T00:30:00.000Z" },
    { id: "early", inicio: "2026-10-21T10:00:00.000Z" },
  ]);
  assert.deepEqual(grouped["2026-10-21"].map((item) => item.id), ["early", "late"]);
});

test("form validation supports personal events and requires students for appointments", () => {
  const base = { titulo: "Bloqueio", tipo: "bloqueio", data: "2026-10-21", inicio: "08:00", fim: "09:00", alunoIds: [], frequencia: "nenhuma" };
  assert.equal(validateAgendaForm(base).valid, true);
  const appointment = validateAgendaForm({ ...base, tipo: "atendimento" });
  assert.equal(appointment.valid, false);
  assert.match(appointment.errors.alunoIds, /aluno/);
});

test("form validation rejects invalid, reversed and cross-midnight intervals", () => {
  const base = { titulo: "Bloqueio", tipo: "bloqueio", data: "2026-10-21", alunoIds: [], frequencia: "nenhuma" };
  assert.match(validateAgendaForm({ ...base, inicio: "09:30", fim: "09:30" }).errors.fim, /posterior/);
  assert.match(validateAgendaForm({ ...base, inicio: "19:45", fim: "18:00" }).errors.fim, /mesmo dia/);
  assert.match(validateAgendaForm({ ...base, inicio: "23:30", fim: "00:30" }).errors.fim, /mesmo dia/);
  assert.match(validateAgendaForm({ ...base, inicio: "25:00", fim: "26:00" }).errors.inicio, /válido/);
});

test("form validation explains when the default duration would cross midnight", () => {
  const result = validateAgendaForm({
    titulo: "Bloqueio", tipo: "bloqueio", data: "2026-10-21", inicio: "23:30", fim: "",
    alunoIds: [], frequencia: "nenhuma",
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.fim, /meia-noite/);
});

test("recurrence validation enforces bounded series", () => {
  const result = validateAgendaForm({
    titulo: "Turma", tipo: "atendimento", data: "2026-10-21", inicio: "07:00", fim: "08:00",
    alunoIds: ["student"], frequencia: "dias_semana", diasSemana: [1, 3, 5],
    terminoRecorrencia: "quantidade", quantidade: 367,
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.quantidade, /366/);
});
