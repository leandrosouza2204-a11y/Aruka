import { criarModeloTreino } from "../../../data/treinosModelos.js";
import {
  assertTemplateDataIsSanitized,
  canonicalTemplateToPreviewDays,
  canonicalTemplateToWorkout,
  countTemplateExercises,
  inferSplitFromWorkout,
  normalizeCanonicalTemplateData,
  validateCanonicalTemplateData,
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
    objective: text(template?.objetivo || template?.objective) || "Nao informado",
    level: text(template?.nivel || template?.level) || "Nao informado",
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
      ? "Contrato canonico normalizado e sem campos visuais ou dados de aluno."
      : `Campos proibidos removidos ou rejeitados: ${sanitized.forbiddenPaths.join(", ")}.`,
    validation,
    warnings,
  };
}

export function prepareWorkoutTemplateApplicationPayload({ template, student, options = {} } = {}) {
  const canonicalTemplateData = normalizeTemplateForApplication(template);
  const validation = validateWorkoutTemplateApplication({
    template,
    student,
    canonicalTemplateData,
  });

  if (!validation.ok) {
    throw new Error(validation.errors[0] || "Nao foi possivel aplicar o modelo.");
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
  };
}

export function validateWorkoutTemplateApplication({ template, student, canonicalTemplateData } = {}) {
  const errors = [];
  const data = canonicalTemplateData || normalizeTemplateForApplication(template);

  if (!template) errors.push("Selecione um modelo de treino.");
  if (!student?.id) errors.push("Selecione um aluno valido.");
  if (!data.days.length) errors.push("O modelo precisa ter ao menos um dia.");
  if (!validateCanonicalTemplateData(data)) {
    errors.push("O modelo precisa ter dias e exercicios validos.");
  }

  const sanitization = assertTemplateDataIsSanitized(data);
  if (!sanitization.ok) {
    errors.push("O modelo contem campos que nao pertencem ao contrato de treino.");
  }

  return {
    ok: errors.length === 0,
    errors: [...new Set(errors)],
  };
}

export function mapWorkoutTemplateApplicationError(error) {
  const message = text(error?.message);
  if (!message) return "Nao foi possivel aplicar o modelo. Tente novamente.";
  if (message.toLowerCase().includes("network")) {
    return "Nao foi possivel conectar ao servidor. Verifique a conexao e tente novamente.";
  }
  if (message.toLowerCase().includes("aluno")) return message;
  if (message.toLowerCase().includes("modelo")) return message;
  return "Nao foi possivel criar o treino pelo modelo. Tente novamente em instantes.";
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
  if (!student?.id) warnings.push("Aluno ainda nao selecionado.");
  if (!text(template?.descricao || template?.description)) warnings.push("Modelo sem descricao.");
  if (!days.length) warnings.push("Modelo sem dias validos.");
  if (days.some((day) => !day.exercicios.length)) warnings.push("Ha dias sem exercicios validos.");
  if (!sanitized.ok) warnings.push("A normalizacao encontrou campos fora do contrato.");
  validation.errors.forEach((error) => warnings.push(error));
  return [...new Set(warnings)];
}

function formatStudentLabel(student) {
  if (!student?.id) return "Aluno nao selecionado";
  return `${student.nome || "Aluno sem nome"} (${student.id})`;
}

function text(value) {
  return String(value || "").trim();
}
