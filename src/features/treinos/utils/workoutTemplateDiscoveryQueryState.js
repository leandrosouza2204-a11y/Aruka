import { TEMPLATE_DISCOVERY_SORT_OPTIONS } from "./workoutTemplateDiscovery.js";

const PARAMS = {
  query: "templateQ",
  split: "templateSplit",
  objective: "templateObjective",
  level: "templateLevel",
  muscleGroup: "templateMuscleGroup",
  origin: "templateOrigin",
  sort: "templateSort",
  page: "templatePage",
};

const ORIGINS = new Set(["all", "official", "personal"]);

export function readTemplateDiscoveryStateFromUrl(searchParams) {
  const params = normalizeSearch(searchParams);
  const origin = params.get(PARAMS.origin) || "all";
  const sort = params.get(PARAMS.sort) || "recommended";
  const page = Number(params.get(PARAMS.page) || 1);

  return {
    query: params.get(PARAMS.query) || "",
    split: params.get(PARAMS.split) || "",
    objective: params.get(PARAMS.objective) || "",
    level: params.get(PARAMS.level) || "",
    muscleGroup: params.get(PARAMS.muscleGroup) || "",
    origin: ORIGINS.has(origin) ? origin : "all",
    sort: TEMPLATE_DISCOVERY_SORT_OPTIONS.includes(sort) ? sort : "recommended",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

export function updateTemplateDiscoveryStateInUrl(searchParams, changes = {}) {
  const params = normalizeSearch(searchParams);
  const current = readTemplateDiscoveryStateFromUrl(params);
  const next = sanitizeState({ ...current, ...changes });
  const resetPage = Object.keys(changes).some((key) => key !== "page");

  writeParam(params, PARAMS.query, next.query);
  writeParam(params, PARAMS.split, next.split);
  writeParam(params, PARAMS.objective, next.objective);
  writeParam(params, PARAMS.level, next.level);
  writeParam(params, PARAMS.muscleGroup, next.muscleGroup);
  writeParam(params, PARAMS.origin, next.origin === "all" ? "" : next.origin);
  writeParam(params, PARAMS.sort, next.sort === "recommended" ? "" : next.sort);
  writeParam(params, PARAMS.page, resetPage || Number(next.page) <= 1 ? "" : String(next.page));

  return params;
}

export function clearTemplateDiscoveryStateFromUrl(searchParams) {
  const params = normalizeSearch(searchParams);
  Object.values(PARAMS).forEach((param) => params.delete(param));
  return params;
}

export function hasActiveTemplateDiscoveryFilters(state) {
  return Boolean(
    state.query ||
      state.split ||
      state.objective ||
      state.level ||
      state.muscleGroup ||
      state.origin !== "all" ||
      state.sort !== "recommended"
  );
}

export function countActiveTemplateDiscoveryFilters(state) {
  return [
    state.query,
    state.split,
    state.objective,
    state.level,
    state.muscleGroup,
    state.origin !== "all" ? state.origin : "",
    state.sort !== "recommended" ? state.sort : "",
  ].filter(Boolean).length;
}

function writeParam(params, name, value) {
  const normalized = String(value || "").trim();
  if (!normalized) params.delete(name);
  else params.set(name, normalized);
}

function normalizeSearch(searchParams) {
  if (searchParams instanceof URLSearchParams) return new URLSearchParams(searchParams);
  return new URLSearchParams(String(searchParams || "").replace(/^\?/, ""));
}

function sanitizeState(state) {
  const page = Number(state.page || 1);
  return {
    ...state,
    origin: ORIGINS.has(state.origin) ? state.origin : "all",
    sort: TEMPLATE_DISCOVERY_SORT_OPTIONS.includes(state.sort) ? state.sort : "recommended",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}
