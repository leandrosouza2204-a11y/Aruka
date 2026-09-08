import {
  COACH_SIGNAL_PRIORITY,
  COACH_SIGNAL_TYPE,
  buildStudentListSignals,
} from "./coachWorkflowSignals.js";

export const COACH_ATTENTION_QUEUE_PRIORITY = Object.freeze({
  ACTION_REQUIRED: "ACTION_REQUIRED",
  REVIEW: "REVIEW",
  FOLLOW_UP: "FOLLOW_UP",
});

export const COACH_ATTENTION_QUEUE_SIGNAL_MAP = Object.freeze({
  [COACH_SIGNAL_TYPE.NO_ACTIVE_WORKOUT]: {
    priority: COACH_ATTENTION_QUEUE_PRIORITY.ACTION_REQUIRED,
    title: "Sem treino ativo",
    description: "Aluno ativo sem treino ativo no resumo carregado.",
    actionLabel: "Ver treinos",
    actionTarget: "/treinos",
  },
  [COACH_SIGNAL_TYPE.STUDENT_ACCESS_ATTENTION]: {
    priority: COACH_ATTENTION_QUEUE_PRIORITY.REVIEW,
    title: "Acesso do aluno",
    description: "Acesso do aluno precisa de conferência.",
    actionLabel: "Ver aluno",
    actionTarget: "/alunos",
  },
  [COACH_SIGNAL_TYPE.FINANCE_ATTENTION]: {
    priority: COACH_ATTENTION_QUEUE_PRIORITY.REVIEW,
    title: "Cobrança para revisar",
    description: "Resumo financeiro indica uma cobrança para acompanhar.",
    actionLabel: "Ver financeiro",
    actionTarget: "/financeiro",
  },
});

export const COACH_ATTENTION_QUEUE_LIMIT = 5;

const QUEUE_PRIORITY_RANK = {
  [COACH_ATTENTION_QUEUE_PRIORITY.ACTION_REQUIRED]: 0,
  [COACH_ATTENTION_QUEUE_PRIORITY.REVIEW]: 1,
  [COACH_ATTENTION_QUEUE_PRIORITY.FOLLOW_UP]: 2,
};

const SIGNAL_PRIORITY_RANK = {
  [COACH_SIGNAL_PRIORITY.HIGH]: 0,
  [COACH_SIGNAL_PRIORITY.MEDIUM]: 1,
  [COACH_SIGNAL_PRIORITY.INFO]: 2,
};

export function buildCoachAttentionQueue({
  students = [],
  workouts = [],
  precomputedSignalsByStudent = new Map(),
  limit = COACH_ATTENTION_QUEUE_LIMIT,
} = {}) {
  const activeWorkoutStudentIds = buildActiveWorkoutStudentIds(workouts);
  const items = students
    .map((student) => buildQueueItemForStudent({
      student,
      activeWorkoutStudentIds,
      precomputedSignalsByStudent,
    }))
    .filter(Boolean)
    .sort(compareQueueItems);

  return items.slice(0, Math.max(0, Number(limit) || COACH_ATTENTION_QUEUE_LIMIT));
}

export function buildQueueItemForStudent({
  student = {},
  activeWorkoutStudentIds = new Set(),
  precomputedSignalsByStudent = new Map(),
} = {}) {
  const studentId = String(student.id || "");
  if (!studentId) return null;

  const signals = [
    ...buildStudentListSignals(student),
    ...buildNoActiveWorkoutSignal(student, activeWorkoutStudentIds),
    ...getPrecomputedSignals(precomputedSignalsByStudent, studentId),
  ]
    .map(mapSignalToQueueSignal)
    .filter(Boolean);

  const groupedSignals = deduplicateQueueSignals(signals).sort(compareQueueSignals);
  if (!groupedSignals.length) return null;

  const primarySignal = groupedSignals[0];
  return {
    id: `${studentId}:${groupedSignals.map((signal) => signal.code).join("+")}`,
    studentId,
    studentName: student.nome || student.name || "Aluno sem nome",
    priority: primarySignal.priority,
    title: primarySignal.title,
    description: buildGroupedDescription(groupedSignals),
    actionLabel: primarySignal.actionLabel,
    actionTarget: buildActionTarget(primarySignal.actionTarget, studentId),
    signals: groupedSignals,
    occurredAt: primarySignal.occurredAt || "",
  };
}

