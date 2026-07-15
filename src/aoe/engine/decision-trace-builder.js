import { AOE_VERSION } from "../config/versions.js";

export function buildDecisionTrace({ requestId, startedAt, profile, normalizedCatalog, excluded, ranked, technicalTie, confidence, catalogContext = {} }) {
  return {
    requestId,
    generatedAt: startedAt,
    engineVersion: AOE_VERSION,
    pipeline: [
      "input-validation",
      "profile-normalization",
      "catalog-validation",
      "catalog-normalization",
      "eligibility",
      "exclusion",
      "scoring",
      "ranking",
      "selection",
      "validation",
      "confidence",
      "human-review",
    ],
    profile: {
      studentId: profile.studentId,
      goal: profile.goal,
      experienceLevel: profile.experienceLevel,
      frequency: profile.frequency,
      sessionDuration: profile.sessionDuration,
    },
    catalogSize: normalizedCatalog.length,
    catalogSource: catalogContext.catalogSource ?? "FIXTURE",
    catalogAdapterVersion: catalogContext.catalogAdapterVersion ?? null,
    activeAPLReleases: catalogContext.activeAPLReleases ?? [],
    catalogGeneratedAt: catalogContext.catalogGeneratedAt ?? null,
    catalogChecksumSummary: catalogContext.catalogChecksumSummary ?? null,
    catalogWarnings: catalogContext.catalogWarnings ?? [],
    excluded,
    ranking: ranked.map((item, index) => ({
      rank: index + 1,
      modelCode: item.model.modelCode,
      rawScore: item.rawScore,
      finalScore: item.finalScore,
      warnings: item.warnings,
      penalties: item.penalties,
    })),
    technicalTie,
    confidence,
  };
}
