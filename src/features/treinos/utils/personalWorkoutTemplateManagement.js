import {
  DIVISOES_MODELO_PESSOAL,
  GENEROS_REFERENCIA_MODELO,
  countTemplateExercises,
  inferSplitFromWorkout,
  sanitizeWorkoutForTemplate,
  templateDataToPreviewDays,
  templateDataToWorkout,
  validateTemplateData,
} from "./workoutTemplateSanitization.js";

export const PERSONAL_TEMPLATE_MODES = {
  CREATE: "create",
  CREATE_FROM_WORKOUT: "createFromWorkout",
  EDIT: "edit",
  DUPLICATE_OFFICIAL: "duplicateOfficial",
  DUPLICATE_PERSONAL: "duplicatePersonal",
};

export const PERSONAL_TEMPLATE_STEPS = {
  IDLE: "idle",
  EDITING_METADATA: "editingMetadata",
  EDITING_STRUCTURE: "editingStructure",
  PREVIEWING: "previewing",
  SUBMITTING: "submitting",
  SUCCESS: "success",
  ERROR: "error",
};

const VALID_LEVELS = new Set(["", "Iniciante", "Intermediario", "Avancado"]);
const VALID_SPLITS = new Set(DIVISOES_MODELO_PESSOAL);
const VALID_GENDERS = new Set(GENEROS_REFERENCIA_MODELO);
const MAX_NAME_LENGTH = 90;

export function createEmptyPersonalWorkoutTemplateDraft() {
  return {
    metadata: {
      name: "",
      referenceGender: "Unissex",
      splitType: "Outro",
      objective: "",
      level: "",
      description: "",
    },
    workout: {
      rotina: "",
      objetivo: "",
      nivel: "",
      dias: [],
    },
  };
}

export function preparePersonalTemplateDraft({
  mode = PERSONAL_TEMPLATE_MODES.CREATE,
  workout,
  template,
  currentUserId = "",
  name,
} = {}) {
  if (mode === PERSONAL_TEMPLATE_MODES.CREATE) {
    return clone(createEmptyPersonalWorkoutTemplateDraft());
  }

  if (mode === PERSONAL_TEMPLATE_MODES.CREATE_FROM_WORKOUT) {
    return workoutToTemplateDraft(workout, { name: name || workout?.rotina || "" });
  }

  if (mode === PERSONAL_TEMPLATE_MODES.EDIT) {
    assertEditablePersonalTemplate(template, currentUserId);
    return templateToDraft(template, { name: name || template?.nome || template?.name || "" });
  }

  if (mode === PERSONAL_TEMPLATE_MODES.DUPLICATE_OFFICIAL) {
    if (!isOfficialTemplate(template)) {
      throw new Error("Apenas modelos oficiais podem usar este fluxo de duplicacao.");
    }
    return templateToDraft(template, { name: name || `Copia de ${template?.nome || template?.name || "modelo"}` });
  }

  if (mode === PERSONAL_TEMPLATE_MODES.DUPLICATE_PERSONAL) {
    if (isOfficialTemplate(template)) {
      throw new Error("Use o fluxo de copia oficial para modelos oficiais.");
    }
    return templateToDraft(template, { name: name || `Copia de ${template?.nome || template?.name || "modelo"}` });
  }

  throw new Error("Modo de gerenciamento de modelo invalido.");
}

export function buildPersonalTemplatePersistencePayload({
  mode = PERSONAL_TEMPLATE_MODES.CREATE,
  draft,
  originalTemplate,
  currentUserId = "",
} = {}) {
  if (mode === PERSONAL_TEMPLATE_MODES.EDIT) {
    assertEditablePersonalTemplate(originalTemplate, currentUserId);
  }

  const validation = validatePersonalTemplateDraft({ mode, draft, originalTemplate, currentUserId });
  if (!validation.ok) {
    const message = Object.values(validation.errors)[0] || "Revise os dados do modelo.";
    throw new Error(message);
  }

  const metadata = clone(validation.normalized.metadata);
  const templateData = clone(validation.normalized.templateData);

  return {
    id: mode === PERSONAL_TEMPLATE_MODES.EDIT ? originalTemplate.id : undefined,
    metadata,
    templateData,
    operation: mode,
    createsNewRecord: mode !== PERSONAL_TEMPLATE_MODES.EDIT,
  };
}

