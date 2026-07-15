import fs from "node:fs";
import path from "node:path";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function markdownReport(result, diff) {
  return `# AOE APL Catalog Report

## Summary

| Item | Valor |
|---|---:|
| Adapter version | ${result.versions.catalogAdapter} |
| Releases discovered | ${result.statistics.releasesDiscovered} |
| Releases active | ${result.statistics.releasesActive} |
| Models declared | ${result.statistics.modelsDeclared} |
| Models valid | ${result.statistics.modelsValid} |
| Models invalid | ${result.statistics.modelsInvalid} |
| Checksums valid | ${result.statistics.checksumsValid} |
| Errors | ${result.errors.length} |
| Warnings | ${result.warnings.length} |

## Releases

${result.releases.map((release) => `- ${release.releaseId}@${release.releaseVersion ?? "unknown"}: ${release.status}`).join("\n")}

## Models

${result.catalog.map((model) => `- ${model.modelCode} | ${model.aplRelease} | ${model.split} | ${model.strategy} | ${model.checksum}`).join("\n")}

## Checksum Validation

${result.releases.flatMap((release) => release.checksums.map((item) => `- ${item.modelCode}: ${item.valid ? "valid" : "invalid"}`)).join("\n")}

## Metadata Validation

${result.errors.length ? result.errors.map((error) => `- ERROR ${error.code ?? error.name}: ${error.message ?? JSON.stringify(error)}`).join("\n") : "- No metadata errors."}

## Derived Fields

${result.catalog.flatMap((model) => (model.metadata.derivations ?? []).map((item) => `- ${model.modelCode}: ${item.rule} - ${item.reason}`)).join("\n")}

## Fixture Comparison

${diff.length ? diff.map((item) => `- ${item.modelCode}: ${item.comparisonStatus}${item.field ? ` (${item.field})` : ""}`).join("\n") : "- Fixture and real catalog match on compared fields."}

## Errors

${result.errors.length ? result.errors.map((error) => `- ${error.message ?? JSON.stringify(error)}`).join("\n") : "- None."}

## Warnings

${result.warnings.length ? result.warnings.map((warning) => `- ${warning.message ?? warning.code ?? JSON.stringify(warning)}`).join("\n") : "- None."}
`;
}

export function writeCatalogReports({ result, diff = [], reportsRoot = "reports/aoe" }) {
  ensureDir(reportsRoot);
  const reportJson = path.join(reportsRoot, "apl-catalog-report.json");
  const reportMd = path.join(reportsRoot, "apl-catalog-report.md");
  const diffJson = path.join(reportsRoot, "apl-catalog-diff.json");
  const diffMd = path.join(reportsRoot, "apl-catalog-diff.md");
  fs.writeFileSync(reportJson, JSON.stringify(result, null, 2));
  fs.writeFileSync(reportMd, markdownReport(result, diff));
  fs.writeFileSync(diffJson, JSON.stringify({ changes: diff }, null, 2));
  fs.writeFileSync(diffMd, `# AOE APL Catalog Diff\n\n${diff.length ? diff.map((item) => `- ${item.modelCode}: ${item.comparisonStatus}${item.field ? ` (${item.field})` : ""}`).join("\n") : "No differences."}\n`);
  return { reportJson, reportMd, diffJson, diffMd };
}
