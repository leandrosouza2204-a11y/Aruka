const clone = (value) => value == null ? value : structuredClone(value);

export function decisionToRow(decision) {
  return {
    id: decision.decisionId,
    request_id: decision.requestId,
    actor_id: decision.actorId,
    student_id: decision.studentId,
    organization_id: decision.organizationId,
    status: decision.status,
    selected_model_code: decision.selectedModel?.modelCode ?? null,
    selected_model_version: decision.selectedModel?.modelVersion ?? null,
    selected_apl_release: decision.selectedModel?.aplRelease ?? null,
    alternatives: decision.alternatives ?? [],
    compatibility_score: decision.scores?.compatibility ?? null,
    raw_score: decision.scores?.raw ?? null,
    confidence_score: decision.scores?.confidence ?? null,
    confidence_level: decision.confidence,
    risk_score: decision.scores?.risk ?? null,
    risk_level: decision.risk,
    ambiguity_level: decision.ambiguity,
    warnings: decision.warnings ?? [],
    reason_codes: decision.reasonCodes ?? [],
    human_review_required: decision.humanReviewRequired,
    human_review_id: decision.humanReviewId,
    versions: decision.versions ?? {},
    public_response: decision.publicResponse,
    trace_reference: decision.traceReference,
    created_at: decision.createdAt,
    updated_at: decision.updatedAt,
  };
}

export function rowToDecision(row) {
  if (!row) return null;
  return {
    decisionId: row.id,
    requestId: row.request_id,
    actorId: row.actor_id,
    studentId: row.student_id,
    organizationId: row.organization_id,
    status: row.status,
    selectedModel: row.selected_model_code ? {
      modelCode: row.selected_model_code,
      modelVersion: row.selected_model_version,
      aplRelease: row.selected_apl_release,
    } : null,
    alternatives: clone(row.alternatives ?? []),
    scores: {
      compatibility: row.compatibility_score,
      raw: row.raw_score,
      confidence: row.confidence_score,
      risk: row.risk_score,
    },
    confidence: row.confidence_level,
    risk: row.risk_level,
    ambiguity: row.ambiguity_level,
    warnings: clone(row.warnings ?? []),
    reasonCodes: clone(row.reason_codes ?? []),
    humanReviewRequired: row.human_review_required,
    humanReviewId: row.human_review_id,
    versions: clone(row.versions ?? {}),
    publicResponse: clone(row.public_response),
    traceReference: clone(row.trace_reference),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function traceToRow(record) {
  return {
    id: record.traceId ?? record.decisionId,
    decision_id: record.decisionId,
    organization_id: record.organizationId ?? null,
    trace_version: record.versions?.aoeVersion ?? record.versions?.aoe ?? "1.7.0",
    trace_payload: record.trace,
    redaction_version: "1.0.0",
    created_at: record.createdAt,
  };
}

export function rowToTrace(row) {
  if (!row) return null;
  return {
    decisionId: row.decision_id,
    trace: clone(row.trace_payload),
    createdAt: row.created_at,
    versions: { traceVersion: row.trace_version, redactionVersion: row.redaction_version },
  };
}

export function reviewToRow(review) {
  return {
    id: review.reviewId,
    decision_id: review.decisionId,
    organization_id: review.organizationId ?? null,
    status: review.status,
    required: review.required,
    blocking: review.blocking,
    reason_codes: review.reasonCodes ?? [],
    checklist: review.checklist ?? [],
    reviewer_id: review.reviewerId,
    reviewer_role: review.reviewerRole,
    adjustments: review.adjustments ?? [],
    notes: review.notes ?? "",
    created_at: review.createdAt,
    updated_at: review.updatedAt,
    completed_at: review.completedAt,
  };
}

export function rowToReview(row) {
  if (!row) return null;
  return {
    reviewId: row.id,
    decisionId: row.decision_id,
    organizationId: row.organization_id,
    status: row.status,
    required: row.required,
    blocking: row.blocking,
    reasonCodes: clone(row.reason_codes ?? []),
    checklist: clone(row.checklist ?? []),
    reviewerId: row.reviewer_id,
    reviewerRole: row.reviewer_role,
    adjustments: clone(row.adjustments ?? []),
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
  };
}

export function idempotencyToRow(record) {
  return {
    id: record.key,
    actor_id: record.actorId,
    organization_id: record.organizationId ?? null,
    operation: record.operation,
    idempotency_key: record.key.split(":").at(-1),
    request_fingerprint: record.requestFingerprint,
    status: record.status,
    response_payload: record.response,
    error_code: record.response?.error ?? null,
    created_at: record.createdAt,
    updated_at: record.updatedAt ?? record.createdAt,
    expires_at: record.expiresAt,
  };
}

export function rowToIdempotency(row) {
  if (!row) return null;
  return {
    key: row.id,
    operation: row.operation,
    actorId: row.actor_id,
    organizationId: row.organization_id,
    requestFingerprint: row.request_fingerprint,
    status: row.status,
    response: clone(row.response_payload),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
  };
}
