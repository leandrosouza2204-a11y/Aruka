const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const EMPTY_GENERAL = "EMPTY_GENERAL";
export const EMPTY_CONTEXTUAL = "EMPTY_CONTEXTUAL";
export const EMPTY_SEARCH = "EMPTY_SEARCH";
export const EMPTY_FILTER = "EMPTY_FILTER";

export function sanitizeReturnTo(value) {
  const raw = String(value || "").trim();
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return null;

  try {
    const parsed = new URL(raw, "http://aruka.local");
    if (parsed.origin !== "http://aruka.local") return null;
    if (!parsed.pathname.startsWith("/") || parsed.pathname.startsWith("//")) return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

export function resolveContextStudentId({ alunoIdParam, alunos = [] }) {
  const alunoId = String(alunoIdParam || "").trim();
  if (!alunoId || !idAlunoBemFormado(alunoId)) return "";
  return alunos.some((aluno) => aluno.id === alunoId) ? alunoId : "";
}

export function resolveContextStudent({ alunoIdParam, alunos = [] }) {
  const alunoId = resolveContextStudentId({ alunoIdParam, alunos });
  return alunos.find((aluno) => aluno.id === alunoId) || null;
}

export function resolveInitialStudentId({
  editingStudentId,
  contextualStudentId,
  alunos = [],
}) {
  const ids = new Set(alunos.map((aluno) => aluno.id));
  if (editingStudentId && ids.has(editingStudentId)) return editingStudentId;
  if (contextualStudentId && ids.has(contextualStudentId)) return contextualStudentId;
  return "";
}

export function updateSearchParamsPreservingContext({
  currentParams,
  updates = {},
  removals = [],
}) {
  const params = normalizeSearchParams(currentParams);

  removals.forEach((key) => params.delete(key));

  Object.entries(updates).forEach(([key, value]) => {
    const normalized = String(value || "").trim();
    if (!normalized || normalized === "todos") params.delete(key);
    else params.set(key, normalized);
  });

  return params;
}

export function removeOnlyAlunoId(currentParams) {
  return updateSearchParamsPreservingContext({
    currentParams,
    removals: ["alunoId"],
  });
}

export function classifyAvaliacoesEmptyState({
  totalRecords = 0,
  filteredRecords = 0,
  searchTerm = "",
  contextualStudent = null,
  hasStudentFilter = false,
} = {}) {
  if (filteredRecords > 0) return null;
  if (String(searchTerm || "").trim() && totalRecords > 0) return EMPTY_SEARCH;
  if (contextualStudent) return EMPTY_CONTEXTUAL;
  if (hasStudentFilter && totalRecords > 0) return EMPTY_FILTER;
  return EMPTY_GENERAL;
}

export function idAlunoBemFormado(alunoId) {
  return UUID_REGEX.test(String(alunoId || ""));
}

function normalizeSearchParams(searchParams) {
  if (searchParams instanceof URLSearchParams) return new URLSearchParams(searchParams);
  return new URLSearchParams(String(searchParams || "").replace(/^\?/, ""));
}
