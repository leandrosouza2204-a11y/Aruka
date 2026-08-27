import {
  getStudentBlockedState,
  normalizeStudentAccessState,
} from "../../studentAccess/utils/studentAccessLifecycle.js";
import {
  HISTORY_QUALITY,
  STUDENT_PROGRESSION_STATUS,
  buildStudentProgressionSnapshot,
} from "../../alunos/utils/studentProgressionSnapshot.js";

export const STUDENT_DAILY_STATE = Object.freeze({
  UNLINKED_STUDENT: "UNLINKED_STUDENT",
  ACCESS_BLOCKED: "ACCESS_BLOCKED",
  NO_ACTIVE_WORKOUT: "NO_ACTIVE_WORKOUT",
  ACTIVE_WORKOUT: "ACTIVE_WORKOUT",
});

export const STUDENT_DAILY_NEXT_ACTION = Object.freeze({
  ACTIVE_WORKOUT: "ACTIVE_WORKOUT",
  REVIEW_CONTEXT: "REVIEW_CONTEXT",
  NO_ACTIVE_WORKOUT: "NO_ACTIVE_WORKOUT",
  NO_WORKOUT_HISTORY: "NO_WORKOUT_HISTORY",
  PARTIAL_DATA: "PARTIAL_DATA",
});

export function buildStudentDailyExperience(payload = {}, options = {}) {
  const student = payload?.student || null;
  const studentAccess = normalizeStudentAccessState(payload?.studentAccess || {});
  const blockedState = getStudentBlockedState({ studentAccess });
  const activeWorkouts = normalizeWorkouts(payload?.activeWorkouts || []);
  const completedWorkouts = normalizeWorkouts(payload?.completedWorkouts || []);
  const allWorkouts = [...activeWorkouts, ...completedWorkouts];
  const activeWorkout = orderForStudentDaily(activeWorkouts)[0] || null;
  const history = orderForStudentDaily(completedWorkouts).slice(0, 4);
  const progression = buildStudentProgressionSnapshot(allWorkouts, { now: options.now });
  const progressionSummary = buildProgressionSummary(progression);
  const nextAction = buildNextAction({ student, activeWorkout, allWorkouts, progression });

  return {
    state: !student
      ? STUDENT_DAILY_STATE.UNLINKED_STUDENT
      : blockedState.blocked
        ? STUDENT_DAILY_STATE.ACCESS_BLOCKED
        : activeWorkout
        ? STUDENT_DAILY_STATE.ACTIVE_WORKOUT
        : STUDENT_DAILY_STATE.NO_ACTIVE_WORKOUT,
    student: student ? { name: student.name || "Aluno" } : null,
    studentAccess,
    blockedState,
    activeWorkout: activeWorkout ? toActiveWorkoutView(activeWorkout) : null,
    nextAction,
    history: history.map(toHistoryItem),
    historyStatus: history.length ? "HISTORY_AVAILABLE" : "NO_HISTORY",
    progression: progressionSummary,
    assessment: {
      status: "NO_ASSESSMENT_HISTORY",
      title: "Avaliações",
      text: "As avaliações ainda não estão disponíveis nesta área do aluno.",
    },
  };
}

export function normalizeStudentWorkoutPayload(payload = {}) {
  return {
    student: payload?.student
      ? {
          id: payload.student.id || "",
          name: payload.student.name || payload.student.nome || "",
          status: payload.student.status || "",
        }
      : null,
    activeWorkouts: normalizeWorkouts(payload?.activeWorkouts || payload?.active_workouts || []),
    completedWorkouts: normalizeWorkouts(payload?.completedWorkouts || payload?.completed_workouts || []),
    studentAccess: normalizeStudentAccessState(payload?.studentAccess || payload?.student_access || {}),
  };
}

function buildNextAction({ student, activeWorkout, allWorkouts, progression }) {
  if (!student) {
    return {
      type: STUDENT_DAILY_NEXT_ACTION.NO_ACTIVE_WORKOUT,
      title: "Perfil não vinculado",
      text: "Não encontramos um perfil de aluno vinculado a esta conta.",
    };
  }

  if (!allWorkouts.length) {
    return {
      type: STUDENT_DAILY_NEXT_ACTION.NO_WORKOUT_HISTORY,
      title: "Sem ficha disponível",
      text: "Seu profissional poderá disponibilizar uma ficha para consulta.",
    };
  }

  if (!activeWorkout) {
    return {
      type: STUDENT_DAILY_NEXT_ACTION.NO_ACTIVE_WORKOUT,
      title: "Sem treino ativo",
      text: "Você ainda não possui um treino ativo para consulta.",
    };
  }

  if (hasReviewContext(activeWorkout)) {
    return {
      type: STUDENT_DAILY_NEXT_ACTION.REVIEW_CONTEXT,
      title: "Revisão prevista",
      text: `Esta ficha possui revisão prevista para ${formatDate(activeWorkout.dataRevisao)}.`,
    };
  }

  if (progression.historyQuality === HISTORY_QUALITY.PARTIAL) {
    return {
      type: STUDENT_DAILY_NEXT_ACTION.PARTIAL_DATA,
      title: "Histórico parcial",
      text: "Alguns dados da comparação entre fichas ainda são parciais.",
    };
  }

  return {
    type: STUDENT_DAILY_NEXT_ACTION.ACTIVE_WORKOUT,
    title: "Treino disponível",
    text: "Seu treino atual está disponível para consulta.",
  };
}

