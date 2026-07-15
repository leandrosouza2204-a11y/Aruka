import fs from "node:fs";

export const CONTRACT_FILES = [
  "docs/aoe/21_RELEASE_CANDIDATE/contracts/AOE_DECISION_REQUEST_V1.schema.json",
  "docs/aoe/21_RELEASE_CANDIDATE/contracts/AOE_DECISION_RESPONSE_V1.schema.json",
  "docs/aoe/21_RELEASE_CANDIDATE/contracts/AOE_HUMAN_REVIEW_REQUEST_V1.schema.json",
  "docs/aoe/21_RELEASE_CANDIDATE/contracts/AOE_HUMAN_REVIEW_RESPONSE_V1.schema.json",
  "docs/aoe/21_RELEASE_CANDIDATE/contracts/AOE_ERROR_RESPONSE_V1.schema.json",
  "docs/aoe/21_RELEASE_CANDIDATE/contracts/AOE_PUBLIC_ENUMS_V1.json",
];

export function validateContractFreeze() {
  const results = CONTRACT_FILES.map((file) => {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
      return { file, valid: Boolean(parsed.contractVersion ?? parsed.enumsVersion), required: parsed.required ?? [] };
    } catch (error) {
      return { file, valid: false, error: error.message };
    }
  });
  return { valid: results.every((item) => item.valid), results };
}
