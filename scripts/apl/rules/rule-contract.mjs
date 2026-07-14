import { MAX_EXCERPT_LENGTH } from "../config.mjs";

export const SEVERITIES = Object.freeze({
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  FATAL: "fatal",
});

export const SEVERITY_ORDER = Object.freeze([
  SEVERITIES.INFO,
  SEVERITIES.WARNING,
  SEVERITIES.ERROR,
  SEVERITIES.FATAL,
]);

export const RULE_SCOPES = Object.freeze({
  GLOBAL: "global",
  SPRINT: "sprint",
  BLOCK: "block",
  MODEL: "model",
  DOCUMENT: "document",
  PRESCRIPTION: "prescription",
});

export class AqaFatalError extends Error {
  constructor(message) {
    super(message);
    this.name = "AqaFatalError";
    this.severity = SEVERITIES.FATAL;
  }
}

export function isValidSeverity(severity) {
  return SEVERITY_ORDER.includes(String(severity ?? "").toLowerCase());
}

export function normalizeSeverity(severity) {
  const normalized = String(severity ?? "").toLowerCase();
  if (!isValidSeverity(normalized)) {
    throw new Error(`Severidade invalida: ${severity}`);
  }
  return normalized;
}

export function getSeverityWeight(severity) {
  return SEVERITY_ORDER.indexOf(normalizeSeverity(severity));
}

export function isValidScope(scope) {
  return Object.values(RULE_SCOPES).includes(String(scope ?? "").toLowerCase());
}

function isKebabCase(value) {
  return /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value);
}

function isPlainObject(value) {
  return Boolean(value) && Object.prototype.toString.call(value) === "[object Object]";
}

function assertSerializable(value, seen = new WeakSet()) {
  if (value === null || value === undefined) return;
  if (typeof value === "function") throw new Error("metadata nao pode conter funcoes");
  if (typeof value !== "object") return;
  if (seen.has(value)) throw new Error("metadata nao pode conter referencias circulares");
  seen.add(value);
  for (const child of Object.values(value)) {
    assertSerializable(child, seen);
  }
}

function cleanOptionalString(value, limit = null) {
  if (value === undefined || value === null || value === "") return undefined;
  const text = String(value).trim();
  return limit && text.length > limit ? `${text.slice(0, limit)}...` : text;
}

export function validateRuleDefinition(rule, file = "") {
  if (!isPlainObject(rule)) throw new AqaFatalError(`Regra invalida em ${file}: export default deve ser objeto`);
  if (!rule.id || !isKebabCase(rule.id)) throw new AqaFatalError(`Regra invalida em ${file}: id obrigatorio em kebab-case`);
  if (!rule.name) throw new AqaFatalError(`Regra ${rule.id}: name obrigatorio`);
  if (!rule.description) throw new AqaFatalError(`Regra ${rule.id}: description obrigatorio`);
  if (!isValidSeverity(rule.severity)) throw new AqaFatalError(`Regra ${rule.id}: severity invalida`);
  if (!isValidScope(rule.scope)) throw new AqaFatalError(`Regra ${rule.id}: scope invalido`);
  if (typeof rule.enabled !== "boolean") throw new AqaFatalError(`Regra ${rule.id}: enabled deve ser boolean`);
  if (!Array.isArray(rule.tags) || rule.tags.some((tag) => typeof tag !== "string")) {
    throw new AqaFatalError(`Regra ${rule.id}: tags deve ser array de strings`);
  }
  if (typeof rule.run !== "function") throw new AqaFatalError(`Regra ${rule.id}: run assincrono obrigatorio`);
  return true;
}

export function createFinding(input) {
  return normalizeFinding(input);
}

export function normalizeFinding(input, defaults = {}) {
  if (!isPlainObject(input)) throw new Error("Finding deve ser objeto simples");

  const finding = {
    ruleId: cleanOptionalString(input.ruleId ?? defaults.ruleId),
    severity: normalizeSeverity(input.severity ?? defaults.severity),
    scope: String(input.scope ?? defaults.scope ?? RULE_SCOPES.DOCUMENT).toLowerCase(),
    message: cleanOptionalString(input.message),
    file: cleanOptionalString(input.file),
    sprint: cleanOptionalString(input.sprint),
    block: cleanOptionalString(input.block),
    modelCode: cleanOptionalString(input.modelCode),
    line: input.line,
    column: input.column,
    section: cleanOptionalString(input.section),
    excerpt: cleanOptionalString(input.excerpt, MAX_EXCERPT_LENGTH),
    suggestion: cleanOptionalString(input.suggestion),
    metadata: input.metadata ?? {},
  };

  validateFinding(finding);
  return Object.fromEntries(Object.entries(finding).filter(([, value]) => value !== undefined));
}

export function validateFinding(finding) {
  if (!finding.ruleId) throw new Error("Finding sem ruleId");
  if (!isValidSeverity(finding.severity)) throw new Error(`Finding com severity invalida: ${finding.severity}`);
  if (!finding.message) throw new Error("Finding sem message");
  if (finding.scope && !isValidScope(finding.scope)) throw new Error(`Finding com scope invalido: ${finding.scope}`);
  for (const field of ["line", "column"]) {
    if (finding[field] !== undefined && (!Number.isInteger(finding[field]) || finding[field] < 1)) {
      throw new Error(`Finding com ${field} invalido`);
    }
  }
  if (!isPlainObject(finding.metadata)) throw new Error("Finding metadata deve ser objeto simples");
  assertSerializable(finding.metadata);
  return true;
}

export function sortFindings(findings) {
  return [...findings].sort((a, b) => {
    const severity = getSeverityWeight(b.severity) - getSeverityWeight(a.severity);
    if (severity) return severity;
    return [a.ruleId, a.file, a.line ?? 0, a.message].join("|").localeCompare(
      [b.ruleId, b.file, b.line ?? 0, b.message].join("|"),
    );
  });
}
