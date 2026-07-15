import crypto from "node:crypto";

function stable(value) {
  if (Array.isArray(value)) return value.map(stable).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  if (value && typeof value === "object") {
    return Object.keys(value).sort().reduce((acc, key) => {
      if (["metadata", "requestId", "idempotencyKey"].includes(key)) return acc;
      acc[key] = stable(value[key]);
      return acc;
    }, {});
  }
  return value;
}

export function createRequestFingerprint(request) {
  const relevant = {
    contractVersion: request.contractVersion,
    actorId: request.actor?.actorId,
    student: request.student,
    options: {
      maxAlternatives: request.options?.maxAlternatives,
      includeDecisionTrace: request.options?.includeDecisionTrace,
      requireHumanReviewBeforeDelivery: request.options?.requireHumanReviewBeforeDelivery,
      activeReleases: request.options?.activeReleases ?? [],
    },
  };
  return crypto.createHash("sha256").update(JSON.stringify(stable(relevant))).digest("hex");
}
