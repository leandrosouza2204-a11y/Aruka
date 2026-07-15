#!/usr/bin/env node
import { loadAPLCatalog, writeCatalogReports } from "../../src/aoe/catalog/index.js";

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) continue;
    const [key, inline] = value.slice(2).split("=");
    args[key] = inline ?? true;
  }
  return args;
}

function exitCode(result) {
  if (result.status === "READY" || result.status === "READY_WITH_WARNINGS") return 0;
  if (result.errors.some((error) => error.code === "CHECKSUM_MISMATCH")) return 3;
  if (result.status === "PARTIAL_CATALOG") return 4;
  if (result.statistics.releasesActive === 0) return 5;
  return 2;
}

const args = parseArgs(process.argv);
const activeReleases = args.release ? [String(args.release).toUpperCase()] : ["SPRINT_01", "SPRINT_02"];
const result = loadAPLCatalog({
  projectRoot: process.cwd(),
  activeReleases: args["all-releases"] ? ["SPRINT_01", "SPRINT_02"] : activeReleases,
  allowPartialRelease: args["allow-partial"] === true,
  now: "2026-07-15T00:00:00.000Z",
});

if (args.report || args["diff-fixture"] || args.validate) {
  writeCatalogReports({ result, diff: result.fixtureComparison });
}

if (args.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`status: ${result.status}`);
  console.log(`releases: ${result.statistics.releasesActive}/${result.statistics.releasesDiscovered}`);
  console.log(`models: ${result.statistics.modelsValid}/${result.statistics.modelsDeclared}`);
  console.log(`checksums: ${result.statistics.checksumsValid}/${result.statistics.modelsDeclared}`);
  console.log(`errors: ${result.errors.length}`);
  console.log(`warnings: ${result.warnings.length}`);
  if (args.inspect) {
    for (const release of result.releases) {
      console.log(`${release.releaseId}@${release.releaseVersion}: ${release.status} (${release.modelCount} models)`);
    }
  }
  if (args["diff-fixture"]) {
    console.log(`fixtureDiffs: ${result.fixtureComparison.length}`);
  }
}

process.exit(exitCode(result));
