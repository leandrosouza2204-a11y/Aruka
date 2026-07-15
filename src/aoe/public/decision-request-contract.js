import { PUBLIC_CONTRACT_VERSION } from "./public-contract-version.js";
import { PublicActorRole } from "./public-enums.js";

const MAX_STRING = 500;
const STUDENT_KEYS = new Set([
  "studentId",
  "sex",
  "goal",
  "experienceLevel",
  "availableDaysPerWeek",
  "availableMinutesPerSession",
  "equipmentProfile",
  "availableEquipment",
  "constraints",
  "preferences",
  "recovery",
  "adherence",
  "specializationInterest",
]);
const DANGEROUS_KEYS = new Set(["__proto__", "prototype", "constructor"]);

function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function containsFunction(value, seen = new WeakSet()) {
  if (!value || typeof value !== "object") return typeof value === "function";
  if (seen.has(value)) return false;
  seen.add(value);
  return Object.values(value).some((item) => typeof item === "function" || containsFunction(item, seen));
}

function findDangerousKeys(value, path = "$", findings = [], seen = new WeakSet()) {
  if (!value || typeof value !== "object" || seen.has(value)) return findings;
  seen.add(value);
  for (const key of Object.keys(value)) {
    if (DANGEROUS_KEYS.has(key)) findings.push(`${path}.${key}`);
    findDangerousKeys(value[key], `${path}.${key}`, findings, seen);
  }
  return findings;
}

function add(errors, field, message) {
  errors.push({ field, message });
}

function stringField(errors, value, field, min, max) {
  if (typeof value !== "string" || value.length < min || value.length > max) add(errors, field, `must be a string with ${min}-${max} characters`);
}

function safeFreeText(errors, value, field) {
  if (typeof value === "string" && value.length > MAX_STRING) add(errors, field, "exceeds maximum length");
  if (typeof value === "string" && /(diagnóstico|diagnostico|doença|doenca|cid|laudo|medicamento|cirurgia)/i.test(value)) {
    add(errors, field, "contains unsupported free medical content");
  }
}

function validateFreeTextObject(errors, value, path) {
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, item]) => {
    if (typeof item === "string") safeFreeText(errors, item, `${path}.${key}`);
    if (Array.isArray(item)) item.forEach((nested, index) => safeFreeText(errors, nested, `${path}.${key}[${index}]`));
    if (isPlainObject(item)) validateFreeTextObject(errors, item, `${path}.${key}`);
  });
}

export function validateDecisionRequestV1(request) {
  const errors = [];
  if (!isPlainObject(request)) return { valid: false, errors: [{ field: "$", message: "request must be an object" }] };
  if (containsFunction(request)) add(errors, "$", "functions are not allowed");
  for (const field of findDangerousKeys(request)) add(errors, field, "dangerous property is not allowed");
  if (request.contractVersion !== PUBLIC_CONTRACT_VERSION) add(errors, "contractVersion", "unsupported contract version");
  stringField(errors, request.requestId, "requestId", 1, 100);
  stringField(errors, request.idempotencyKey, "idempotencyKey", 8, 200);
  if (!isPlainObject(request.actor)) add(errors, "actor", "actor is required");
  if (!isPlainObject(request.student)) add(errors, "student", "student is required");
  if (!isPlainObject(request.options)) add(errors, "options", "options is required");

  if (isPlainObject(request.actor)) {
    stringField(errors, request.actor.actorId, "actor.actorId", 1, 100);
    if (!Object.values(PublicActorRole).includes(request.actor.role)) add(errors, "actor.role", "unsupported actor role");
    if (request.actor.organizationId !== undefined && request.actor.organizationId !== null) stringField(errors, request.actor.organizationId, "actor.organizationId", 1, 100);
  }

  if (isPlainObject(request.student)) {
    for (const key of Object.keys(request.student)) {
      if (!STUDENT_KEYS.has(key)) add(errors, `student.${key}`, "unknown student property");
    }
    stringField(errors, request.student.studentId, "student.studentId", 1, 100);
    if (!Number.isInteger(request.student.availableDaysPerWeek) || request.student.availableDaysPerWeek < 1 || request.student.availableDaysPerWeek > 7) {
      add(errors, "student.availableDaysPerWeek", "must be between 1 and 7");
    }
    if (!Number.isInteger(request.student.availableMinutesPerSession) || request.student.availableMinutesPerSession < 15 || request.student.availableMinutesPerSession > 240) {
      add(errors, "student.availableMinutesPerSession", "must be between 15 and 240");
    }
    if (request.student.availableEquipment && (!Array.isArray(request.student.availableEquipment) || request.student.availableEquipment.length > 100)) add(errors, "student.availableEquipment", "must have at most 100 items");
    if (request.student.constraints && (!Array.isArray(request.student.constraints) || request.student.constraints.length > 50)) add(errors, "student.constraints", "must have at most 50 items");
    validateFreeTextObject(errors, request.student, "student");
  }

  return { valid: errors.length === 0, errors };
}

export function createDecisionRequestV1(input) {
  return {
    contractVersion: PUBLIC_CONTRACT_VERSION,
    requestId: input.requestId,
    idempotencyKey: input.idempotencyKey,
    actor: input.actor,
    student: input.student,
    options: {
      maxAlternatives: 2,
      includeDecisionTrace: false,
      requireHumanReviewBeforeDelivery: false,
      activeReleases: [],
      ...(input.options ?? {}),
    },
    metadata: { source: "ARUKA_APP", locale: "pt-BR", ...(input.metadata ?? {}) },
  };
}
