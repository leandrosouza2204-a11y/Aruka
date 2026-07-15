export const AOE_VERSION = "1.2.0";
export const RULE_CATALOG_VERSION = "1.0.0";
export const SCORING_VERSION = "1.0.0";
export const CONFIDENCE_VERSION = "1.0.0";

export const APL_RELEASES = Object.freeze({
  SPRINT_01: "1.0.0",
  SPRINT_02: "2.0.0",
});

export function getVersionRegistry() {
  return Object.freeze({
    aoe: AOE_VERSION,
    ruleCatalog: RULE_CATALOG_VERSION,
    scoring: SCORING_VERSION,
    confidence: CONFIDENCE_VERSION,
    aplReleases: { ...APL_RELEASES },
  });
}
