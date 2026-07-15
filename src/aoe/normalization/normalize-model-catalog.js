import { validateModelCatalog } from "../contracts/catalog-contract.js";
import { deepFreeze } from "../utils/deep-freeze.js";

export function normalizeModelCatalog(catalog, activeReleases = ["SPRINT_01", "SPRINT_02"]) {
  validateModelCatalog(catalog);
  return deepFreeze(catalog
    .filter((model) => activeReleases.includes(model.aplRelease))
    .map((model) => ({
      ...model,
      essentialEquipment: [...(model.essentialEquipment ?? [])].sort(),
      adaptableEquipment: [...(model.adaptableEquipment ?? [])].sort(),
      methods: [...(model.methods ?? [])].sort(),
      homologated: model.homologated === true,
    }))
    .sort((a, b) => a.modelCode.localeCompare(b.modelCode)));
}
