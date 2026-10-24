import assert from "node:assert/strict";
import test from "node:test";
import {
  AGENDA_CONFLICT_MESSAGE,
  applyAgendaCancellation,
  describeAgendaCancellationFailure,
  describeAgendaSaveFailure,
} from "./agendaMutation.js";

test("schedule conflicts receive the accessible inline message", () => {
  assert.deepEqual(describeAgendaSaveFailure({ code: "AGENDA_CONFLICT", message: "internal" }), {
    field: "schedule",
    message: AGENDA_CONFLICT_MESSAGE,
  });
});

test("unexpected save and cancellation errors never expose internal details", () => {
  assert.deepEqual(describeAgendaSaveFailure(new Error("database detail")), {
    field: "form",
    message: "Não foi possível salvar o compromisso. Tente novamente.",
  });
  assert.equal(
    describeAgendaCancellationFailure(new Error("database detail")),
    "Não foi possível cancelar o compromisso. Tente novamente.",
  );
});

test("occurrence cancellation changes only the selected standalone event", () => {
  const events = [
    { id: "one", serieId: "", status: "agendado" },
    { id: "two", serieId: "", status: "agendado" },
  ];
  assert.deepEqual(applyAgendaCancellation(events, events[0], "ocorrencia"), [
    { id: "one", serieId: "", status: "cancelado" },
    events[1],
  ]);
});

test("recurring occurrence cancellation preserves the remaining series", () => {
  const events = [
    { id: "one", serieId: "series", status: "agendado" },
    { id: "two", serieId: "series", status: "agendado" },
    { id: "other", serieId: "other-series", status: "agendado" },
  ];
  assert.deepEqual(applyAgendaCancellation(events, events[0], "ocorrencia"), [
    { ...events[0], status: "cancelado" },
    events[1],
    events[2],
  ]);
});

test("series cancellation changes only occurrences from the selected series", () => {
  const events = [
    { id: "one", serieId: "series", status: "agendado" },
    { id: "two", serieId: "series", status: "agendado" },
    { id: "other", serieId: "other-series", status: "agendado" },
  ];
  assert.deepEqual(applyAgendaCancellation(events, events[0], "serie"), [
    { ...events[0], status: "cancelado" },
    { ...events[1], status: "cancelado" },
    events[2],
  ]);
});
