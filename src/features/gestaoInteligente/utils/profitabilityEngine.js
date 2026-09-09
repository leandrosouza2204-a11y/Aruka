export const MONTHLY_WEEKS_FACTOR = 52 / 12;

const PRICING_MODELS = new Set(["PER_SESSION", "PER_STUDENT_SESSION", "MONTHLY_PACKAGE", "FIXED_PACKAGE"]);
const TRANSFER_RULES = new Set(["none", "fixed", "per_student", "tiered", "percentage"]);

export function calculateProfitability({ service, location, studentCount }) {
  const errors = validateInput({ service, location, studentCount });
  const base = {
    valid: false,
    errors,
    monetaryUnit: "BRL_CENTS",
    grossRevenue: null,
    transferAmount: null,
    netAfterTransfer: null,
    grossHourlyRate: null,
    netHourlyRate: null,
    grossPerStudent: null,
    netPerStudent: null,
    sessionDurationMinutes: service?.sessionDurationMinutes ?? null,
    studentCount: Number(studentCount),
    pricingModel: service?.pricingModel ?? null,
    transferRuleType: location?.rule?.type ?? null,
    monthlyNormalization: null,
    breakdown: [],
  };
  if (errors.length > 0) return base;

  const count = Number(studentCount);
  const price = toCents(service.price);
  const revenue = calculateSessionRevenue(service, price, count);
  if (revenue.error) return { ...base, errors: [revenue.error] };

  const transfer = calculateTransfer(location.rule, revenue.amount, count);
  if (transfer.error) return { ...base, errors: [transfer.error] };

  const net = revenue.amount - transfer.amount;
  const duration = positiveIntegerOrNull(service.sessionDurationMinutes);
  const grossHourlyRate = duration ? roundRatio(revenue.amount * 60, duration) : null;
  const netHourlyRate = duration ? roundRatio(net * 60, duration) : null;

  return {
    ...base,
    valid: true,
    errors: [],
    grossRevenue: revenue.amount,
    transferAmount: transfer.amount,
    netAfterTransfer: net,
    grossHourlyRate,
    netHourlyRate,
    grossPerStudent: roundRatio(revenue.amount, count),
    netPerStudent: roundRatio(net, count),
    monthlyNormalization: revenue.monthlyNormalization,
    breakdown: [
      { key: "gross", label: "Receita da sessão", formula: revenue.formula, value: revenue.amount },
      { key: "transfer", label: `Repasse de ${location.name}`, formula: transfer.formula, value: transfer.amount },
      { key: "net", label: "Receita após repasse", formula: `${revenue.amount} - ${transfer.amount}`, value: net },
      ...(duration ? [{ key: "hourly", label: "Valor líquido por hora", formula: `${net} × 60 / ${duration}`, value: netHourlyRate }] : []),
    ],
  };
}

function validateInput({ service, location, studentCount }) {
  const errors = [];
  const count = Number(studentCount);
  if (!service) errors.push(issue("SERVICE_REQUIRED", "Selecione um serviço ativo."));
  if (!location) errors.push(issue("LOCATION_REQUIRED", "Selecione um local ativo."));
  if (!Number.isInteger(count) || count < 1) errors.push(issue("INVALID_STUDENT_COUNT", "A quantidade de alunos deve ser pelo menos 1."));
  if (service) {
    if (service.status === "archived") errors.push(issue("SERVICE_ARCHIVED", "O serviço selecionado está arquivado."));
    if (!PRICING_MODELS.has(service.pricingModel)) errors.push(issue("INVALID_PRICING_MODEL", "O modelo de preço não é suportado."));
    if (toCents(service.price) === null) errors.push(issue("INVALID_PRICE", "O preço do serviço é inválido."));
    if (Number.isInteger(count) && count < Number(service.minStudents || 1)) errors.push(issue("BELOW_MIN_CAPACITY", `Este serviço exige no mínimo ${service.minStudents} alunos.`));
    if (Number.isInteger(count) && service.maxStudents !== null && service.maxStudents !== undefined && count > Number(service.maxStudents)) errors.push(issue("ABOVE_MAX_CAPACITY", `Este serviço permite no máximo ${service.maxStudents} alunos.`));
  }
  if (location) {
    if (location.status === "archived") errors.push(issue("LOCATION_ARCHIVED", "O local selecionado está arquivado."));
    if (!location.rule) errors.push(issue("RULE_MISSING", "Configure a regra de repasse deste local antes de simular."));
    else if (!TRANSFER_RULES.has(location.rule.type)) errors.push(issue("INVALID_TRANSFER_RULE", "A regra de repasse não é suportada."));
  }
  return errors;
}

