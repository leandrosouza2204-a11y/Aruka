export const PUBLIC_CONTRACT_VERSION = "1.0.0-rc.1";
export const APPLICATION_SERVICE_VERSION = "1.7.0";
export const PERSISTENCE_CONTRACT_VERSION = "1.0.0";
export const AUDIT_CONTRACT_VERSION = "1.0.0";
export const OBSERVABILITY_CONTRACT_VERSION = "1.0.0";
export const HUMAN_REVIEW_CONTRACT_VERSION = "1.0.0";

export function getPublicVersionRegistry(aoeVersion = "1.7.0") {
  return {
    publicContractVersion: PUBLIC_CONTRACT_VERSION,
    applicationServiceVersion: APPLICATION_SERVICE_VERSION,
    persistenceContractVersion: PERSISTENCE_CONTRACT_VERSION,
    auditContractVersion: AUDIT_CONTRACT_VERSION,
    observabilityContractVersion: OBSERVABILITY_CONTRACT_VERSION,
    humanReviewContractVersion: HUMAN_REVIEW_CONTRACT_VERSION,
    aoeVersion,
  };
}
