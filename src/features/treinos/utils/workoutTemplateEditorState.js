import {
  inferSplitFromWorkout,
  sanitizeWorkoutForTemplate,
  templateDataToWorkout,
} from "./workoutTemplateSanitization.js";

const emptyWorkout = {
  rotina: "",
  objetivo: "",
  nivel: "",
  dias: [],
};

export function createWorkoutTemplateEditorDraft({ treino, modelo } = {}) {
  const workout = modelo
    ? templateDataToWorkout(modelo, { rotina: modelo.nome || modelo.name || "" })
    : { ...emptyWorkout, ...(treino || {}) };

  return {
    metadata: {
      name: texto(workout.rotina || modelo?.nome || modelo?.name),
      referenceGender: texto(modelo?.genero || modelo?.referenceGender || "Unissex"),
      splitType: texto(modelo?.divisao || modelo?.splitType || inferSplitFromWorkout(workout)),
      objective: texto(workout.objetivo || modelo?.objetivo || modelo?.objective),
      level: texto(workout.nivel || modelo?.nivel || modelo?.level),
      description: texto(modelo?.descricao || modelo?.description),
    },
    workout: {
      ...workout,
      rotina: texto(workout.rotina || modelo?.nome || modelo?.name),
      objetivo: texto(workout.objetivo || modelo?.objetivo || modelo?.objective),
      nivel: texto(workout.nivel || modelo?.nivel || modelo?.level),
      dias: normalizeWorkoutDaysForEditor(workout.dias || []),
    },
  };
}

export function normalizeWorkoutTemplateDraft(draft) {
  const metadata = draft?.metadata || {};
  const workout = draft?.workout || {};

  return {
    metadata: {
      name: texto(metadata.name),
      referenceGender: texto(metadata.referenceGender || "Unissex"),
      splitType: texto(metadata.splitType || inferSplitFromWorkout(workout)),
      objective: texto(metadata.objective),
      level: texto(metadata.level),
      description: texto(metadata.description),
    },
    templateData: sanitizeWorkoutForTemplate({
      ...workout,
      rotina: metadata.name,
      objetivo: metadata.objective,
      nivel: metadata.level,
    }),
  };
}

export function areWorkoutTemplateDraftsEqual(left, right) {
  return stableStringify(normalizeWorkoutTemplateDraft(left)) === stableStringify(normalizeWorkoutTemplateDraft(right));
}

export function validateWorkoutTemplateDraft(draft) {
  const normalized = normalizeWorkoutTemplateDraft(draft);
  const errors = {};

  if (!normalized.metadata.name) errors.name = "Informe o nome do modelo.";

  normalized.templateData.days.forEach((day, dayIndex) => {
    day.exercises.forEach((exercise, exerciseIndex) => {
      const prefix = `day-${dayIndex}-exercise-${exerciseIndex}`;
      if (!exercise.name) errors[`${prefix}-name`] = "Informe o nome do exercício.";
      if (exercise.sets && !isPositiveNumberLike(exercise.sets)) {
        errors[`${prefix}-sets`] = "Informe séries com valor válido.";
      }
      if (exercise.rest && isNegativeNumberLike(exercise.rest)) {
        errors[`${prefix}-rest`] = "Descanso não pode ser negativo.";
      }
    });
  });

  const totalExercises = normalized.templateData.days.reduce(
    (total, day) => total + day.exercises.length,
    0
  );
  if (totalExercises === 0) errors.exercises = "Inclua pelo menos um exercício.";

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    normalized,
  };
}

export function normalizeWorkoutDaysForEditor(days) {
  return (days || []).map((day) => ({
    id: day.id || crypto.randomUUID(),
    nome: texto(day.nome),
    descricao: texto(day.descricao),
    exercicios: (day.exercicios || []).map((exercise) => ({
      id: exercise.id || crypto.randomUUID(),
      nome: texto(exercise.nome),
      series: texto(exercise.series),
      repeticoes: texto(exercise.repeticoes),
      carga: texto(exercise.carga),
      descanso: texto(exercise.descanso),
      observacoes: texto(exercise.observacoes),
      video: texto(exercise.video),
    })),
  }));
}

function texto(value) {
  return String(value || "").trim();
}

function isPositiveNumberLike(value) {
  const normalized = String(value).replace(",", ".").trim();
  const number = Number(normalized);
  return Number.isFinite(number) && number > 0;
}

function isNegativeNumberLike(value) {
  const match = String(value).trim().match(/^-?\d+(?:[,.]\d+)?/);
  if (!match) return false;
  return Number(match[0].replace(",", ".")) < 0;
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (!value || typeof value !== "object") return JSON.stringify(value);
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
}
