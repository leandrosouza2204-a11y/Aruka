import fs from "node:fs";
import path from "node:path";
import { getVersionRegistry } from "../config/versions.js";
import { activeAplCatalog } from "../fixtures/catalogs/apl-active.catalog.js";
import { parseFreeze } from "./freeze-parser.js";
import { parseManifest } from "./manifest-parser.js";
import { discoverAPLReleases } from "./release-discovery.js";
import { loadReleaseDocuments } from "./release-loader.js";
import { parseModelDocument } from "./model-document-parser.js";
import { validateChecksum } from "./checksum-validator.js";
import { normalizeCatalogModel } from "./catalog-normalizer.js";
import { validateCatalogIntegrity } from "./catalog-validator.js";
import { compareFixtureWithReal } from "./catalog-diff.js";
import { getCatalogCache, setCatalogCache } from "./catalog-cache.js";
import { APL_CATALOG_ADAPTER_VERSION, CatalogStatus } from "./catalog-schema.js";

function rel(projectRoot, filePath) {
  return path.relative(projectRoot, filePath).replace(/\\/g, "/");
}

function releaseVersionFallback(releaseId) {
  return releaseId === "SPRINT_02" ? "2.0.0" : "1.0.0";
}

function cacheKey(options) {
  return JSON.stringify({
    activeReleases: options.activeReleases,
    validateChecksums: options.validateChecksums,
    allowPartialRelease: options.allowPartialRelease,
    adapter: APL_CATALOG_ADAPTER_VERSION,
  });
}

export function loadAPLCatalog({
  projectRoot = process.cwd(),
  releasesRoot = "docs/apl/RELEASES",
  activeReleases = ["SPRINT_01", "SPRINT_02"],
  validateChecksums = true,
  allowPartialRelease = false,
  cache = false,
  now = "2026-07-15T00:00:00.000Z",
} = {}) {
  const options = { activeReleases, validateChecksums, allowPartialRelease };
  const key = cacheKey(options);
  if (cache) {
    const cached = getCatalogCache(key);
    if (cached) return cached;
  }

  const errors = [];
  const warnings = [];
  const discovered = discoverAPLReleases({ projectRoot, releasesRoot });
  const releases = [];
  const catalog = [];
  let modelsDeclared = 0;
  let checksumsValid = 0;

  for (const candidate of discovered.filter((release) => activeReleases.includes(release.releaseId))) {
    const releaseSummary = {
      releaseId: candidate.releaseId,
      releaseVersion: null,
      sprint: Number(candidate.releaseId.match(/\d+/)?.[0] ?? 0),
      status: "CANDIDATE",
      level: candidate.releaseId === "SPRINT_02" ? "INTERMEDIATE" : "BEGINNER",
      goal: "HYPERTROPHY",
      sex: "MALE",
      frozenAt: null,
      manifestPath: null,
      freezePath: null,
      modelsPath: `docs/apl/${candidate.releaseId}`,
      modelCount: 0,
      checksums: [],
      metadata: {},
      valid: false,
    };
    try {
      const loaded = loadReleaseDocuments(candidate);
      const freeze = parseFreeze(loaded.freeze);
      const manifest = parseManifest(loaded.manifest, { manifestPath: loaded.manifestPath, projectRoot });
      releaseSummary.releaseVersion = manifest.releaseVersion ?? releaseVersionFallback(candidate.releaseId);
      releaseSummary.status = manifest.status ?? freeze.status;
      releaseSummary.frozenAt = manifest.frozenAt;
      releaseSummary.manifestPath = rel(projectRoot, loaded.manifestPath);
      releaseSummary.manifestRelativePath = releaseSummary.manifestPath;
      releaseSummary.freezePath = rel(projectRoot, loaded.freezePath);
      releaseSummary.modelCount = manifest.models.length;
      releaseSummary.metadata = { freeze };
      modelsDeclared += manifest.models.length;

      const releaseModels = [];
      for (const item of manifest.models) {
        if (!fs.existsSync(item.absolutePath)) {
          errors.push({ code: "MODEL_FILE_MISSING", releaseId: candidate.releaseId, modelCode: item.modelCode, file: item.file });
          continue;
        }
        if (!item.checksum) {
          errors.push({ code: "CHECKSUM_MISSING", releaseId: candidate.releaseId, modelCode: item.modelCode });
          continue;
        }
        const checksum = validateChecksums ? validateChecksum(item.absolutePath, item.checksum) : { expected: item.checksum, actual: item.checksum.toLowerCase(), valid: true };
        releaseSummary.checksums.push({ modelCode: item.modelCode, ...checksum });
        if (!checksum.valid) {
          errors.push({ code: "CHECKSUM_MISMATCH", releaseId: candidate.releaseId, modelCode: item.modelCode, file: item.file, expected: checksum.expected, actual: checksum.actual });
          continue;
        }
        checksumsValid += 1;
        const document = parseModelDocument(fs.readFileSync(item.absolutePath, "utf8"));
        const normalized = normalizeCatalogModel({ release: releaseSummary, manifestItem: item, document, checksum, now });
        releaseModels.push(normalized);
      }

      const releaseErrors = errors.filter((error) => error.releaseId === candidate.releaseId);
      releaseSummary.valid = freeze.frozen && /homologad/i.test(releaseSummary.status) && releaseErrors.length === 0 && releaseModels.length === manifest.models.length;
      if (releaseSummary.valid || allowPartialRelease) {
        catalog.push(...releaseModels);
        releaseSummary.status = releaseSummary.valid ? "ACTIVE" : "PARTIAL";
      } else {
        releaseSummary.status = "INVALID";
      }
    } catch (error) {
      errors.push({ code: error.name ?? "RELEASE_LOAD_ERROR", releaseId: candidate.releaseId, message: error.message, details: error.details ?? {} });
      releaseSummary.status = "INVALID";
    }
    releases.push(releaseSummary);
  }

  const sortedCatalog = catalog.sort((a, b) => a.modelCode.localeCompare(b.modelCode));
  const validation = validateCatalogIntegrity(sortedCatalog);
  errors.push(...validation.errors);
  warnings.push(...validation.warnings);
  const releasesActive = releases.filter((release) => release.status === "ACTIVE").length;
  const status = errors.length
    ? (allowPartialRelease && sortedCatalog.length ? CatalogStatus.PARTIAL_CATALOG : CatalogStatus.INVALID_RELEASE)
    : (warnings.length ? CatalogStatus.READY_WITH_WARNINGS : CatalogStatus.READY);
  const result = {
    status,
    catalog: sortedCatalog,
    releases,
    errors,
    warnings,
    fixtureComparison: compareFixtureWithReal(activeAplCatalog, sortedCatalog),
    statistics: {
      releasesDiscovered: discovered.length,
      releasesActive,
      modelsDeclared,
      modelsValid: sortedCatalog.length,
      modelsInvalid: Math.max(0, modelsDeclared - sortedCatalog.length),
      checksumsValid,
      checksumsInvalid: Math.max(0, modelsDeclared - checksumsValid),
    },
    versions: {
      ...getVersionRegistry(),
      catalogAdapter: APL_CATALOG_ADAPTER_VERSION,
    },
    generatedAt: now,
  };
  return cache ? setCatalogCache(key, result) : result;
}
