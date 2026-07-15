export function assertAuditRecorder(recorder) {
  if (typeof recorder?.record !== "function") throw new Error("auditRecorder.record is required");
}
