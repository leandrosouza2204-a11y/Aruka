export function validatePrivacyArtifacts(texts) {
  const joined = texts.join("\n");
  const forbidden = [/@/, /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, /C:\\Users\\/i, /\/home\//i, /"stack"\s*:/i, /at\s+file:\/\//i];
  const findings = forbidden.filter((pattern) => pattern.test(joined)).map((pattern) => pattern.toString());
  return { valid: findings.length === 0, findings };
}
