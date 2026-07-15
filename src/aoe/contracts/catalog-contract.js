import { AOECatalogError } from "../domain/errors.js";

export function validateModelCatalog(catalog) {
  if (!Array.isArray(catalog)) throw new AOECatalogError("Catalog must be an array.");
  const codes = new Set();
  const errors = [];
  for (const model of catalog) {
    if (!model.modelCode) errors.push("modelCode missing.");
    if (codes.has(model.modelCode)) errors.push(`duplicate modelCode: ${model.modelCode}`);
    codes.add(model.modelCode);
    for (const key of ["modelVersion", "aplRelease", "status", "sex", "goal", "experienceLevel", "split", "strategy", "frequency", "minimumSessionDuration", "maximumSessionDuration"]) {
      if (model[key] === undefined || model[key] === null || model[key] === "") errors.push(`${model.modelCode || "model"} missing ${key}.`);
    }
  }
  if (errors.length) throw new AOECatalogError(errors.join(" "));
  return true;
}
