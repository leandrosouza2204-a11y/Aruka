import { criarModeloTreino } from "../../../data/treinosModelos.js";
import {
  assertTemplateDataIsSanitized,
  canonicalTemplateToPreviewDays,
  canonicalTemplateToWorkout,
  countTemplateExercises,
  inferSplitFromWorkout,
  normalizeCanonicalTemplateData,
  validateCanonicalTemplateData,
  WORKOUT_LIFECYCLE_STATUS,
  WORKOUT_STATUS,
  WORKOUT_TEMPLATE_ORIGIN_TYPE,
  workoutToCanonicalTemplateData,
} from "./workoutDataContract.js";

export const WORKOUT_TEMPLATE_APPLICATION_STATES = [
  "selectingTemplate",
  "selectingStudent",
  "previewing",
  "submitting",
  "success",
  "error",
];

export function buildWorkoutTemplateApplicationPreview({ template, student, options = {} } = {}) {
  const canonicalTemplateData = normalizeTemplateForApplication(template);
  const days = canonicalTemplateToPreviewDays(canonicalTemplateData);
  const sanitized = assertTemplateDataIsSanitized(canonicalTemplateData);
  const validation = validateWorkoutTemplateApplication({
    template,
    student,
    canonicalTemplateData,
  });
  const warnings = buildPreviewWarnings({ template, student, days, sanitized, validation });

  return {
    templateId: text(template?.id),
    templateName: text(template?.nome || template?.name) || "Modelo sem nome",
    templateOrigin: template?.isSystem ? "official" : "personal",
    templateOriginLabel: template?.isSystem ? "Oficial" : "Meu modelo",
    studentId: text(student?.id),
    studentName: text(student?.nome || student?.name),
    studentLabel: formatStudentLabel(student),
    workoutName: text(options.rotina) || text(template?.nome || template?.name) || "Treino por modelo",
    startDate: text(options.dataInicio),
    objective: text(template?.objetivo || template?.objective) || "Não informado",
    level: text(template?.nivel || template?.level) || "Não informado",
    split: text(template?.divisao || template?.splitType) || inferSplitFromWorkout({ dias: days }),
    dayCount: days.length,
    exerciseCount: countTemplateExercises(canonicalTemplateData),
    days,
    mainExercises: days
      .flatMap((day) => day.exercicios.map((exercise) => exercise.nome))
      .filter(Boolean)
      .slice(0, 8),
    sanitized: sanitized.ok,
    sanitizedDetails: sanitized.ok
      ? "Contrato canônico normalizado e sem campos visuais ou dados de aluno."
      : `Campos proibidos removidos ou rejeitados: ${sanitized.forbiddenPaths.join(", ")}.`,
    validation,
    warnings,
  };
}

export function prepareWorkoutTemplateApplicationPayload({ template, student, options = {} } = {}) {
  const intent = options.intent || createWorkoutTemplateApplicationIntent({
    template,
    student,
    options,
  });
  const canonicalTemplateData = normalizeTemplateForApplication(template);
  const validation = validateWorkoutTemplateApplication({
    template,
    student,
    canonicalTemplateData,
  });

  if (!validation.ok) {
    throw new Error(validation.errors[0] || "Não foi possível aplicar o modelo.");
  }

  const workout = canonicalTemplateToWorkout(
    {
      ...template,
      templateData: canonicalTemplateData,
    },
    {
      alunoId: student.id,
      rotina: text(options.rotina) || text(template?.nome || template?.name),
      dataInicio: text(options.dataInicio),
    }
  );

  return {
    ...workout,
    alunoId: student.id,
    aluno: student.nome || "",
    nomeAluno: student.nome || "",
    status: WORKOUT_STATUS.IN_REVIEW,
    lifecycleStatus: WORKOUT_LIFECYCLE_STATUS.DRAFT,
    templateOriginId: intent.templateOriginId,
    templateOriginType: intent.templateOriginType,
    templateOriginName: intent.templateOriginName,
    templateOriginSnapshot: intent.templateOriginSnapshot,
    applicationIdempotencyKey: intent.applicationIdempotencyKey,
  };
}

export function createWorkoutTemplateApplicationIntent({
  template,
  student,
  options = {},
  applicationIdempotencyKey,
} = {}) {
  const originType = template?.isSystem
    ? WORKOUT_TEMPLATE_ORIGIN_TYPE.OFFICIAL
    : WORKOUT_TEMPLATE_ORIGIN_TYPE.PERSONAL;
  const templateId = text(template?.id);
  const templateName = text(template?.nome || template?.name) || "Modelo sem nome";
  const studentId = text(student?.id);
  const workoutName = text(options.rotina) || templateName || "Treino por modelo";
  const idempotencyKey =
    text(applicationIdempotencyKey) ||
    createApplicationIdempotencyKey({ templateId, studentId, workoutName });

  return {
    applicationIdempotencyKey: idempotencyKey,
    templateOriginId: templateId,
    templateOriginType: originType,
    templateOriginName: templateName,
    templateOriginSnapshot: buildTemplateOriginSnapshot(template),
  };
}