function buildProgressionSummary(snapshot) {
  if (!snapshot || snapshot.status === STUDENT_PROGRESSION_STATUS.INSUFFICIENT_DATA) {
    return {
      status: "NO_COMPARISON",
      title: "Evolução da prescrição",
      text: "Ainda não há fichas comparáveis suficientes.",
      items: [],
    };
  }

  const items = [];
  if (snapshot.progressionCount > 0) {
    items.push(`${snapshot.progressionCount} exercício(s) com ajuste de carga ou repetições prescritas.`);
  }
  if (snapshot.stableCount > 0) {
    items.push(`${snapshot.stableCount} exercício(s) mantiveram prescrição comparável.`);
  }
  if (snapshot.partialCount > 0 || snapshot.newExerciseCount > 0) {
    items.push("Há exercícios novos ou dados textuais que deixam a comparação parcial.");
  }

  return {
    status: snapshot.status === STUDENT_PROGRESSION_STATUS.PARTIAL_HISTORY ? "PARTIAL_PROGRESSION" : "READY",
    title: "Evolução da prescrição",
    text: "Comparação conservadora entre fichas prescritas, sem representar execução do treino.",
    items: items.slice(0, 3),
  };
}

function toActiveWorkoutView(workout) {
  return {
    id: workout.id || "",
    title: workout.rotina || "Treino atual",
    objective: formatObjectiveForDisplay(workout.objetivo),
    period: formatPeriod(workout),
    daysText: formatDaysText(workout),
    statusText: "Ativo para consulta",
    reviewText: workout.dataRevisao
      ? `Revisão prevista: ${formatDate(workout.dataRevisao)}`
      : "Sem revisão prevista cadastrada.",
    days: workout.dias.map((day) => ({
      id: day.id || "",
      name: day.nome || "Dia de treino",
      notes: day.descricao || "",
      exercises: day.exercicios.map((exercise) => ({
        id: exercise.id || "",
        name: exercise.nome || "Exercício",
        prescription: compactJoin([
          exercise.series ? `${exercise.series} séries` : "",
          exercise.repeticoes ? `${exercise.repeticoes} repetições` : "",
          exercise.carga ? `carga prescrita: ${exercise.carga}` : "",
          exercise.descanso ? `descanso: ${exercise.descanso}` : "",
        ]),
      })),
    })),
  };
}

function toHistoryItem(workout) {
  return {
    title: workout.rotina || "Ficha anterior",
    statusText: "Ficha anterior",
    period: formatPeriod(workout),
    completedText: workout.completedAt
      ? `Registrada como concluída em ${formatDate(workout.completedAt)}`
      : "Histórico de ficha disponível.",
  };
}

function normalizeWorkouts(workouts = []) {
  return (Array.isArray(workouts) ? workouts : []).map((workout) => ({
    id: workout.id || "",
    rotina: workout.rotina || workout.name || workout.nome_rotina || "",
    objetivo: workout.objetivo || workout.objective || "",
    nivel: workout.nivel || workout.level || "",
    diasPorSemana: workout.diasPorSemana || workout.daysPerWeek || workout.dias_semana || "",
    lifecycleStatus: workout.lifecycleStatus || workout.lifecycle_status || "",
    deliveredAt: workout.deliveredAt || workout.delivered_at || "",
    completedAt: workout.completedAt || workout.completed_at || "",
    dataInicio: workout.dataInicio || workout.data_inicio || workout.deliveredAt || workout.delivered_at || "",
    dataRevisao: workout.dataRevisao || workout.data_revisao || "",
    createdAt: workout.createdAt || workout.created_at || "",
    dias: normalizeDays(workout.dias || workout.days || []),
  }));
}

function normalizeDays(days = []) {
  return (Array.isArray(days) ? days : []).map((day) => ({
    id: day.id || "",
    nome: day.nome || day.name || "",
    descricao: day.descricao || day.notes || "",
    exercicios: (day.exercicios || day.exercises || []).map((exercise) => ({
      id: exercise.id || "",
      nome: exercise.nome || exercise.name || "",
      series: exercise.series || "",
      repeticoes: exercise.repeticoes || exercise.repetitions || "",
      carga: exercise.carga || exercise.prescribedLoad || "",
      descanso: exercise.descanso || exercise.rest || "",
    })),
  }));
}

function orderForStudentDaily(workouts = []) {
  return [...workouts].sort((a, b) => getWorkoutTime(b) - getWorkoutTime(a));
}

function getWorkoutTime(workout) {
  return (
    normalizeDate(workout.deliveredAt) ||
    normalizeDate(workout.completedAt) ||
    normalizeDate(workout.dataInicio) ||
    normalizeDate(workout.createdAt) ||
    new Date(0)
  ).getTime();
}

function hasReviewContext(workout) {
  return Boolean(workout?.dataRevisao);
}

function formatPeriod(workout) {
  const start = workout.dataInicio || workout.deliveredAt;
  const end = workout.completedAt;
  if (start && end) return `${formatDate(start)} até ${formatDate(end)}`;
  if (start) return `Desde ${formatDate(start)}`;
  if (end) return `Até ${formatDate(end)}`;
  return "Período não informado";
}

function formatDaysText(workout) {
  const daysPerWeek = Number(workout.diasPorSemana || 0);
  if (daysPerWeek > 0) return pluralizePt(daysPerWeek, "dia por semana", "dias por semana");
  const days = workout.dias?.length || 0;
  return days > 0 ? pluralizePt(days, "dia na ficha", "dias na ficha") : "Dias não informados";
}

function formatObjectiveForDisplay(value) {
  const normalized = String(value || "").trim();
  const labels = {
    Forca: "Força",
    Resistencia: "Resistência",
    Reabilitacao: "Reabilitação",
  };
  return labels[normalized] || normalized || "Objetivo não informado";
}

function formatDate(value) {
  const date = normalizeDate(value);
  if (!date) return "data não informada";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
}

function normalizeDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function compactJoin(parts) {
  return parts.filter(Boolean).join(" · ") || "Prescrição não informada";
}

function pluralizePt(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}
