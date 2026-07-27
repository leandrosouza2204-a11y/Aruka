export const TEMPLATE_DISCOVERY_PAGE_SIZE = 12;

export const TEMPLATE_DISCOVERY_SORT_OPTIONS = ["recommended", "nameAsc", "nameDesc", "updatedDesc"];

export function normalizeDiscoveryText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function normalizeTemplateForDiscovery(template, index = 0) {
  const origin = template?.isSystem ? "official" : "personal";
  const muscleGroups = deriveTemplateMuscleGroups(template);

  return {
    id: String(template?.id || `template-${index}`),
    origin,
    name: String(template?.nome || template?.name || "").trim(),
    description: String(template?.descricao || template?.description || "").trim(),
    split: String(template?.divisao || template?.splitType || "").trim(),
    objective: String(template?.objetivo || template?.objective || "").trim(),
    level: String(template?.nivel || template?.level || "").trim(),
    gender: String(template?.genero || template?.referenceGender || "").trim(),
    muscleGroups,
    updatedAt: String(template?.updatedAt || template?.updated_at || "").trim(),
    original: template,
    originalIndex: index,
    searchText: normalizeDiscoveryText([
      template?.nome || template?.name,
      template?.descricao || template?.description,
      template?.objetivo || template?.objective,
      template?.divisao || template?.splitType,
    ].join(" ")),
  };
}

export function deriveTemplateMuscleGroups(template) {
  const days = Array.isArray(template?.dias)
    ? template.dias
    : Array.isArray(template?.templateData?.days)
      ? template.templateData.days
      : [];

  const groups = new Map();

  days.forEach((day) => {
    const pieces = [day?.descricao, day?.notes, day?.name, day?.nome]
      .map((value) => String(value || "").trim())
      .filter(Boolean);

    pieces
      .join(",")
      .split(/[,|/]+|\se\s/gi)
      .map((piece) => piece.trim())
      .filter((piece) => piece.length >= 3 && !/^treino\s+[a-z0-9]+$/i.test(piece))
      .forEach((piece) => {
        const key = normalizeDiscoveryText(piece);
        if (key && !groups.has(key)) groups.set(key, piece);
      });
  });

  return [...groups.values()].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function buildTemplateDiscoveryOptions(items) {
  return {
    splits: uniqueOptions(items.map((item) => item.split)),
    objectives: uniqueOptions(items.map((item) => item.objective)),
    levels: uniqueOptions(items.map((item) => item.level)),
    muscleGroups: uniqueOptions(items.flatMap((item) => item.muscleGroups)),
  };
}

export function filterWorkoutTemplates(items, filters = {}) {
  const query = normalizeDiscoveryText(filters.query);
  const origin = validValue(filters.origin, "all");
  const split = normalizeDiscoveryText(filters.split);
  const objective = normalizeDiscoveryText(filters.objective);
  const level = normalizeDiscoveryText(filters.level);
  const muscleGroup = normalizeDiscoveryText(filters.muscleGroup);

  return items.filter((item) => {
    if (query && !item.searchText.includes(query)) return false;
    if (origin !== "all" && item.origin !== origin) return false;
    if (split && normalizeDiscoveryText(item.split) !== split) return false;
    if (objective && normalizeDiscoveryText(item.objective) !== objective) return false;
    if (level && normalizeDiscoveryText(item.level) !== level) return false;
    if (
      muscleGroup &&
      !item.muscleGroups.some((group) => normalizeDiscoveryText(group) === muscleGroup)
    ) {
      return false;
    }

    return true;
  });
}

export function sortWorkoutTemplates(items, sort = "recommended") {
  const sorted = [...items];

  if (sort === "nameAsc" || sort === "nameDesc") {
    const direction = sort === "nameAsc" ? 1 : -1;
    return sorted.sort((a, b) => stableCompare(a, b, direction * compareText(a.name, b.name)));
  }

  if (sort === "updatedDesc") {
    return sorted.sort((a, b) => {
      const timeA = Date.parse(a.updatedAt || "") || 0;
      const timeB = Date.parse(b.updatedAt || "") || 0;
      return stableCompare(a, b, timeB - timeA);
    });
  }

  return sorted.sort((a, b) => a.originalIndex - b.originalIndex);
}

export function paginateWorkoutTemplates(items, page = 1, pageSize = TEMPLATE_DISCOVERY_PAGE_SIZE) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = clampPage(page, totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
}

function uniqueOptions(values) {
  const options = new Map();

  values
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .forEach((value) => {
      const key = normalizeDiscoveryText(value);
      if (!options.has(key)) options.set(key, value);
    });

  return [...options.values()].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function compareText(a, b) {
  return String(a || "").localeCompare(String(b || ""), "pt-BR", { sensitivity: "base" });
}

function stableCompare(a, b, result) {
  return result || a.originalIndex - b.originalIndex;
}

function clampPage(value, totalPages) {
  const page = Number(value);
  if (!Number.isInteger(page) || page < 1) return 1;
  return Math.min(page, totalPages);
}

function validValue(value, fallback) {
  return String(value || fallback).trim() || fallback;
}
