export function createInfrastructureConfig(env = {}) {
  return {
    aoeEnabled: env.AOE_ENABLED === "true",
    pilotEnabled: env.AOE_PILOT_ENABLED === "true",
    decisionWriteEnabled: env.AOE_DECISION_WRITE_ENABLED === "true",
    humanReviewEnabled: env.AOE_HUMAN_REVIEW_ENABLED !== "false",
    traceReadEnabled: env.AOE_TRACE_READ_ENABLED === "true",
    allowedOrganizationIds: parseList(env.AOE_ALLOWED_ORGANIZATION_IDS),
    allowedUserIds: parseList(env.AOE_ALLOWED_USER_IDS),
    activeAPLReleases: parseList(env.AOE_ACTIVE_APL_RELEASES),
    contractVersion: env.AOE_CONTRACT_VERSION ?? "1.0.0-rc.1",
    corsOrigins: parseList(env.AOE_CORS_ORIGINS),
    environment: env.AOE_ENVIRONMENT ?? "local",
  };
}

function parseList(value) {
  return String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean);
}

export function isPilotAllowed(config, actor) {
  if (!config.aoeEnabled || !config.pilotEnabled) return false;
  const userAllowed = config.allowedUserIds.length === 0 || config.allowedUserIds.includes(actor.actorId);
  const orgAllowed = !actor.organizationId || config.allowedOrganizationIds.length === 0 || config.allowedOrganizationIds.includes(actor.organizationId);
  return userAllowed && orgAllowed;
}
