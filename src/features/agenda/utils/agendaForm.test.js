import assert from "node:assert/strict";
import test from "node:test";
import { applyAgendaStartChange, createAgendaInitialForm } from "./agendaForm.js";

test("new commitments start with the suggested 60 minute duration", () => {
  const form = createAgendaInitialForm({ prefillDate: "2026-10-22" });
  assert.equal(form.inicio, "09:00");
  assert.equal(form.fim, "10:00");
});

test("editing preserves persisted times during initial loading", () => {
  const form = createAgendaInitialForm({
    id: "event-1",
    inicio: "2026-10-22T12:30:00.000Z",
    fim: "2026-10-22T14:15:00.000Z",
    titulo: "Avaliação",
    tipo: "atendimento",
    alunos: [{ id: "student-1", nome: "Aluno" }],
  });
  assert.equal(form.inicio, "09:30");
  assert.equal(form.fim, "11:15");
});

test("an explicit start change replaces a manual end and preserves other fields", () => {
  const current = { titulo: "Consulta", inicio: "09:30", fim: "12:10", observacoes: "Preservar" };
  const changed = applyAgendaStartChange(current, "18:45");
  assert.deepEqual(changed, {
    form: { titulo: "Consulta", inicio: "18:45", fim: "19:45", observacoes: "Preservar" },
    crossesMidnight: false,
  });
  const manuallyAdjusted = { ...changed.form, fim: "20:10" };
  assert.equal(manuallyAdjusted.fim, "20:10");
  assert.equal({ ...manuallyAdjusted, titulo: "Outro" }.fim, "20:10");
});

test("an explicit near-midnight start change requires a same-day manual end", () => {
  const changed = applyAgendaStartChange({ inicio: "22:00", fim: "23:00" }, "23:30");
  assert.deepEqual(changed, { form: { inicio: "23:30", fim: "" }, crossesMidnight: true });
});
