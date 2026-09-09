import { formatMoney } from "./transferRules.js";

const INTRO = "Olá! Tudo bem? Vou te enviar algumas opções de acompanhamento que trabalho atualmente:";
const CLOSING = "Se alguma opção fizer sentido para você, me chama que posso te explicar melhor.";

export function buildCommercialPresentation({ services = [] } = {}) {
  const selectedServices = services.filter((service) => service && service.status !== "archived");
  if (selectedServices.length === 0) return "";

  return [
    INTRO,
    "",
    selectedServices.map(formatServiceBlock).join("\n\n"),
    "",
    CLOSING,
  ].join("\n");
}

export function formatCommercialServicePrice(service) {
  const price = formatMoney(service.price);
  if (service.pricingModel === "PER_SESSION") return `${price} por sessão`;
  if (service.pricingModel === "PER_STUDENT_SESSION") return `${price} por aluno/sessão`;
  if (service.pricingModel === "FIXED_PACKAGE") {
    return service.sessionsInPackage ? `Pacote com ${service.sessionsInPackage} sessões\n• ${price}` : `${price} por pacote`;
  }
  return `${price}/mês`;
}

function formatServiceBlock(service) {
  const lines = [`*${sanitizeLine(service.name)}*`, `• ${formatCommercialServicePrice(service)}`];
  const description = sanitizeLine(service.description);
  if (description) lines.push(`• ${description}`);
  if (service.sessionsPerWeek) lines.push(`• ${service.sessionsPerWeek} treinos por semana`);
  if (service.sessionsPerMonth) lines.push(`• ${service.sessionsPerMonth} sessões por mês`);
  if (service.sessionDurationMinutes) lines.push(`• Sessões de ${service.sessionDurationMinutes} minutos`);
  const capacity = formatCommercialCapacity(service.minStudents, service.maxStudents);
  if (capacity) lines.push(`• ${capacity}`);
  return lines.join("\n");
}

export function formatCommercialCapacity(minStudents = 1, maxStudents = null) {
  if (minStudents === 1 && maxStudents === 1) return "Atendimento individual";
  if (minStudents === 2 && maxStudents === 2) return "Para 2 alunos";
  if (minStudents >= 3 && !maxStudents) return `Para ${minStudents} ou mais alunos`;
  if (minStudents === maxStudents && minStudents > 1) return `Para ${minStudents} alunos`;
  if (minStudents && maxStudents) return `Para ${minStudents} a ${maxStudents} alunos`;
  return "";
}

function sanitizeLine(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}
