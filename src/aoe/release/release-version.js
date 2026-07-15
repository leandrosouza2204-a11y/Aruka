export const AOE_RC_VERSION = "1.0.0-rc.1";
export const AOE_ENGINE_VERSION = "1.6.0";
export const AOE_RELEASE_STATUS = "Release Candidate";

export function getReleaseIdentity() {
  return {
    name: "Aruka Optimization Engine",
    engineVersion: AOE_ENGINE_VERSION,
    releaseCandidateVersion: AOE_RC_VERSION,
    status: AOE_RELEASE_STATUS,
    publicContract: AOE_RC_VERSION,
    applicationService: AOE_ENGINE_VERSION,
    catalogAdapter: "1.3.0",
    explainability: "1.0.0",
    riskModel: "1.0.0",
    humanReviewPolicy: "1.0.0",
    activeAPLReleases: ["SPRINT_01@1.0.0", "SPRINT_02@2.0.0"],
  };
}
