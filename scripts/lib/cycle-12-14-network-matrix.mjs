export const NETWORK_FAULT_SCENARIOS = Object.freeze([
  "offline-before-open", "offline-after-shell", "timeout", "http-400", "http-401", "http-403", "http-404",
  "http-500", "http-502", "http-503", "request-abort", "disconnect-reconnect", "retry", "ambiguous-write", "refresh-reentry", "stale-response",
]);

export const NETWORK_SURFACES = Object.freeze(["home", "library", "player", "tracking", "completion-feedback", "evolution", "profile"]);

export function buildNetworkCoverage(resultsBySurface) {
  return NETWORK_SURFACES.map((surface) => ({
    surface,
    status: resultsBySurface[surface]?.status || "FAIL",
    reads: resultsBySurface[surface]?.reads ?? "NOT_APPLICABLE",
    writes: resultsBySurface[surface]?.writes ?? "NOT_APPLICABLE",
    evidence: resultsBySurface[surface]?.evidence || [],
    rationale: resultsBySurface[surface]?.rationale || null,
  }));
}
