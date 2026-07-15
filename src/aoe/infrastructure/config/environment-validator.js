export function validateInfrastructureEnvironment(config) {
  const findings = [];
  if (!config.aoeEnabled) findings.push({ code: "AOE_DISABLED", severity: "warning" });
  if (!config.pilotEnabled) findings.push({ code: "AOE_PILOT_DISABLED", severity: "warning" });
  if (config.contractVersion !== "1.0.0-rc.1") findings.push({ code: "CONTRACT_VERSION_MISMATCH", severity: "blocker" });
  return { valid: findings.every((item) => item.severity !== "blocker"), findings };
}
