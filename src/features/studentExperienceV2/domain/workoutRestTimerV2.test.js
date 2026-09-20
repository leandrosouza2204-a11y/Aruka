import assert from "node:assert/strict";
import test from "node:test";
import {
  createServerClockAnchor,
  deriveCanonicalRest,
  deriveRestTimerPresentation,
  estimateServerNow,
  isSameCanonicalRest,
  normalizeCanonicalTimestamp,
} from "./workoutRestTimerV2.js";

const session = (overrides = {}) => ({
  id: "session-a",
  status: "in_progress",
  serverNow: "2026-09-19T12:00:30.000Z",
  exercises: [{
    id: "exercise-a",
    name: "Agachamento",
    prescribedSeries: "3",
    prescribedRest: "60 s",
    status: "partial",
    sets: [{ setNumber: 1, completed: true, completedAt: "2026-09-19T12:00:00.000Z" }],
  }],
  ...overrides,
});

test("normalizes canonical timestamps and rejects invalid values", () => {
  assert.equal(normalizeCanonicalTimestamp("2026-09-19T12:00:00Z"), 1_789_819_200_000);
  assert.equal(normalizeCanonicalTimestamp("invalid"), null);
  assert.equal(normalizeCanonicalTimestamp(""), null);
});

test("derives identity, duration and deadline only from persisted completion and snapshot", () => {
  const rest = deriveCanonicalRest(session());
  assert.equal(rest.sessionId, "session-a");
  assert.equal(rest.executionExerciseId, "exercise-a");
  assert.equal(rest.setNumber, 1);
  assert.equal(rest.durationSeconds, 60);
  assert.equal(rest.endsAtMs, rest.startedAtMs + 60_000);
  assert.match(rest.identity, /session-a/);
});

test("does not create rest without duration, valid timestamp, completion or pending workout set", () => {
  assert.equal(deriveCanonicalRest(session({ exercises: [{ ...session().exercises[0], prescribedRest: "" }] })), null);
  assert.equal(deriveCanonicalRest(session({ exercises: [{ ...session().exercises[0], prescribedRest: "n/a" }] })), null);
  assert.equal(deriveCanonicalRest(session({ exercises: [{ ...session().exercises[0], sets: [{ setNumber: 1, completed: true, completedAt: "invalid" }] }] })), null);
  assert.equal(deriveCanonicalRest(session({ exercises: [{ ...session().exercises[0], sets: [{ setNumber: 1, completed: false, completedAt: "2026-09-19T12:00:00Z" }] }] })), null);
  assert.equal(deriveCanonicalRest(session({ exercises: [{ ...session().exercises[0], status: "skipped" }] })), null);
  assert.equal(deriveCanonicalRest(session({ exercises: [{ ...session().exercises[0], prescribedSeries: "1" }] })), null);
});

test("new canonical set identity replaces the previous rest and equal retry does not restart it", () => {
  const first = deriveCanonicalRest(session());
  const retry = deriveCanonicalRest(session());
  const second = deriveCanonicalRest(session({ exercises: [{
    ...session().exercises[0],
    sets: [
      ...session().exercises[0].sets,
      { setNumber: 2, completed: true, completedAt: "2026-09-19T12:00:40.000Z" },
    ],
  }] }));
  assert.equal(isSameCanonicalRest(first, retry), true);
  assert.equal(isSameCanonicalRest(first, second), false);
  assert.equal(second.setNumber, 2);
  assert.equal(second.startedAt, "2026-09-19T12:00:40.000Z");
});

test("a newer completion without rest clears an older active rest", () => {
  const player = session({ exercises: [
    session().exercises[0],
    {
      id: "exercise-b",
      name: "Remada",
      prescribedSeries: "2",
      prescribedRest: "",
      status: "partial",
      sets: [{ setNumber: 1, completed: true, completedAt: "2026-09-19T12:00:40.000Z" }],
    },
  ] });
  assert.equal(deriveCanonicalRest(player), null);
});

test("terminal and switched sessions cannot reuse a rest identity", () => {
  assert.equal(deriveCanonicalRest(session({ status: "cancelled" })), null);
  assert.equal(deriveCanonicalRest(session({ status: "completed" })), null);
  assert.equal(deriveCanonicalRest(session({ status: "abandoned" })), null);
  assert.equal(isSameCanonicalRest(deriveCanonicalRest(session()), deriveCanonicalRest(session({ id: "session-b" }))), false);
});

test("uses a monotonic server anchor, clamps at duration and zero, and survives local clock changes", () => {
  const anchor = createServerClockAnchor("2026-09-19T12:00:30.000Z", 5_000, 120);
  assert.equal(anchor.uncertaintyMs, 120);
  assert.equal(estimateServerNow(anchor, 15_000), Date.parse("2026-09-19T12:00:40.000Z"));

  const rest = deriveCanonicalRest(session());
  assert.deepEqual(
    { status: deriveRestTimerPresentation(rest, Date.parse("2026-09-19T11:59:00Z")).status, remaining: deriveRestTimerPresentation(rest, Date.parse("2026-09-19T11:59:00Z")).remainingSeconds },
    { status: "active", remaining: 60 },
  );
  assert.equal(deriveRestTimerPresentation(rest, Date.parse("2026-09-19T12:00:30Z")).remainingSeconds, 30);
  assert.deepEqual(
    { status: deriveRestTimerPresentation(rest, Date.parse("2026-09-19T12:02:00Z")).status, remaining: deriveRestTimerPresentation(rest, Date.parse("2026-09-19T12:02:00Z")).remainingSeconds },
    { status: "completed", remaining: 0 },
  );
});

test("reload reconstruction is deterministic and navigation does not mutate the player", () => {
  const player = session();
  const before = structuredClone(player);
  const first = deriveCanonicalRest(player);
  const reloaded = deriveCanonicalRest(structuredClone(player));
  assert.deepEqual(reloaded, first);
  assert.deepEqual(player, before);
});
