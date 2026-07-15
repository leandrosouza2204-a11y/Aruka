import { validateModelCatalog } from "../contracts/catalog-contract.js";

export function validateCatalogIntegrity(catalog) {
  const errors = [];
  const warnings = [];
  const codes = new Set();
  for (const model of catalog) {
    if (codes.has(model.modelCode)) errors.push({ code: "DUPLICATE_MODEL_CODE", modelCode: model.modelCode });
    codes.add(model.modelCode);
    for (const key of ["modelCode", "modelVersion", "aplRelease", "status", "sex", "goal", "experienceLevel", "split", "strategy", "frequency", "minimumSessionDuration", "maximumSessionDuration", "checksum"]) {
      if (model[key] === undefined || model[key] === null || model[key] === "") errors.push({ code: "MISSING_CRITICAL_FIELD", modelCode: model.modelCode, field: key });
    }
    if (model.homologated !== true) errors.push({ code: "MODEL_NOT_HOMOLOGATED", modelCode: model.modelCode });
    if (model.frozen !== true) errors.push({ code: "MODEL_NOT_FROZEN", modelCode: model.modelCode });
    if (!model.essentialEquipment?.length) warnings.push({ code: "EQUIPMENT_DETAIL_LIMITED", modelCode: model.modelCode });
  }
  if (!errors.length) validateModelCatalog(catalog);
  return { valid: errors.length === 0, errors, warnings };
}
