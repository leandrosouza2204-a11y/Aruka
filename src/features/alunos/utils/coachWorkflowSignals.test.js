import test from "node:test";
import assert from "node:assert/strict";
import {
  COACH_SIGNAL_PRIORITY,
  COACH_SIGNAL_TYPE,
  MAX_SIGNALS_PER_STUDENT,
  buildCoachWorkflowSignals,
  buildCoachWorkflowSignalsForStudents,
  buildStudentListSignals,
} from "./coachWorkflowSignals.js";

const NOW = new Date("2026-08-27T12:00:00Z");

test("student with active recent execution gets informational review signal", () => {
  const signals = buildCoachWorkflowSignals({
    aluno: activeStudent(),
    treinos: [activeWorkout()],
    execucoes: [completedSession("2026-08-26")],
  }, { now: NOW });

  assert.equal(signals.at(-1).type, COACH_SIGNAL_TYPE.RECENT_EXECUTION_ACTIVITY);
  assert.match(signals.at(-1).description, /últimos 7 dias/i);
});

test("student with no execution after grace gets factual inactivity signal", () => {
  const signals = buildCoachWorkflowSignals({
    aluno: activeStudent({ inicio: "2026-08-01", studentAccessStatus: "active" }),
    treinos: [activeWorkout()],
    execucoes: [],
  }, { now: NOW });

  assert.equal(signals[0].type, COACH_SIGNAL_TYPE.EXECUTION_INACTIVITY);
  assert.doesNotMatch(JSON.stringify(signals), /aderencia|percent/i);
});

test("student with old execution gets no recent execution signal", () => {
  const signals = buildCoachWorkflowSignals({
    aluno: activeStudent({ studentAccessStatus: "active" }),
    treinos: [activeWorkout()],
    execucoes: [completedSession("2026-08-10")],
  }, { now: NOW });

  assert.equal(signals[0].type, COACH_SIGNAL_TYPE.EXECUTION_INACTIVITY);
  assert.match(signals[0].description, /Última sessão concluída registrada/i);
});

test("recent abandoned session is not treated as completed", () => {
  const signals = buildCoachWorkflowSignals({
    aluno: activeStudent({ studentAccessStatus: "active" }),
    treinos: [activeWorkout()],
    execucoes: [
      completedSession("2026-08-10"),
      abandonedSession("2026-08-26"),
    ],
  }, { now: NOW });

  assert.equal(signals[0].type, COACH_SIGNAL_TYPE.RECENT_ABANDONED_SESSION);
  assert.equal(signals[1].type, COACH_SIGNAL_TYPE.EXECUTION_INACTIVITY);
});

test("no active workout is high priority and actionable", () => {
  const signals = buildCoachWorkflowSignals({
    aluno: activeStudent({ studentAccessStatus: "active" }),
    treinos: [],
    execucoes: [completedSession("2026-08-26")],
  }, { now: NOW });

  assert.equal(signals[0].type, COACH_SIGNAL_TYPE.NO_ACTIVE_WORKOUT);
  assert.equal(signals[0].priority, COACH_SIGNAL_PRIORITY.HIGH);
  assert.equal(signals[0].actionTarget, "treinos");
});

test("student with active lifecycle workout does not get no-workout signal after execution completion", () => {
  const signals = buildCoachWorkflowSignals({
    aluno: activeStudent({ nome: "Student QA Daily Experience", studentAccessStatus: "active" }),
    treinos: [
      activeWorkout({ id: "active", status: "Finalizado", lifecycleStatus: "active" }),
      activeWorkout({ id: "completed", status: "Finalizado", lifecycleStatus: "completed", completedAt: "2026-08-25" }),
    ],
    execucoes: [completedSession("2026-08-26")],
  }, { now: NOW });

  assert.equal(signals.some((signal) => signal.type === COACH_SIGNAL_TYPE.NO_ACTIVE_WORKOUT), false);
});

