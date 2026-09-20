const ASSESSMENT_METRICS = Object.freeze([
  { key: "weightKg", label: "Peso", unit: "kg" },
  { key: "waistCm", label: "Cintura", unit: "cm" },
  { key: "abdomenCm", label: "Abdômen", unit: "cm" },
  { key: "hipCm", label: "Quadril", unit: "cm" },
  { key: "rightArmCm", label: "Braço direito", unit: "cm" },
  { key: "leftArmCm", label: "Braço esquerdo", unit: "cm" },
  { key: "rightThighCm", label: "Coxa direita", unit: "cm" },
  { key: "leftThighCm", label: "Coxa esquerda", unit: "cm" },
  { key: "rightCalfCm", label: "Panturrilha direita", unit: "cm" },
  { key: "leftCalfCm", label: "Panturrilha esquerda", unit: "cm" },
]);

const FREQUENCY_LABELS = Object.freeze({
  last7Days: "Últimos 7 dias",
  last28Days: "Últimos 28 dias",
});

export function normalizeStudentEvolutionPayload(payload = {}) {
  const assessments = payload.assessments || {};
  return {
    calendar: {
      today: normalizeDateOnly(payload.calendar?.today),
      timeZone: payload.calendar?.timeZone || payload.calendar?.time_zone || "America/Sao_Paulo",
    },
    frequency: (Array.isArray(payload.frequency) ? payload.frequency : []).map((period) => ({
      key: period.key || "",
      label: FREQUENCY_LABELS[period.key] || "Período",
      startDate: normalizeDateOnly(period.startDate || period.start_date),
      endDate: normalizeDateOnly(period.endDate || period.end_date),
      completedCount: toCount(period.completedCount ?? period.completed_count),
    })),
    assessments: {
      limit: toCount(assessments.limit) || 24,
      totalCount: toCount(assessments.totalCount ?? assessments.total_count),
      items: normalizeAssessments(assessments.items),
    },
  };
}

export function buildWorkoutEvolutionHistory(history = []) {
  return (Array.isArray(history) ? history : [])
    .filter((session) => session?.status === "completed")
    .map((session) => {
      const completedSets = (session.exercises || []).flatMap((exercise) =>
        (exercise.sets || []).filter((set) => set.completed)
      );
      const completedExercises = (session.exercises || []).filter((exercise) =>
        (exercise.sets || []).some((set) => set.completed)
      );
      return {
        id: String(session.id || ""),
        date: normalizeDateOnly(session.sessionDate || session.session_date || session.completedAt || session.completed_at),
        completedAt: String(session.completedAt || session.completed_at || ""),
        title: session.exercises?.[0]?.workoutTitle || "Treino concluído",
        dayName: session.exercises?.[0]?.dayName || "",
        completedSetCount: completedSets.length,
        completedExerciseCount: completedExercises.length,
        shortDurationConfirmed: Boolean(session.shortDurationConfirmed ?? session.short_duration_confirmed),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.completedAt.localeCompare(a.completedAt) || b.id.localeCompare(a.id));
}

export function buildAssessmentEvolution(assessmentState = {}) {
  const items = normalizeAssessments(assessmentState.items);
  const latest = items[0] || null;
  const previous = items[1] || null;
  const comparisons = ASSESSMENT_METRICS.map((metric) => {
    const current = toOptionalNumber(latest?.measurements?.[metric.key]);
    const before = toOptionalNumber(previous?.measurements?.[metric.key]);
    if (current === null && before === null) return null;
    return {
      ...metric,
      current,
      previous: before,
      delta: current !== null && before !== null ? round(current - before) : null,
    };
  }).filter(Boolean);

  return {
    items,
    latest,
    previous,
    comparisons,
    comparableCount: comparisons.filter((item) => item.delta !== null).length,
    status: !latest ? "empty" : previous ? "comparable" : "baseline",
    totalCount: toCount(assessmentState.totalCount ?? assessmentState.total_count),
    limit: toCount(assessmentState.limit) || 24,
  };
}

export function formatEvolutionDate(value) {
  const normalized = normalizeDateOnly(value);
  if (!normalized) return "Data não informada";
  const [year, month, day] = normalized.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)))
    .replace(".", "");
}

export function formatMeasurement(value, unit, signed = false) {
  const number = toOptionalNumber(value);
  if (number === null) return "Sem dado";
  const prefix = signed && number > 0 ? "+" : "";
  return `${prefix}${number.toFixed(1).replace(".", ",")} ${unit}`;
}

function normalizeAssessments(items = []) {
  return (Array.isArray(items) ? items : [])
    .filter(Boolean)
    .map((item) => ({
      id: String(item.id || ""),
      date: normalizeDateOnly(item.date || item.data_avaliacao),
      measurements: Object.fromEntries(
        ASSESSMENT_METRICS.map(({ key }) => [key, toOptionalNumber(item.measurements?.[key])])
      ),
    }))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

function normalizeDateOnly(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (date.getUTCFullYear() !== Number(match[1]) || date.getUTCMonth() !== Number(match[2]) - 1 || date.getUTCDate() !== Number(match[3])) return "";
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function toOptionalNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(String(value).replace(",", "."));
  return Number.isFinite(number) ? number : null;
}

function toCount(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function round(value) {
  return Math.round(value * 10) / 10;
}
