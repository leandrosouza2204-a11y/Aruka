export const WORKOUT_TEMPLATE_SCHEMA_VERSION = 1;

export const WORKOUT_STATUS = {
  ACTIVE: "Ativo",
  IN_REVIEW: "Em revisao",
  FINISHED: "Finalizado",
};

export const WORKOUT_STATUS_OPTIONS = [
  WORKOUT_STATUS.ACTIVE,
  WORKOUT_STATUS.IN_REVIEW,
  WORKOUT_STATUS.FINISHED,
];

const STATUS_ALIASES = new Map([
  ["ativo", WORKOUT_STATUS.ACTIVE],
  ["em revisao", WORKOUT_STATUS.IN_REVIEW],
  ["em revisão", WORKOUT_STATUS.IN_REVIEW],
  ["finalizado", WORKOUT_STATUS.FINISHED],
]);

const FORBIDDEN_TEMPLATE_FIELDS = new Set([
  "id",
  "userId",
  "user_id",
  "owner_id",
  "alunoId",
  "aluno_id",
  "aluno",
  "nomeAluno",
  "alunoWhatsapp",
  "status",
  "dataInicio",
  "data_inicio",
  "dataRevisao",
  "data_revisao",
  "createdAt",
  "created_at",
  "updatedAt",
  "updated_at",
  "templateId",
  "carga",
]);

export function normalizeWorkoutStatus(status, fallback = WORKOUT_STATUS.ACTIVE) {
  const normalized = text(status).toLowerCase();
  return STATUS_ALIASES.get(normalized) || fallback;
}

export function normalizeCanonicalTemplateData(input = {}) {
  const source = input.templateData || input.template_data || input;
  const rawDays = Array.isArray(source.days) ? source.days : [];

  return {
    schemaVersion: Number(source.schemaVersion || WORKOUT_TEMPLATE_SCHEMA_VERSION),
    source: text(source.source || "workout-editor"),
    days: rawDays
      .map((day, dayIndex) => ({
        name: text(day.name || day.nome),
        notes: text(day.notes || day.descricao),
        order: positiveInteger(day.order, dayIndex + 1),
        exercises: (Array.isArray(day.exercises) ? day.exercises : day.exercicios || [])
          .map((exercise, exerciseIndex) => ({
            name: text(exercise.name || exercise.nome),
            sets: text(exercise.sets || exercise.series),
            repetitions: text(exercise.repetitions || exercise.repeticoes),
            rest: text(exercise.rest || exercise.descanso),
            technique: text(exercise.technique || exercise.tecnica),
            notes: text(exercise.notes || exercise.observacoes),
            video: text(exercise.video || exercise.video_url),
            order: positiveInteger(exercise.order, exerciseIndex + 1),
          }))
          .filter((exercise) => exercise.name),
      }))
      .filter((day) => day.name || day.exercises.length > 0)
      .map((day, index) => ({ ...day, order: index + 1 })),
  };
}

export function workoutToCanonicalTemplateData(workout) {
  return normalizeCanonicalTemplateData({
    schemaVersion: WORKOUT_TEMPLATE_SCHEMA_VERSION,
    source: "workout-editor",
    days: (workout?.dias || []).map((day, dayIndex) => ({
      name: day.nome,
      notes: day.descricao,
      order: dayIndex + 1,
      exercises: (day.exercicios || []).map((exercise, exerciseIndex) => ({
        name: exercise.nome,
        sets: exercise.series,
        repetitions: exercise.repeticoes,
        rest: exercise.descanso,
        technique: exercise.tecnica || exercise.technique,
        notes: exercise.observacoes,
        video: exercise.video,
        order: exerciseIndex + 1,
      })),
    })),
  });
}

export function canonicalTemplateToWorkout(template, options = {}) {
  const data = normalizeCanonicalTemplateData(template);
  const days = data.days.map((day) => ({
    id: createId(),
    nome: day.name,
    descricao: day.notes,
    exercicios: day.exercises.map((exercise) => ({
      id: createId(),
      nome: exercise.name,
      series: exercise.sets,
      repeticoes: exercise.repetitions,
      carga: "",
      descanso: exercise.rest,
      observacoes: [exercise.notes, exercise.technique].filter(Boolean).join(" | "),
      video: exercise.video,
    })),
  }));

  return {
    alunoId: options.alunoId || "",
    aluno: "",
    rotina: options.rotina || template.nome || template.name || "Treino por modelo",
    objetivo: template.objetivo || template.objective || "",
    nivel: template.nivel || template.level || "",
    status: WORKOUT_STATUS.IN_REVIEW,
    dataInicio: options.dataInicio || "",
    dataRevisao: "",
    diasPorSemana: days.length,
    observacoes:
      "Modelo pessoal editavel. Ajuste o treino conforme objetivo, experiencia, disponibilidade e necessidades do aluno.",
    dias: days,
    templateId: template.id,
  };
}