export function getOrCreateWorkoutTemplateApplicationIntent(controller, input = {}) {
  if (controller?.intent) return controller.intent;
  const intent = createWorkoutTemplateApplicationIntent(input);
  if (controller) controller.intent = intent;
  return intent;
}

export function validateWorkoutTemplateApplication({ template, student, canonicalTemplateData } = {}) {
  const errors = [];
  const data = canonicalTemplateData || normalizeTemplateForApplication(template);

  if (!template) errors.push("Selecione um modelo de treino.");
  if (!student?.id) errors.push("Selecione um aluno válido.");
  if (!data.days.length) errors.push("O modelo precisa ter ao menos um dia.");
  if (!validateCanonicalTemplateData(data)) {
    errors.push("O modelo precisa ter dias e exercícios válidos.");
  }

  const sanitization = assertTemplateDataIsSanitized(data);
  if (!sanitization.ok) {
    errors.push("O modelo contém campos que não pertencem ao contrato de treino.");
  }

  return {
    ok: errors.length === 0,
    errors: [...new Set(errors)],
  };
}

export function mapWorkoutTemplateApplicationError(error) {
  const message = text(error?.message);
  if (!message) return "Não foi possível aplicar o modelo. Tente novamente.";
  if (message.toLowerCase().includes("network")) {
    return "Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.";
  }
  if (message.toLowerCase().includes("aluno")) return message;
  if (message.toLowerCase().includes("modelo")) return message;
  return "Não foi possível criar o treino pelo modelo. Tente novamente em instantes.";
}

export async function submitWorkoutTemplateApplicationOnce(controller, submit) {
  if (controller?.active || controller?.result) return controller?.result || null;
  controller.active = true;
  controller.result = Promise.resolve().then(submit);

  try {
    return await controller.result;
  } finally {
    controller.active = false;
  }
}

export function normalizeTemplateForApplication(template) {
  if (!template) return normalizeCanonicalTemplateData({});
  if (template.templateData || template.template_data) return normalizeCanonicalTemplateData(template);
  if (Array.isArray(template.dias)) return workoutToCanonicalTemplateData(template);

  const generated = criarModeloTreino(template.id || template.divisao || template);
  return workoutToCanonicalTemplateData(generated);
}

function buildPreviewWarnings({ template, student, days, sanitized, validation }) {
  const warnings = [];
  if (!student?.id) warnings.push("Aluno ainda não selecionado.");
  if (!text(template?.descricao || template?.description)) warnings.push("Modelo sem descrição.");
  if (!days.length) warnings.push("Modelo sem dias válidos.");
  if (days.some((day) => !day.exercicios.length)) warnings.push("Há dias sem exercícios válidos.");
  if (!sanitized.ok) warnings.push("A normalização encontrou campos fora do contrato.");
  validation.errors.forEach((error) => warnings.push(error));
  return [...new Set(warnings)];
}

function formatStudentLabel(student) {
  if (!student?.id) return "Aluno não selecionado";
  return `${student.nome || "Aluno sem nome"} (${student.id})`;
}

function buildTemplateOriginSnapshot(template) {
  if (!template || typeof template !== "object") return null;

  return {
    id: text(template.id),
    name: text(template.nome || template.name),
    originType: template.isSystem
      ? WORKOUT_TEMPLATE_ORIGIN_TYPE.OFFICIAL
      : WORKOUT_TEMPLATE_ORIGIN_TYPE.PERSONAL,
    objective: text(template.objetivo || template.objective),
    level: text(template.nivel || template.level),
    split: text(template.divisao || template.splitType),
    schemaVersion: Number(template.templateData?.schemaVersion || template.template_data?.schemaVersion || 1),
    dayCount: normalizeTemplateForApplication(template).days.length,
  };
}

function createApplicationIdempotencyKey({ templateId, studentId, workoutName }) {
  const randomPart =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  const parts = ["workout-template-application", studentId, templateId, workoutName, randomPart]
    .map((part) => text(part).replace(/\s+/g, "-").toLowerCase())
    .filter(Boolean);
  return parts.join(":").slice(0, 160);
}

function text(value) {
  return String(value || "").trim();
}