export function getCoachAttentionQueueStats(queue = []) {
  return {
    total: queue.length,
    actionRequired: queue.filter((item) => item.priority === COACH_ATTENTION_QUEUE_PRIORITY.ACTION_REQUIRED).length,
    review: queue.filter((item) => item.priority === COACH_ATTENTION_QUEUE_PRIORITY.REVIEW).length,
    followUp: queue.filter((item) => item.priority === COACH_ATTENTION_QUEUE_PRIORITY.FOLLOW_UP).length,
  };
}

function buildNoActiveWorkoutSignal(student, activeWorkoutStudentIds) {
  if (String(student.status || "").toLowerCase() !== "ativo") return [];
  if (activeWorkoutStudentIds.has(String(student.id || ""))) return [];

  return [{
    type: COACH_SIGNAL_TYPE.NO_ACTIVE_WORKOUT,
    priority: COACH_SIGNAL_PRIORITY.HIGH,
    title: "Sem treino ativo",
    description: "Aluno ativo sem treino ativo no resumo carregado.",
    actionTarget: "treinos",
    studentId: student.id || "",
    studentName: student.nome || "",
  }];
}

function mapSignalToQueueSignal(signal) {
  const mapping = COACH_ATTENTION_QUEUE_SIGNAL_MAP[signal?.type];
  if (!mapping) return null;

  return {
    code: signal.type,
    priority: mapping.priority,
    signalPriority: signal.priority || COACH_SIGNAL_PRIORITY.INFO,
    title: signal.title || mapping.title,
    description: signal.description || mapping.description,
    actionLabel: mapping.actionLabel,
    actionTarget: mapping.actionTarget,
    occurredAt: signal.occurredAt || "",
  };
}

function buildActiveWorkoutStudentIds(workouts) {
  return new Set(
    workouts
      .filter((workout) => {
        const lifecycle = String(workout?.lifecycleStatus || workout?.lifecycle_status || "").toLowerCase();
        if (lifecycle) return lifecycle === "active";
        return String(workout?.status || "Ativo").toLowerCase() === "ativo";
      })
      .map((workout) => String(workout.alunoId || workout.aluno_id || ""))
      .filter(Boolean)
  );
}

function getPrecomputedSignals(precomputedSignalsByStudent, studentId) {
  if (!precomputedSignalsByStudent) return [];
  const value = precomputedSignalsByStudent instanceof Map
    ? precomputedSignalsByStudent.get(studentId)
    : precomputedSignalsByStudent[studentId];
  return Array.isArray(value) ? value : [];
}

function deduplicateQueueSignals(signals) {
  const seen = new Set();
  return signals.filter((signal) => {
    if (seen.has(signal.code)) return false;
    seen.add(signal.code);
    return true;
  });
}

function compareQueueSignals(a, b) {
  const queuePriority = (QUEUE_PRIORITY_RANK[a.priority] ?? 9) - (QUEUE_PRIORITY_RANK[b.priority] ?? 9);
  if (queuePriority !== 0) return queuePriority;
  const signalPriority = (SIGNAL_PRIORITY_RANK[a.signalPriority] ?? 9) - (SIGNAL_PRIORITY_RANK[b.signalPriority] ?? 9);
  if (signalPriority !== 0) return signalPriority;
  const date = getDateValue(b.occurredAt) - getDateValue(a.occurredAt);
  if (date !== 0) return date;
  return String(a.code).localeCompare(String(b.code), "pt-BR");
}

function compareQueueItems(a, b) {
  const priority = (QUEUE_PRIORITY_RANK[a.priority] ?? 9) - (QUEUE_PRIORITY_RANK[b.priority] ?? 9);
  if (priority !== 0) return priority;
  const date = getDateValue(b.occurredAt) - getDateValue(a.occurredAt);
  if (date !== 0) return date;
  const name = String(a.studentName).localeCompare(String(b.studentName), "pt-BR");
  if (name !== 0) return name;
  return String(a.studentId).localeCompare(String(b.studentId), "pt-BR");
}

function buildGroupedDescription(signals) {
  if (signals.length === 1) return signals[0].description;
  return signals.map((signal) => signal.title).join(" + ");
}

function buildActionTarget(baseTarget, studentId) {
  if (baseTarget === "/treinos") return `/treinos?aluno=${encodeURIComponent(studentId)}&origem=coach-attention`;
  if (baseTarget === "/financeiro") return `/financeiro?aluno=${encodeURIComponent(studentId)}&origem=coach-attention`;
  return `/alunos?aluno=${encodeURIComponent(studentId)}&origem=coach-attention`;
}

function getDateValue(value) {
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}