export function validatePersonalTemplateDraft({
  mode = PERSONAL_TEMPLATE_MODES.CREATE,
  draft,
  originalTemplate,
  currentUserId = "",
} = {}) {
  const normalized = normalizeDraft(draft);
  const errors = {};

  if (!normalized.metadata.name) errors.name = "Informe o nome do modelo.";
  if (normalized.metadata.name.length > MAX_NAME_LENGTH) {
    errors.name = `Use ate ${MAX_NAME_LENGTH} caracteres no nome.`;
  }
  if (!VALID_GENDERS.has(normalized.metadata.referenceGender)) {
    errors.referenceGender = "Selecione um genero de referencia valido.";
  }
  if (!VALID_SPLITS.has(normalized.metadata.splitType)) {
    errors.splitType = "Selecione uma divisao valida.";
  }
  if (!normalized.metadata.objective) errors.objective = "Informe o objetivo do modelo.";
  if (!VALID_LEVELS.has(normalized.metadata.level) || !normalized.metadata.level) {
    errors.level = "Selecione um nivel valido.";
  }
  if (!normalized.templateData.days.length) errors.days = "Inclua pelo menos um dia.";
  if (countTemplateExercises(normalized.templateData) === 0) {
    errors.exercises = "Inclua pelo menos um exercicio.";
  }
  if (!validateTemplateData(normalized.templateData)) {
    errors.structure = "Revise dias e exercicios antes de salvar.";
  }

  if (mode === PERSONAL_TEMPLATE_MODES.EDIT) {
    try {
      assertEditablePersonalTemplate(originalTemplate, currentUserId);
    } catch (error) {
      errors.ownership = mapPersonalTemplateManagementError(error);
    }
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    normalized,
  };
}

export function buildPersonalTemplatePreview({
  mode = PERSONAL_TEMPLATE_MODES.CREATE,
  draft,
  originalTemplate,
  currentUserId = "",
} = {}) {
  const validation = validatePersonalTemplateDraft({ mode, draft, originalTemplate, currentUserId });
  const templateData = validation.normalized.templateData;
  const days = templateDataToPreviewDays(templateData);
  const exerciseCount = countTemplateExercises(templateData);

  return {
    operation: mode,
    operationLabel: operationLabel(mode),
    createsNewRecord: mode !== PERSONAL_TEMPLATE_MODES.EDIT,
    name: validation.normalized.metadata.name,
    resultingOrigin: "personal",
    objective: validation.normalized.metadata.objective || "Sem objetivo",
    level: validation.normalized.metadata.level || "Sem nivel",
    split: validation.normalized.metadata.splitType || "Outro",
    dayCount: days.length,
    exerciseCount,
    days,
    mainExercises: days.flatMap((day) => day.exercicios.map((exercise) => exercise.nome)).slice(0, 6),
    warnings: Object.values(validation.errors),
    validation,
    changes:
      mode === PERSONAL_TEMPLATE_MODES.EDIT
        ? summarizeTemplateChanges(originalTemplate, validation.normalized)
        : [],
  };
}

export function createSubmissionGate() {
  return { activePromise: null };
}

export function submitPersonalTemplateOnce(gate, submitter) {
  if (gate.activePromise) return gate.activePromise;

  gate.activePromise = Promise.resolve()
    .then(submitter)
    .finally(() => {
      gate.activePromise = null;
    });

  return gate.activePromise;
}

export function assertEditablePersonalTemplate(template, currentUserId = "") {
  if (!template?.id) throw new Error("Modelo pessoal sem identificador valido.");
  if (isOfficialTemplate(template)) throw new Error("Modelos oficiais sao somente leitura.");
  const owner = template.ownerId || template.owner_id || template.userId || "";
  if (owner && currentUserId && owner !== currentUserId) {
    throw new Error("Este modelo pertence a outro usuario.");
  }
}

export function mapPersonalTemplateManagementError(error) {
  const message = String(error?.message || error || "");
  if (message.includes("somente leitura")) return "Modelos oficiais nao podem ser editados.";
  if (message.includes("outro usuario")) return "Você só pode editar seus próprios modelos.";
  if (message.includes("identificador")) return "Modelo pessoal invalido para edicao.";
  if (message.includes("dias") || message.includes("exercicio")) return message;
  return "Não foi possível salvar o modelo. Revise os dados e tente novamente.";
}

