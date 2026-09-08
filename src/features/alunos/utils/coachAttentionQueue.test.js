import test from "node:test";
import assert from "node:assert/strict";
import {
  COACH_ATTENTION_QUEUE_PRIORITY,
  buildCoachAttentionQueue,
  buildQueueItemForStudent,
  getCoachAttentionQueueStats,
} from "./coachAttentionQueue.js";
import { COACH_SIGNAL_PRIORITY, COACH_SIGNAL_TYPE } from "./coachWorkflowSignals.js";

test("student without signals does not enter attention queue", () => {
  const queue = buildCoachAttentionQueue({
    students: [student({ studentAccessStatus: "active" })],
    workouts: [workout("student-1")],
  });

  assert.equal(queue.length, 0);
});

test("single actionable signal creates queue item", () => {
  const queue = buildCoachAttentionQueue({
    students: [student({ studentAccessStatus: "active" })],
    workouts: [],
  });

  assert.equal(queue.length, 1);
  assert.equal(queue[0].studentId, "student-1");
  assert.equal(queue[0].signals[0].code, COACH_SIGNAL_TYPE.NO_ACTIVE_WORKOUT);
  assert.equal(queue[0].priority, COACH_ATTENTION_QUEUE_PRIORITY.ACTION_REQUIRED);
});

test("multiple signals for the same student are grouped", () => {
  const queue = buildCoachAttentionQueue({
    students: [student({ studentAccessStatus: "suspended", atencaoCobranca: billingAttention(true) })],
    workouts: [],
  });

  assert.equal(queue.length, 1);
  assert.equal(queue[0].signals.length, 3);
  assert.match(queue[0].id, /NO_ACTIVE_WORKOUT/);
  assert.match(queue[0].description, /Sem treino ativo/);
});

test("multiple students are ordered by priority and then name", () => {
  const queue = buildCoachAttentionQueue({
    students: [
      student({ id: "b", nome: "Bruna", status: "Inativo", studentAccessStatus: "suspended" }),
      student({ id: "a", nome: "Ana", studentAccessStatus: "active" }),
    ],
    workouts: [],
  });

  assert.deepEqual(queue.map((item) => item.studentName), ["Ana", "Bruna"]);
});

test("precomputed timestamps order items inside same priority", () => {
  const queue = buildCoachAttentionQueue({
    students: [
      student({ id: "old", nome: "Old", status: "Inativo", studentAccessStatus: "active" }),
      student({ id: "new", nome: "New", status: "Inativo", studentAccessStatus: "active" }),
    ],
    workouts: [],
    precomputedSignalsByStudent: new Map([
      ["old", [signal({ occurredAt: "2026-08-01" })]],
      ["new", [signal({ occurredAt: "2026-08-20" })]],
    ]),
  });

  assert.deepEqual(queue.map((item) => item.studentId), ["new", "old"]);
});

test("unknown signal is ignored safely", () => {
  const item = buildQueueItemForStudent({
    student: student({ status: "Inativo", studentAccessStatus: "active" }),
    precomputedSignalsByStudent: new Map([["student-1", [{ type: "UNKNOWN_SIGNAL" }]]]),
  });

  assert.equal(item, null);
});

test("absence of timestamp falls back to deterministic student name ordering", () => {
  const queue = buildCoachAttentionQueue({
    students: [
      student({ id: "b", nome: "Bruna", status: "Inativo", studentAccessStatus: "suspended" }),
      student({ id: "a", nome: "Ana", status: "Inativo", studentAccessStatus: "suspended" }),
    ],
    workouts: [],
  });

  assert.deepEqual(queue.map((item) => item.studentName), ["Ana", "Bruna"]);
});

test("partial data still builds safe queue from loaded students", () => {
  const queue = buildCoachAttentionQueue({
    students: [student({ studentAccessStatus: "active" })],
  });

  assert.equal(queue[0].signals[0].code, COACH_SIGNAL_TYPE.NO_ACTIVE_WORKOUT);
});

test("finance attention is consumed without mutating finance data", () => {
  const atencaoCobranca = billingAttention(false);
  const queue = buildCoachAttentionQueue({
    students: [student({ studentAccessStatus: "active", atencaoCobranca })],
    workouts: [workout("student-1")],
  });

  assert.equal(queue[0].signals[0].code, COACH_SIGNAL_TYPE.FINANCE_ATTENTION);
  assert.equal(atencaoCobranca.highestPriority.vencido, false);
});

test("stats expose compact queue totals", () => {
  const queue = buildCoachAttentionQueue({
    students: [
      student({ id: "a", studentAccessStatus: "active" }),
      student({ id: "b", status: "Inativo", studentAccessStatus: "suspended" }),
    ],
    workouts: [],
  });

  assert.deepEqual(getCoachAttentionQueueStats(queue), {
    total: 2,
    actionRequired: 1,
    review: 1,
    followUp: 0,
  });
});

function student(overrides = {}) {
  return {
    id: "student-1",
    nome: "Aluno QA",
    status: "Ativo",
    studentAccessStatus: "not_invited",
    ...overrides,
  };
}

function workout(alunoId) {
  return { id: `workout-${alunoId}`, alunoId, status: "Ativo", lifecycleStatus: "active" };
}

function signal(overrides = {}) {
  return {
    type: COACH_SIGNAL_TYPE.STUDENT_ACCESS_ATTENTION,
    priority: COACH_SIGNAL_PRIORITY.MEDIUM,
    title: "Acesso nao liberado",
    description: "Acesso do aluno precisa de conferencia.",
    occurredAt: "",
    ...overrides,
  };
}

function billingAttention(vencido) {
  return {
    requerAtencao: true,
    highestPriority: {
      requerAtencao: true,
      vencido,
      vencendo: !vencido,
      dataReferencia: vencido ? "2026-08-20" : "2026-08-30",
    },
  };
}