function calculateSessionRevenue(service, price, count) {
  if (service.pricingModel === "PER_SESSION") return { amount: price, formula: "Preço por sessão", monthlyNormalization: null };
  if (service.pricingModel === "PER_STUDENT_SESSION") return { amount: price * count, formula: `${count} aluno(s) × ${price}`, monthlyNormalization: null };
  if (service.pricingModel === "FIXED_PACKAGE") {
    const sessions = positiveIntegerOrNull(service.sessionsInPackage);
    if (!sessions) return { error: issue("INVALID_FIXED_PACKAGE", "O pacote fechado precisa ter uma quantidade válida de sessões.") };
    return { amount: roundRatio(price, sessions), formula: `${price} / ${sessions} sessões`, monthlyNormalization: null };
  }
  const sessionsPerMonth = positiveIntegerOrNull(service.sessionsPerMonth);
  if (sessionsPerMonth) {
    return { amount: roundRatio(price, sessionsPerMonth), formula: `${price} / ${sessionsPerMonth} sessões mensais`, monthlyNormalization: { policy: "EXPLICIT_MONTHLY_SESSIONS", estimatedSessions: sessionsPerMonth } };
  }
  const sessionsPerWeek = positiveIntegerOrNull(service.sessionsPerWeek);
  if (!sessionsPerWeek) return { error: issue("MONTHLY_FREQUENCY_REQUIRED", "O pacote mensal precisa de uma frequência válida para estimar o valor por sessão.") };
  return {
    amount: roundRatio(price * 12, sessionsPerWeek * 52),
    formula: `${price} / (${sessionsPerWeek} × 52 / 12)`,
    monthlyNormalization: { policy: "WEEKLY_FREQUENCY_52_OVER_12", weeksFactor: MONTHLY_WEEKS_FACTOR, estimatedSessions: sessionsPerWeek * MONTHLY_WEEKS_FACTOR },
  };
}

function calculateTransfer(rule, gross, count) {
  if (rule.type === "none") return { amount: 0, formula: "Sem repasse" };
  if (rule.type === "fixed") return amountTransfer(rule.amount, "Valor fixo por atendimento");
  if (rule.type === "per_student") {
    const amount = toCents(rule.amount);
    return amount === null ? { error: issue("INVALID_TRANSFER_AMOUNT", "O valor de repasse é inválido.") } : { amount: amount * count, formula: `${count} aluno(s) × ${amount}` };
  }
  if (rule.type === "percentage") {
    if (rule.amount === null || rule.amount === undefined || rule.amount === "") return { error: issue("INVALID_TRANSFER_PERCENTAGE", "O percentual de repasse é inválido.") };
    const rateBasisPoints = Math.round(Number(rule.amount) * 100);
    if (!Number.isInteger(rateBasisPoints) || rateBasisPoints < 0 || rateBasisPoints > 10000) return { error: issue("INVALID_TRANSFER_PERCENTAGE", "O percentual de repasse é inválido.") };
    return { amount: roundRatio(gross * rateBasisPoints, 10000), formula: `${formatDecimal(rule.amount)}% de ${gross}` };
  }
  const tier = (rule.tiers || []).find((item) => count >= Number(item.minStudents) && (item.maxStudents === null || item.maxStudents === undefined || count <= Number(item.maxStudents)));
  if (!tier) return { error: issue("TRANSFER_TIER_NOT_FOUND", "Nenhuma faixa de repasse atende esta quantidade de alunos.") };
  const amount = toCents(tier.amount);
  if (amount === null) return { error: issue("INVALID_TRANSFER_AMOUNT", "O valor da faixa de repasse é inválido.") };
  return { amount, formula: tier.maxStudents == null ? `Faixa de ${tier.minStudents} ou mais alunos` : `Faixa de ${tier.minStudents} a ${tier.maxStudents} alunos` };
}

function amountTransfer(value, formula) {
  const amount = toCents(value);
  return amount === null ? { error: issue("INVALID_TRANSFER_AMOUNT", "O valor de repasse é inválido.") } : { amount, formula };
}

function toCents(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number * 100) : null;
}

function positiveIntegerOrNull(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

function roundRatio(numerator, denominator) {
  const sign = numerator < 0 ? -1 : 1;
  return sign * Math.floor((Math.abs(numerator) + denominator / 2) / denominator);
}

function issue(code, message) { return { code, message }; }
function formatDecimal(value) { return String(Number(value)).replace(".", ","); }
