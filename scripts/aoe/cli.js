#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runAOEDecision, activeAplCatalog, listRules } from "../../src/aoe/index.js";
import { CatalogSource } from "../../src/aoe/catalog/index.js";
import { goldenScenarios } from "../../src/aoe/fixtures/profiles/golden-scenarios.js";

function args(argv) {
  const parsed = { _: [] };
  for (let index = 2; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) parsed._.push(value);
    else {
      const key = value.slice(2);
      const next = argv[index + 1];
      if (!next || next.startsWith("--")) parsed[key] = true;
      else {
        parsed[key] = next;
        index += 1;
      }
    }
  }
  return parsed;
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

const options = args(process.argv);

if (options["list-rules"]) {
  const rules = listRules();
  if (options.json) console.log(JSON.stringify(rules, null, 2));
  else rules.forEach((rule) => console.log(`${rule.id} | ${rule.category} | ${rule.title}`));
  process.exit(0);
}

const scenario = options.scenario ? goldenScenarios.find((item) => item.id === options.scenario) : goldenScenarios[0];
const profile = options.profile ? loadJson(options.profile) : scenario?.profile;
const catalog = options.catalog ? loadJson(options.catalog) : activeAplCatalog;
const result = runAOEDecision({
  profile,
  catalog: options["catalog-source"] === "APL_RELEASES" ? undefined : catalog,
  options: {
    requestId: options["request-id"] ?? "aoe-cli",
    now: options.now ?? "2026-07-15T00:00:00.000Z",
    catalogSource: options["catalog-source"] === "APL_RELEASES" ? CatalogSource.APL_RELEASES : undefined,
    projectRoot: process.cwd(),
  },
});

if (options.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`status: ${result.status}`);
  console.log(`selected: ${result.selectedModel?.modelCode ?? "none"}`);
  console.log(`score: ${result.compatibilityScore}`);
  console.log(`confidence: ${result.confidence?.level ?? result.confidenceLevel} (${result.confidence?.score ?? result.confidenceScore})`);
  console.log(`risk: ${result.risk?.level} (${result.risk?.score})`);
  console.log(`ambiguity: ${result.ambiguity?.level}`);
  console.log(`humanReview: ${result.humanReview?.status}`);
  if (result.reasonCodes.length) console.log(`reasons: ${result.reasonCodes.join(", ")}`);
  if (options.explain) console.log(`summary: ${result.explanation?.summary}`);
  if (options.risk) console.log(JSON.stringify(result.risk, null, 2));
  if (options.review) console.log(JSON.stringify(result.humanReview, null, 2));
  if (options.trace) console.log(JSON.stringify(result.decisionTrace, null, 2));
}