export function canonicalTemplateToPreviewDays(templateData) {
  return normalizeCanonicalTemplateData(templateData).days.map((day) => ({
    id: `preview-${day.order || day.name}`,
    nome: day.name,
    descricao: day.notes,
    exercicios: day.exercises.map((exercise) => ({
      id: `preview-${day.order || day.name}-${exercise.order || exercise.name}`,
      nome: exercise.name,
      series: exercise.sets,
      repeticoes: exercise.repetitions,
      carga: "",
      descanso: exercise.rest,
      observacoes: [exercise.notes, exercise.technique].filter(Boolean).join(" | "),
      video: exercise.video,
    })),
  }));
}

export function validateCanonicalTemplateData(templateData) {
  const normalized = normalizeCanonicalTemplateData(templateData);
  if (!normalized.days.length) return false;

  return normalized.days.every(
    (day) =>
      day.name &&
      day.exercises.length > 0 &&
      day.exercises.every((exercise) => exercise.name)
  );
}

export function assertTemplateDataIsSanitized(templateData) {
  const found = [];

  function walk(value, path = "") {
    if (!value || typeof value !== "object") return;

    Object.entries(value).forEach(([key, content]) => {
      const current = path ? `${path}.${key}` : key;
      if (FORBIDDEN_TEMPLATE_FIELDS.has(key)) found.push(current);
      if (content && typeof content === "object") walk(content, current);
    });
  }

  walk(templateData);
  return { ok: found.length === 0, forbiddenPaths: found };
}

export function countTemplateExercises(templateData) {
  return normalizeCanonicalTemplateData(templateData).days.reduce(
    (total, day) => total + day.exercises.length,
    0
  );
}

export function inferSplitFromWorkout(workout) {
  const totalDays = Number(workout?.dias?.length || 0);
  if (totalDays === 3) return "ABC";
  if (totalDays === 4) return "ABCD";
  if (totalDays === 5) return "ABCDE";
  if (totalDays === 2) return "Upper/Lower";
  if (totalDays === 1) return "Full Body";
  return "Outro";
}

export function workoutToPersistencePayload(workout) {
  const days = (workout?.dias || []).map((day, dayIndex) => ({
    nome: text(day.nome),
    descricao: text(day.descricao),
    ordem: dayIndex + 1,
    exercicios: (day.exercicios || []).map((exercise, exerciseIndex) => ({
      nome: text(exercise.nome),
      series: text(exercise.series),
      repeticoes: text(exercise.repeticoes),
      carga: text(exercise.carga),
      descanso: text(exercise.descanso),
      observacoes: text(exercise.observacoes),
      video: text(exercise.video),
      ordem: exerciseIndex + 1,
    })),
  }));

  return {
    id: workout?.id || null,
    alunoId: text(workout?.alunoId),
    rotina: text(workout?.rotina),
    objetivo: text(workout?.objetivo),
    nivel: text(workout?.nivel),
    diasPorSemana: Number(workout?.diasPorSemana || days.length || 0),
    observacoes: text(workout?.observacoes),
    status: normalizeWorkoutStatus(workout?.status),
    dataInicio: workout?.dataInicio || null,
    dataRevisao: workout?.dataRevisao || null,
    dias: days,
  };
}

export function duplicateWorkoutDraft(workout) {
  return {
    ...JSON.parse(JSON.stringify(workout)),
    id: undefined,
    rotina: `${workout.rotina || "Treino"} - Copia`,
    status: WORKOUT_STATUS.IN_REVIEW,
    alunoId: workout.alunoId,
    dias: (workout.dias || []).map((day) => ({
      ...day,
      id: undefined,
      exercicios: (day.exercicios || []).map((exercise) => ({
        ...exercise,
        id: undefined,
      })),
    })),
  };
}

function text(value) {
  return String(value || "").trim();
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function createId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `tmp-${Math.random().toString(36).slice(2)}`;
}
