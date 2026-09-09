export const RULE_LABELS = Object.freeze({
  none: "Sem repasse",
  fixed: "Valor fixo por atendimento",
  per_student: "Valor por aluno",
  tiered: "Por faixa de alunos",
  percentage: "Percentual",
});

export function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));
}

export function parseBrazilianNumber(value) {
  const normalized = String(value ?? "").trim().replace(/R\$\s?/g, "").replace(/\./g, "").replace(",", ".");
  if (!normalized || !/^\d+(\.\d{0,2})?$/.test(normalized)) return null;
  const result = Number(normalized);
  return Number.isFinite(result) ? result : null;
}

export function parsePercentage(value) {
  const parsed = parseBrazilianNumber(String(value ?? "").replace("%", ""));
  return parsed === null || parsed > 100 ? null : parsed;
}

export function validateTiers(tiers) {
  const errors = [];
  const normalized = tiers.map((tier, index) => ({
    ...tier,
    minStudents: Number(tier.minStudents),
    maxStudents: tier.maxStudents === "" || tier.maxStudents === null ? null : Number(tier.maxStudents),
    amount: typeof tier.amount === "number" ? tier.amount : parseBrazilianNumber(tier.amount),
    index,
  }));
  for (const tier of normalized) {
    if (!Number.isInteger(tier.minStudents) || tier.minStudents < 1) errors.push("Informe uma quantidade mínima de alunos válida.");
    if (tier.maxStudents !== null && (!Number.isInteger(tier.maxStudents) || tier.maxStudents < tier.minStudents)) errors.push("O máximo deve ser maior ou igual ao mínimo.");
    if (tier.amount === null || tier.amount < 0) errors.push("Informe um valor de repasse válido para cada faixa.");
  }
  const openTiers = normalized.filter((tier) => tier.maxStudents === null);
  if (openTiers.length > 1) errors.push("Use apenas uma faixa final aberta, marcada como ‘ou mais’.");
  for (let index = 0; index < normalized.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < normalized.length; otherIndex += 1) {
      const first = normalized[index];
      const second = normalized[otherIndex];
      const overlap = !((first.maxStudents !== null && second.minStudents > first.maxStudents) || (second.maxStudents !== null && first.minStudents > second.maxStudents));
      if (overlap) errors.push("As faixas de alunos não podem se sobrepor.");
    }
  }
  return { errors: [...new Set(errors)], tiers: normalized.map(({ index, ...tier }) => tier) };
}

export function ruleSummary(rule) {
  if (!rule) return "Configuração de repasse pendente";
  if (rule.type === "none") return "Sem repasse";
  if (rule.type === "fixed") return `${formatMoney(rule.amount)} por atendimento`;
  if (rule.type === "per_student") return `${formatMoney(rule.amount)} por aluno`;
  if (rule.type === "percentage") return `${String(rule.amount).replace(".", ",")}% de repasse`;
  return `${rule.tiers?.length || 0} faixas configuradas`;
}
