export function evaluateReleaseReadiness(checks) {
  const blockers = checks.filter((check) => check.blocking && !check.passed);
  const restrictions = checks.filter((check) => !check.blocking && !check.passed);
  const status = blockers.length ? "NOT_READY" : restrictions.length ? "READY_WITH_RESTRICTIONS" : "READY_FOR_RC";
  return { status, blockers, restrictions, checks };
}
