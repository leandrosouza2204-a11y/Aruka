import {
  DEFAULT_MIN_SEVERITY,
  DEFAULT_REPORT_FORMAT,
  DEFAULT_STRICT_MODE,
  ROOT_DOCS,
  ROOT_REPORTS,
  SUPPORTED_REPORT_FORMATS,
  SUPPORTED_SPRINTS,
  VERSION,
} from "./config.mjs";
import { runAudit } from "./engine.mjs";
import { saveReports, printConsoleReport } from "./report.mjs";
import { loadRules } from "./rules/index.mjs";
import { isValidSeverity } from "./rules/rule-contract.mjs";
import { error, info, section, success, table } from "./utils/logger.mjs";

function splitCsv(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function helpText() {
  return [
    "AQA - Aruka Quality Assurance",
    "",
    "Uso:",
    "  node scripts/apl/audit.mjs [--all] [--sprint=1] [--block=ABC]",
    "  node scripts/apl/audit.mjs --list-rules",
    "",
    "Opcoes:",
    "  --rule=rule-id              Executa uma regra especifica",
    "  --rules=rule-a,rule-b       Executa regras especificas",
    "  --tag=tag                   Filtra regras por tag",
    "  --tags=a,b                  Filtra regras por tags",
    "  --severity=warning          Severidade minima exibida no relatorio",
    "  --report-format=markdown    markdown, json ou both",
    "  --no-report                 Nao grava relatorio",
    "  --strict                    WARNING retorna exit code 1",
    "  --help                      Exibe esta ajuda",
    "",
  ].join("\n");
}

function parseArgs(args) {
  const options = {
    all: false,
    sprint: null,
    block: null,
    ruleIds: [],
    tags: [],
    minSeverity: DEFAULT_MIN_SEVERITY,
    noReport: false,
    reportFormat: DEFAULT_REPORT_FORMAT,
    strict: DEFAULT_STRICT_MODE,
    listRules: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === "--all") options.all = true;
    else if (arg === "--help") options.help = true;
    else if (arg === "--list-rules") options.listRules = true;
    else if (arg === "--no-report") options.noReport = true;
    else if (arg === "--strict") options.strict = true;
    else if (arg.startsWith("--sprint=")) options.sprint = Number(arg.split("=")[1]);
    else if (arg.startsWith("--block=")) options.block = arg.split("=")[1].trim();
    else if (arg.startsWith("--rule=")) options.ruleIds.push(arg.split("=")[1].trim());
    else if (arg.startsWith("--rules=")) options.ruleIds.push(...splitCsv(arg.split("=")[1]));
    else if (arg.startsWith("--tag=")) options.tags.push(arg.split("=")[1].trim());
    else if (arg.startsWith("--tags=")) options.tags.push(...splitCsv(arg.split("=")[1]));
    else if (arg.startsWith("--severity=")) options.minSeverity = arg.split("=")[1].trim().toLowerCase();
    else if (arg.startsWith("--report-format=")) options.reportFormat = arg.split("=")[1].trim().toLowerCase();
    else throw new Error(`Argumento invalido: ${arg}`);
  }

  if (options.sprint && !SUPPORTED_SPRINTS.includes(options.sprint)) {
    throw new Error(`Sprint nao suportada: ${options.sprint}`);
  }
  if (options.block && !options.sprint) {
    throw new Error("--block exige --sprint");
  }
  if (!isValidSeverity(options.minSeverity)) {
    throw new Error(`Severidade invalida: ${options.minSeverity}`);
  }
  if (!SUPPORTED_REPORT_FORMATS.includes(options.reportFormat)) {
    throw new Error(`Formato de relatorio invalido: ${options.reportFormat}`);
  }

  options.ruleIds = [...new Set(options.ruleIds.filter(Boolean))];
  options.tags = [...new Set(options.tags.filter(Boolean))];
  return options;
}

function targetFromOptions(options) {
  if (options.sprint && options.block) {
    return `sprint${String(options.sprint).padStart(2, "0")}-${options.block.toLowerCase()}`;
  }
  if (options.sprint) return `sprint${String(options.sprint).padStart(2, "0")}`;
  return "all";
}

async function listRules(options) {
  const loaded = await loadRules({ ...options, includeDisabled: true });
  section("AQA Rules");
  table(
    loaded.allRules.map((rule) => ({
      ID: rule.id,
      Severity: rule.severity,
      Scope: rule.scope,
      Enabled: rule.enabled,
      Tags: rule.tags.join(","),
      Description: rule.description,
    })),
  );
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    error(err.message);
    process.exit(2);
  }

  if (args.help) {
    console.log(helpText());
    return;
  }

  section("Aruka Quality Assurance");
  info(`Versao ${VERSION}`);

  if (args.listRules) {
    try {
      await listRules(args);
      process.exitCode = 0;
    } catch (err) {
      error(err.message);
      process.exit(2);
    }
    return;
  }

  const result = await runAudit({
    ...args,
    rootDocs: ROOT_DOCS,
    rootReports: ROOT_REPORTS,
    version: VERSION,
    target: targetFromOptions(args),
  });
  const reports = await saveReports(result, { ...args, rootReports: ROOT_REPORTS });

  printConsoleReport(result);
  for (const reportPath of reports) success(`Relatorio salvo em ${reportPath}`);
  process.exitCode = result.exitCode;
}

main().catch((err) => {
  error(err.message);
  process.exit(2);
});
