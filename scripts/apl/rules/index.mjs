import path from "node:path";
import { pathToFileURL } from "node:url";
import { RULES_DIRECTORY } from "../config.mjs";
import { listMarkdown, walk } from "../utils/files.mjs";
import { AqaFatalError, validateRuleDefinition } from "./rule-contract.mjs";

const ignoredFiles = new Set(["index.mjs", "rule-contract.mjs", "rule-contract.test.mjs"]);

async function listRuleFiles(rulesDirectory = RULES_DIRECTORY) {
  const files = await walk(rulesDirectory);
  return files
    .filter((file) => path.extname(file) === ".mjs")
    .filter((file) => !ignoredFiles.has(path.basename(file)))
    .filter((file) => !path.basename(file).startsWith("_"))
    .sort();
}

export { validateRuleDefinition };

export function sortRules(rules) {
  return [...rules].sort((a, b) => a.id.localeCompare(b.id));
}

export function filterRules(rules, options = {}) {
  const ids = new Set(options.ruleIds ?? []);
  const tags = new Set(options.tags ?? []);

  return rules.filter((rule) => {
    const matchesId = ids.size === 0 || ids.has(rule.id);
    const matchesTag = tags.size === 0 || rule.tags.some((tag) => tags.has(tag));
    return matchesId && matchesTag;
  });
}

export async function loadRules(options = {}) {
  const diagnostics = [];
  const allRules = [];
  const enabledRules = [];
  const ids = new Set();
  const files = await listRuleFiles(options.rulesDirectory ?? RULES_DIRECTORY);

  for (const file of files) {
    let rule;
    try {
      const module = await import(pathToFileURL(file).href);
      rule = module.default;
      validateRuleDefinition(rule, file);
    } catch (err) {
      throw new AqaFatalError(`Falha ao carregar regra ${file}: ${err.message}`);
    }

    if (ids.has(rule.id)) throw new AqaFatalError(`ID de regra duplicado: ${rule.id}`);
    ids.add(rule.id);
    allRules.push({ ...rule, file });

    if (!rule.enabled) {
      diagnostics.push({
        severity: "info",
        message: `Regra desabilitada: ${rule.id}`,
        ruleId: rule.id,
        file,
      });
      continue;
    }

    enabledRules.push({ ...rule, file });
  }

  return {
    allRules: sortRules(allRules),
    rules: sortRules(filterRules(enabledRules, options)),
    diagnostics,
  };
}