test("student with only completed workout keeps real no-workout signal", () => {
  const signals = buildCoachWorkflowSignals({
    aluno: activeStudent({ studentAccessStatus: "active" }),
    treinos: [activeWorkout({ status: "Finalizado", lifecycleStatus: "completed", completedAt: "2026-08-25" })],
    execucoes: [completedSession("2026-08-26")],
  }, { now: NOW });

  assert.equal(signals.some((signal) => signal.type === COACH_SIGNAL_TYPE.NO_ACTIVE_WORKOUT), true);
});

test("student access statuses produce correct compact copy", () => {
  const expected = [
    ["active", null],
    ["invited", "Convite de acesso enviado"],
    ["suspended", "Acesso suspenso"],
    ["revoked", "Acesso revogado"],
    ["not_invited", "Acesso não liberado"],
  ];

  for (const [status, title] of expected) {
    const signals = buildCoachWorkflowSignals({
      aluno: activeStudent({ studentAccessStatus: status }),
      treinos: [activeWorkout()],
      execucoes: [completedSession("2026-08-26")],
    }, { now: NOW });
    const access = signals.find((signal) => signal.type === COACH_SIGNAL_TYPE.STUDENT_ACCESS_ATTENTION);
    assert.equal(access?.title || null, title);
  }
});

test("finance pending, due soon, overdue and current are separated", () => {
  const dueSoon = buildCoachWorkflowSignals({
    aluno: activeStudent({ studentAccessStatus: "active" }),
    treinos: [activeWorkout()],
    execucoes: [completedSession("2026-08-26")],
    atencaoCobranca: billingAttention({ vencido: false }),
  }, { now: NOW }).find((signal) => signal.type === COACH_SIGNAL_TYPE.FINANCE_ATTENTION);
  assert.equal(dueSoon.title, "Pagamento próximo");

  const overdue = buildCoachWorkflowSignals({
    aluno: activeStudent({ studentAccessStatus: "active" }),
    treinos: [activeWorkout()],
    execucoes: [completedSession("2026-08-26")],
    atencaoCobranca: billingAttention({ vencido: true }),
  }, { now: NOW }).find((signal) => signal.type === COACH_SIGNAL_TYPE.FINANCE_ATTENTION);
  assert.equal(overdue.title, "Pagamento vencido");
  assert.equal(overdue.priority, COACH_SIGNAL_PRIORITY.HIGH);

  const pending = buildCoachWorkflowSignals({
    aluno: activeStudent({ studentAccessStatus: "active" }),
    treinos: [activeWorkout()],
    execucoes: [completedSession("2026-08-26")],
    financeiro: { quantidadePagamentos: 2, recorrenteEmDia: false, proximoVencimento: "2026-09-01" },
  }, { now: NOW }).find((signal) => signal.type === COACH_SIGNAL_TYPE.FINANCE_ATTENTION);
  assert.equal(pending.title, "Financeiro para conferir");

  const current = buildCoachWorkflowSignals({
    aluno: activeStudent({ studentAccessStatus: "active" }),
    treinos: [activeWorkout()],
    execucoes: [completedSession("2026-08-26")],
    financeiro: { quantidadePagamentos: 2, recorrenteEmDia: true },
  }, { now: NOW }).filter((signal) => signal.type === COACH_SIGNAL_TYPE.FINANCE_ATTENTION);
  assert.equal(current.length, 0);
});

test("assessment context is not converted into stale signal without contract", () => {
  const signals = buildCoachWorkflowSignals({
    aluno: activeStudent({ studentAccessStatus: "active" }),
    treinos: [activeWorkout()],
    execucoes: [completedSession("2026-08-26")],
    avaliacoes: [{ data: "2025-01-01" }],
  }, { now: NOW });

  assert.equal(signals.some((signal) => /avali/i.test(signal.source)), false);
});

