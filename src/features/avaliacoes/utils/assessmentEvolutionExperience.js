import { calcularComposicaoCorporal } from "../../../data/calculosCorporais.js";

const METRICS = [
  { key: "peso", label: "Peso", unit: "kg", precision: 1, direction: "contextual" },
  { key: "cintura", label: "Cintura", unit: "cm", precision: 1, direction: "lower" },
  { key: "gordura", label: "Gordura estimada", unit: "%", precision: 1, direction: "lower" },
  { key: "massaMagra", label: "Massa magra", unit: "kg", precision: 1, direction: "higher" },
];

export function buildAssessmentEvolutionExperience(history = []) {
  const ordered = normalizeHistory(history);
  const first = ordered[0] || null;
  const previous = ordered.length > 1 ? ordered[ordered.length - 2] : null;
  const latest = ordered[ordered.length - 1] || null;
  const status = classifyStatus(ordered);

  if (!latest) {
    return {
      status,
      assessmentCount: 0,
      cards: [],
      highlights: [],
      reportLanguage: "Registre a primeira avaliação para começar a acompanhar a evolução.",
      summary: "Ainda não há avaliação física para comparar.",
    };
  }

  const cards = METRICS.map((metric) =>
    buildMetricCard({ metric, first, previous, latest })
  );
  const validCards = cards.filter((card) => card.hasCurrentValue);
  const highlights = buildHighlights(cards, ordered.length);

  return {
    status,
    assessmentCount: ordered.length,
    cards,
    highlights,
    reportLanguage: buildReportLanguage({ validCards, latest, previous, first, count: ordered.length }),
    summary: buildSummary({ validCards, count: ordered.length }),
  };
}

function normalizeHistory(history) {
  return [...(Array.isArray(history) ? history : [])]
    .filter(Boolean)
    .sort((a, b) => String(a.data || "").localeCompare(String(b.data || "")));
}

function classifyStatus(history) {
  if (!history.length) return "EMPTY";
  if (history.length === 1) return "BASELINE_ONLY";
  return "READY";
}

function buildMetricCard({ metric, first, previous, latest }) {
  const currentValue = getMetricValue(latest, metric.key);
  const previousValue = getMetricValue(previous, metric.key);
  const firstValue = getMetricValue(first, metric.key);
  const previousDelta = calculateDelta(currentValue, previousValue, metric);
  const totalDelta = calculateDelta(currentValue, firstValue, metric);

  return {
    key: metric.key,
    label: metric.label,
    current: formatValue(currentValue, metric),
    previousDelta: formatDelta(previousDelta, metric),
    totalDelta: formatDelta(totalDelta, metric),
    tone: classifyTone(previousDelta, metric.direction),
    hasCurrentValue: isFiniteNumber(currentValue),
    hasPreviousComparison: previousDelta !== null,
    hasTotalComparison: totalDelta !== null,
  };
}

function getMetricValue(assessment, key) {
  if (!assessment) return null;
  const composition = key === "gordura" || key === "massaMagra"
    ? calcularComposicaoCorporal(assessment)
    : null;
  const valueByKey = {
    peso: assessment.peso,
    cintura: assessment.medidas?.cintura,
    gordura: composition?.percentualGordura,
    massaMagra: composition?.massaMagra,
  };
  return parseNumber(valueByKey[key]);
}

function parseNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function calculateDelta(currentValue, referenceValue, metric) {
  if (!isFiniteNumber(currentValue) || !isFiniteNumber(referenceValue)) return null;
  return round(currentValue - referenceValue, metric.precision);
}

function round(value, precision) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function formatValue(value, metric) {
  if (!isFiniteNumber(value)) return "Sem dado";
  return `${value.toFixed(metric.precision)} ${metric.unit}`;
}

function formatDelta(delta, metric) {
  if (delta === null) return "Sem comparação";
  if (Math.abs(delta) < 0.05) return `0,0 ${metric.unit}`;
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(metric.precision).replace(".", ",")} ${metric.unit}`;
}

function classifyTone(delta, direction) {
  if (delta === null || Math.abs(delta) < 0.05 || direction === "contextual") return "neutral";
  if (direction === "higher") return delta > 0 ? "positive" : "attention";
  if (direction === "lower") return delta < 0 ? "positive" : "attention";
  return "neutral";
}

function buildHighlights(cards, count) {
  if (count < 2) {
    return ["Esta avaliação cria a linha de base para as próximas comparações."];
  }

  const highlights = cards
    .filter((card) => card.hasPreviousComparison && card.tone !== "neutral")
    .slice(0, 3)
    .map((card) => {
      const verb = card.tone === "positive" ? "melhorou" : "pede atenção";
      return `${card.label} ${verb} desde a avaliação anterior (${card.previousDelta}).`;
    });

  return highlights.length
    ? highlights
    : ["As principais medidas ficaram estáveis desde a avaliação anterior."];
}

function buildReportLanguage({ validCards, count }) {
  if (count < 2) {
    return "Esta avaliação estabelece uma linha de base clara para acompanhar medidas, composição corporal e próximos ajustes.";
  }

  const parts = validCards
    .filter((card) => card.hasPreviousComparison)
    .slice(0, 4)
    .map((card) => `${card.label.toLowerCase()} ${card.previousDelta}`);

  if (!parts.length) {
    return "Há histórico de avaliações, mas os dados atuais ainda não permitem uma comparação numérica confiável.";
  }

  return `Desde a avaliação anterior, a evolução mostra ${joinHuman(parts)}. Use estes sinais junto com aderência, fotos e objetivo atual para explicar o progresso.`;
}

function buildSummary({ validCards, count }) {
  if (count < 2) return "Linha de base criada para acompanhar a evolução nas próximas avaliações.";
  const comparable = validCards.filter((card) => card.hasPreviousComparison).length;
  return comparable
    ? `${comparable} indicadores com comparação direta desde a avaliação anterior.`
    : "Histórico disponível, mas ainda sem indicadores comparáveis suficientes.";
}

function joinHuman(parts) {
  if (parts.length <= 1) return parts[0] || "";
  return `${parts.slice(0, -1).join(", ")} e ${parts.at(-1)}`;
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}