function normalizeDraft(draft) {
  const safeDraft = clone(draft || createEmptyPersonalWorkoutTemplateDraft());
  const metadata = safeDraft.metadata || {};
  const workout = safeDraft.workout || {};
  const normalizedMetadata = {
    name: text(metadata.name || workout.rotina),
    referenceGender: text(metadata.referenceGender || "Unissex"),
    splitType: text(metadata.splitType || inferSplitFromWorkout(workout)),
    objective: text(metadata.objective || workout.objetivo),
    level: text(metadata.level || workout.nivel),
    description: text(metadata.description),
  };

  const templateData = sanitizeWorkoutForTemplate({
    ...workout,
    rotina: normalizedMetadata.name,
    objetivo: normalizedMetadata.objective,
    nivel: normalizedMetadata.level,
  });

  return {
    metadata: normalizedMetadata,
    templateData,
    workout: clone({
      ...workout,
      rotina: normalizedMetadata.name,
      objetivo: normalizedMetadata.objective,
      nivel: normalizedMetadata.level,
    }),
  };
}

function workoutToTemplateDraft(workout, options = {}) {
  const safeWorkout = clone(workout || {});
  const metadata = {
    name: text(options.name || safeWorkout.rotina),
    referenceGender: "Unissex",
    splitType: inferSplitFromWorkout(safeWorkout),
    objective: text(safeWorkout.objetivo),
    level: text(safeWorkout.nivel),
    description: "",
  };

  return {
    metadata,
    workout: {
      rotina: metadata.name,
      objetivo: metadata.objective,
      nivel: metadata.level,
      dias: (safeWorkout.dias || []).map((day) => ({
        nome: text(day.nome),
        descricao: text(day.descricao),
        exercicios: (day.exercicios || []).map((exercise) => ({
          nome: text(exercise.nome),
          series: text(exercise.series),
          repeticoes: text(exercise.repeticoes),
          descanso: text(exercise.descanso),
          observacoes: text(exercise.observacoes),
          video: text(exercise.video),
        })),
      })),
    },
  };
}

function templateToDraft(template, options = {}) {
  const workout = templateDataToWorkout(template, { rotina: options.name || template?.nome || template?.name || "" });
  const metadata = {
    name: text(options.name || template?.nome || template?.name),
    referenceGender: text(template?.genero || template?.referenceGender || "Unissex"),
    splitType: text(template?.divisao || template?.splitType || inferSplitFromWorkout(workout)),
    objective: text(template?.objetivo || template?.objective || workout.objetivo),
    level: text(template?.nivel || template?.level || workout.nivel),
    description: text(template?.descricao || template?.description),
  };

  return {
    metadata,
    workout: {
      rotina: metadata.name,
      objetivo: metadata.objective,
      nivel: metadata.level,
      dias: clone(workout.dias || []),
    },
  };
}

function summarizeTemplateChanges(originalTemplate, normalized) {
  if (!originalTemplate) return [];
  const original = templateToDraft(originalTemplate);
  const changes = [];
  if (original.metadata.name !== normalized.metadata.name) changes.push("Nome alterado.");
  if (original.metadata.description !== normalized.metadata.description) changes.push("Descricao alterada.");
  const originalDays = original.workout.dias.length;
  const nextDays = normalized.templateData.days.length;
  if (originalDays !== nextDays) changes.push(`Dias: ${originalDays} -> ${nextDays}.`);
  const originalExercises = countTemplateExercises(sanitizeWorkoutForTemplate(original.workout));
  const nextExercises = countTemplateExercises(normalized.templateData);
  if (originalExercises !== nextExercises) {
    changes.push(`Exercicios: ${originalExercises} -> ${nextExercises}.`);
  }
  return changes;
}

function operationLabel(mode) {
  const labels = {
    [PERSONAL_TEMPLATE_MODES.CREATE]: "Criar modelo",
    [PERSONAL_TEMPLATE_MODES.CREATE_FROM_WORKOUT]: "Salvar treino como modelo",
    [PERSONAL_TEMPLATE_MODES.EDIT]: "Salvar alteracoes",
    [PERSONAL_TEMPLATE_MODES.DUPLICATE_OFFICIAL]: "Duplicar modelo oficial",
    [PERSONAL_TEMPLATE_MODES.DUPLICATE_PERSONAL]: "Duplicar modelo pessoal",
  };
  return labels[mode] || "Gerenciar modelo";
}

function isOfficialTemplate(template) {
  return Boolean(template?.isSystem || template?.origem === "official" || template?.origin === "official");
}

function text(value) {
  return String(value || "").trim();
}

function clone(value) {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}
