import { formatMoney, parseBrazilianNumber } from "./transferRules.js";

export const SERVICE_TYPE_LABELS = Object.freeze({
  personal_training: "Personal presencial",
  online_coaching: "Consultoria online",
  assessment: "Avaliação física",
  other: "Outro serviço",
});

export const PRICING_MODEL_LABELS = Object.freeze({
  PER_SESSION: "Por sessão",
  PER_STUDENT_SESSION: "Por aluno/sessão",
  MONTHLY_PACKAGE: "Pacote mensal",
  FIXED_PACKAGE: "Pacote fechado",
});

export function formatServicePrice(service) {
  const price = formatMoney(service.price);
  if (service.pricingModel === "PER_SESSION") return `${price} por sessão`;
  if (service.pricingModel === "PER_STUDENT_SESSION") return `${price} por aluno/sessão`;
  if (service.pricingModel === "FIXED_PACKAGE") return `${price} por pacote`;
  return `${price}/mês`;
}

export function buildServiceSummary(service) {
  const parts = [];
  if (service.sessionsPerWeek) parts.push(`${service.sessionsPerWeek}x por semana`);
  if (service.sessionsPerMonth) parts.push(`${service.sessionsPerMonth} sessões/mês`);
  if (service.sessionsInPackage) parts.push(`${service.sessionsInPackage} sessões`);
  if (service.sessionDurationMinutes) parts.push(`${service.sessionDurationMinutes} min`);
  parts.push(formatStudentCapacity(service.minStudents, service.maxStudents));
  return parts.join(" · ");
}

export function formatStudentCapacity(minStudents = 1, maxStudents = null) {
  if (minStudents === 1 && maxStudents === 1) return "1 aluno";
  if (minStudents === maxStudents) return `${minStudents} alunos`;
  if (!maxStudents) return `${minStudents} ou mais alunos`;
  return `${minStudents} a ${maxStudents} alunos`;
}

export function validateServiceForm(form) {
  const errors = [];
  const price = parseBrazilianNumber(form.priceInput);
  const values = {
    id: form.id || null,
    name: String(form.name || "").trim(),
    description: String(form.description || "").trim(),
    serviceType: form.serviceType,
    pricingModel: form.pricingModel,
    price,
    sessionsPerWeek: parseOptionalInteger(form.sessionsPerWeek),
    sessionsPerMonth: parseOptionalInteger(form.sessionsPerMonth),
    sessionsInPackage: form.pricingModel === "FIXED_PACKAGE" ? parseOptionalInteger(form.sessionsInPackage) : null,
    sessionDurationMinutes: parseOptionalInteger(form.sessionDurationMinutes),
    minStudents: parseOptionalInteger(form.minStudents),
    maxStudents: parseOptionalInteger(form.maxStudents),
  };

  if (!values.name) errors.push("Informe o nome do serviço.");
  if (!Object.hasOwn(SERVICE_TYPE_LABELS, values.serviceType)) errors.push("Selecione um tipo de serviço válido.");
  if (!Object.hasOwn(PRICING_MODEL_LABELS, values.pricingModel)) errors.push("Selecione um modelo de preço válido.");
  if (values.price === null || values.price < 0) errors.push("Informe um preço válido.");
  if (!Number.isInteger(values.minStudents) || values.minStudents < 1) errors.push("Informe o mínimo de alunos.");
  if (values.maxStudents !== null && values.maxStudents < values.minStudents) errors.push("O máximo de alunos deve ser maior ou igual ao mínimo.");
  if (values.pricingModel === "FIXED_PACKAGE" && (!Number.isInteger(values.sessionsInPackage) || values.sessionsInPackage < 1)) errors.push("Informe a quantidade de sessões do pacote.");
  for (const [value, label] of [
    [values.sessionsPerWeek, "frequência semanal"],
    [values.sessionsPerMonth, "sessões por mês"],
    [values.sessionDurationMinutes, "duração da sessão"],
  ]) {
    if (value !== null && value < 1) errors.push(`Informe ${label} maior que zero.`);
  }

  return { errors: [...new Set(errors)], values };
}

function parseOptionalInteger(value) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}
