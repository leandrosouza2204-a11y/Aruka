import { PUBLIC_CONTRACT_VERSION, PublicActorRole, PublicDecisionStatus, PublicErrorCode, PublicReviewStatus } from "../../public/index.js";

export function validatePublicContracts() {
  const checks = [
    { name: "public contract rc version", passed: PUBLIC_CONTRACT_VERSION === "1.0.0-rc.1", blocking: true },
    { name: "decision statuses exposed", passed: Object.keys(PublicDecisionStatus).length >= 8, blocking: true },
    { name: "review statuses exposed", passed: Object.keys(PublicReviewStatus).length >= 5, blocking: true },
    { name: "actor roles exposed", passed: Object.keys(PublicActorRole).length === 4, blocking: true },
    { name: "error codes exposed", passed: Object.keys(PublicErrorCode).length >= 10, blocking: true },
  ];
  return { valid: checks.every((item) => item.passed), checks };
}