test("priority ordering is stable", () => {
  const signals = buildCoachWorkflowSignals({
    aluno: activeStudent({ nome: "Bruna", studentAccessStatus: "suspended" }),
    treinos: [],
    execucoes: [completedSession("2026-08-26")],
  }, { now: NOW });

  assert.deepEqual(signals.map((signal) => signal.priority), [
    COACH_SIGNAL_PRIORITY.HIGH,
    COACH_SIGNAL_PRIORITY.HIGH,
    COACH_SIGNAL_PRIORITY.INFO,
  ]);
});

test("deduplication avoids equivalent inactivity signals and caps max signals", () => {
  const signals = buildCoachWorkflowSignals({
    aluno: activeStudent({ studentAccessStatus: "revoked" }),
    treinos: [],
    execucoes: [abandonedSession("2026-08-26")],
    atencaoCobranca: billingAttention({ vencido: true }),
  }, { now: NOW });

  assert.equal(signals.length, MAX_SIGNALS_PER_STUDENT);
  assert.equal(new Set(signals.map((signal) => signal.type)).size, signals.length);
});

test("cross-student isolation in inputs", () => {
  const result = buildCoachWorkflowSignalsForStudents([
    { aluno: activeStudent({ id: "a1", nome: "Ana", studentAccessStatus: "active" }), treinos: [], execucoes: [] },
    { aluno: activeStudent({ id: "b1", nome: "Bia", studentAccessStatus: "revoked" }), treinos: [activeWorkout()], execucoes: [completedSession("2026-08-26")] },
  ], { now: NOW });

  assert.equal(result[0].studentId, "a1");
  assert.equal(result[0].signals[0].studentId, "a1");
  assert.equal(result[1].studentId, "b1");
  assert.equal(result[1].signals[0].studentId, "b1");
});

test("first-time student uses neutral copy during grace period", () => {
  const signals = buildCoachWorkflowSignals({
    aluno: activeStudent({ inicio: "2026-08-25", studentAccessStatus: "active" }),
    treinos: [activeWorkout()],
    execucoes: [],
  }, { now: NOW });

  assert.equal(signals[0].title, "Sem execução registrada ainda");
  assert.equal(signals[0].priority, COACH_SIGNAL_PRIORITY.INFO);
});

test("list signals use only already loaded student fields", () => {
  const signals = buildStudentListSignals(activeStudent({
    studentAccessStatus: "suspended",
    atencaoCobranca: billingAttention({ vencido: true }),
  }));

  assert.equal(signals.length, 2);
  assert.equal(signals[0].priority, COACH_SIGNAL_PRIORITY.HIGH);
});

test("empty data returns conservative signal set", () => {
  const signals = buildCoachWorkflowSignals({}, { now: NOW });
  assert.equal(signals.some((signal) => signal.type === COACH_SIGNAL_TYPE.NO_ACTIVE_WORKOUT), false);
});

function activeStudent(overrides = {}) {
  return {
    id: "student-1",
    nome: "Aluno QA",
    status: "Ativo",
    inicio: "2026-08-01",
    studentAccessStatus: "not_invited",
    ...overrides,
  };
}

function activeWorkout(overrides = {}) {
  return { id: "workout-1", status: "Ativo", lifecycleStatus: "active", rotina: "Treino A", ...overrides };
}

function completedSession(date) {
  return {
    id: `completed-${date}`,
    status: "completed",
    sessionDate: date,
    completedAt: `${date}T10:00:00Z`,
    exercises: [{ workoutTitle: "Treino A", dayName: "Dia 1", sets: [{ completed: true, reps: 10 }] }],
  };
}

function abandonedSession(date) {
  return {
    id: `abandoned-${date}`,
    status: "abandoned",
    sessionDate: date,
    abandonedAt: `${date}T10:00:00Z`,
    exercises: [{ workoutTitle: "Treino B", dayName: "Dia 2", sets: [] }],
  };
}

function billingAttention({ vencido }) {
  return {
    requerAtencao: true,
    highestPriority: {
      tipo: "contrato",
      requerAtencao: true,
      vencido,
      vencendo: !vencido,
      dataReferencia: vencido ? "2026-08-20" : "2026-08-30",
    },
  };
}
