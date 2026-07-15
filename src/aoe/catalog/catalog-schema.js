export const APL_CATALOG_ADAPTER_VERSION = "1.3.0";

export const CatalogStatus = Object.freeze({
  READY: "READY",
  READY_WITH_WARNINGS: "READY_WITH_WARNINGS",
  INVALID_RELEASE: "INVALID_RELEASE",
  CATALOG_UNAVAILABLE: "CATALOG_UNAVAILABLE",
  PARTIAL_CATALOG: "PARTIAL_CATALOG",
});

export const CatalogSource = Object.freeze({
  PROVIDED: "PROVIDED",
  APL_RELEASES: "APL_RELEASES",
  FIXTURE: "FIXTURE",
});

export const CATALOG_DERIVATION_RULES = Object.freeze([
  { id: "CAT-DER-001", title: "Adherence Demand by Frequency" },
  { id: "CAT-DER-002", title: "Complexity by Strategy" },
  { id: "CAT-DER-003", title: "Recovery Demand by Strategy" },
  { id: "CAT-DER-004", title: "Specialization Target from Model Code" },
  { id: "CAT-DER-005", title: "Equipment Profile from Metadata" },
  { id: "CAT-DER-006", title: "Operational Complexity for Efficiency" },
  { id: "CAT-DER-007", title: "Progression Readiness by Level" },
  { id: "CAT-DER-008", title: "Minimum Experience by Level" },
]);
