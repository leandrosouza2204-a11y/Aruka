import {
  COACH_SIGNAL_PRIORITY,
  COACH_SIGNAL_TYPE,
  buildStudentListSignals,
} from "./coachWorkflowSignals.js";
import { montarUrlContextualAluno } from "./alunosContextNavigation.js";

export const COACH_ATTENTION_QUEUE_PRIORITY = Object.freeze({
  ACTION_REQUIRED: "ACTION_REQUIRED",
  REVIEW: "REVIEW",
  FOLLOW_UP: "FOLLOW_UP",
});

export const COACH_WORKFLOW_ACTION_TYPE = Object.freeze({
  OPEN_STUDENT: "OPEN_STUDENT",
  OPEN_WORKOUTS: "OPEN_WORKOUTS",
  OPEN_FINANCE: "OPEN_FINANCE",
  OPEN_ACCESS: "OPEN_ACCESS",
});

export const COACH_WORKFLOW_ITEM_STATE = Object.freeze({
  ATTENTION: "ATTENTION",
  ACKNOWLEDGED: "ACKNOWLEDGED",
});

export const COACH_ATTENTION_QUEUE_SIGNAL_MAP = Object.freeze({
  [COACH_SIGNAL_TYPE.NO_ACTIVE_WORKOUT]: {
    priority: COACH_ATTENTION_QUEUE_PRIORITY.ACTION_REQUIRED,
    title: "Sem treino ativo",
    description: "Aluno ativo sem treino ativo no resumo carregado.",
    primaryAction: {
      type: COACH_WORKFLOW_ACTION_TYPE.OPEN_WORKOUTS,
      label: "Gerenciar treino",
      destination: "treinos",
    },
    secondaryAction: {
      type: COACH_WORKFLOW_ACTION_TYPE.OPEN_STUDENT,
      label: "Ver aluno",
      destination: "alunos",
    },
  },
  [COACH_SIGNAL_TYPE.STUDENT_ACCESS_ATTENTION]: {
    priority: COACH_ATTENTION_QUEUE_PRIORITY.REVIEW,
    title: "Acesso do aluno",
    description: "Acesso do aluno precisa de conferência.",
    primaryAction: {
      type: COACH_WORKFLOW_ACTION_TYPE.OPEN_ACCESS,
      label: "Revisar acesso",
      destination: "alunos",
      hash: "student-access-panel",
    },
    secondaryAction: {
      type: COACH_WORKFLOW_ACTION_TYPE.OPEN_STUDENT,
      label: "Ver aluno",
      destination: "alunos",
    },
  },
  [COACH_SIGNAL_TYPE.FINANCE_ATTENTION]: {
    priority: COACH_ATTENTION_QUEUE_PRIORITY.REVIEW,
    title: "Cobrança para revisar",
    description: "Resumo financeiro indica uma cobrança para acompanhar.",
    primaryAction: {
      type: COACH_WORKFLOW_ACTION_TYPE.OPEN_FINANCE,
      label: "Ver financeiro",
      destination: "financeiro",
    },
    secondaryAction: {
      type: COACH_WORKFLOW_ACTION_TYPE.OPEN_STUDENT,
      label: "Ver aluno",
      destination: "alunos",
    },
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
  acknowledgedItemIds = new Set(),
  limit = COACH_ATTENTION_QUEUE_LIMIT,
} = {}) {
  const activeWorkoutStudentIds = buildActiveWorkoutStudentIds(workouts);
  const items = students
    .map((student) => buildQueueItemForStudent({
      student,
      activeWorkoutStudentIds,
      precomputedSignalsByStudent,
      acknowledgedItemIds,
    }))
    .filter(Boolean)
    .sort(compareQueueItems);

  return items.slice(0, Math.max(0, Number(limit) || COACH_ATTENTION_QUEUE_LIMIT));
}

export function buildQueueItemForStudent({
  student = {},
  activeWorkoutStudentIds = new Set(),
  precomputedSignalsByStudent = new Map(),
  acknowledgedItemIds = new Set(),
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
  const primaryAction = resolveCoachWorkflowAction(primarySignal.primaryAction, { studentId });
  const secondaryAction = resolveCoachWorkflowAction(primarySignal.secondaryAction, { studentId });
  const id = `${studentId}:${groupedSignals.map((signal) => signal.code).join("+")}`;
  return {
    id,
    studentId,
    studentName: student.nome || student.name || "Aluno sem nome",
    priority: primarySignal.priority,
    title: primarySignal.title,
    description: buildGroupedDescription(groupedSignals),
    actionLabel: primaryAction?.label || "",
    actionTarget: primaryAction?.target || "",
    primaryAction,
    secondaryAction,
    signals: groupedSignals,
    occurredAt: primarySignal.occurredAt || "",
    workflowState: hasAcknowledgedItem(acknowledgedItemIds, id)
      ? COACH_WORKFLOW_ITEM_STATE.ACKNOWLEDGED
      : COACH_WORKFLOW_ITEM_STATE.ATTENTION,
  };
}

export function resolveCoachWorkflowAction(action, { studentId } = {}) {
  if (!action?.type || !studentId) return null;

  const baseTarget = resolveActionBaseTarget(action.destination, studentId);
  if (!baseTarget) return null;

  return {
    type: action.type,
    label: action.label,
    target: action.hash ? `${baseTarget}#${action.hash}` : baseTarget,
    context: {
      studentId,
      destination: action.destination,
    },
  };
}

export function getCoachAttentionQueueStats(queue = []) {
  return {
    total: queue.length,
    acknowledged: queue.filter((item) => item.workflowState === COACH_WORKFLOW_ITEM_STATE.ACKNOWLEDGED).length,
    attention: queue.filter((item) => item.workflowState !== COACH_WORKFLOW_ITEM_STATE.ACKNOWLEDGED).length,
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
    primaryAction: mapping.primaryAction,
    secondaryAction: mapping.secondaryAction,
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
  const workflowState = getWorkflowStateRank(a.workflowState) - getWorkflowStateRank(b.workflowState);
  if (workflowState !== 0) return workflowState;
  const priority = (QUEUE_PRIORITY_RANK[a.priority] ?? 9) - (QUEUE_PRIORITY_RANK[b.priority] ?? 9);
  if (priority !== 0) return priority;
  const date = getDateValue(b.occurredAt) - getDateValue(a.occurredAt);
  if (date !== 0) return date;
  const name = String(a.studentName).localeCompare(String(b.studentName), "pt-BR");
  if (name !== 0) return name;
  return String(a.studentId).localeCompare(String(b.studentId), "pt-BR");
}

function hasAcknowledgedItem(acknowledgedItemIds, itemId) {
  if (acknowledgedItemIds instanceof Set) return acknowledgedItemIds.has(itemId);
  return Array.isArray(acknowledgedItemIds) && acknowledgedItemIds.includes(itemId);
}

function getWorkflowStateRank(workflowState) {
  return workflowState === COACH_WORKFLOW_ITEM_STATE.ACKNOWLEDGED ? 1 : 0;
}

function buildGroupedDescription(signals) {
  if (signals.length === 1) return signals[0].description;
  return signals.map((signal) => signal.title).join(" + ");
}

function resolveActionBaseTarget(destination, studentId) {
  if (destination === "treinos") return montarUrlContextualAluno("treinos", studentId, "origem=coach-attention");
  if (destination === "financeiro") return montarUrlContextualAluno("financeiro", studentId, "origem=coach-attention");
  if (destination === "alunos") return `/alunos?alunoId=${encodeURIComponent(studentId)}&origem=coach-attention`;
  return "";
}

function getDateValue(value) {
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}
