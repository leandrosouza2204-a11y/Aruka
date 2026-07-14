import path from "node:path";
import {
  DEFAULT_CONTINUE_ON_FATAL,
  DEFAULT_MIN_SEVERITY,
  DEFAULT_STRICT_MODE,
  ROOT_DOCS,
  ROOT_REPORTS,
  VERSION,
} from "./config.mjs";
import { parseMarkdown } from "./parser.mjs";
import { scanAll, scanBlock, scanSprint } from "./scanner.mjs";
import { read } from "./utils/files.mjs";
import * as logger from "./utils/logger.mjs";
import { loadRules } from "./rules/index.mjs";
import {
  AqaFatalError,
  getSeverityWeight,
  normalizeFinding,
  RULE_SCOPES,
  SEVERITIES,
  sortFindings,
} from "./rules/rule-contract.mjs";

function flattenFiles(scanResult) {
  return scanResult.sprints.flatMap((sprint) =>
    sprint.blocks.flatMap((block) =>
      block.files.map((file) => ({
        sprint: sprint.sprint,
        block: block.name,
        file,
      })),
    ),
  );
}

async function createScanResult(options) {
  if (options.block) {
    const sprint = await scanBlock(options);
    return { root: options.rootDocs, sprints: [sprint] };
  }
  if (options.sprint) {
    const sprint = await scanSprint(options);
    return { root: options.rootDocs, sprints: [sprint] };
  }
  return scanAll(options);
}

function deriveModelCode(file) {
  const name = path.basename(file, ".md");
  return name.startsWith("APL-") ? name : undefined;
}

async function readProjectStatus(rootDocs) {
  const file = path.resolve(rootDocs, "PROJECT_STATUS.md");
  try {
    const document = await parseMarkdown(file);
    return Object.freeze({ file, document });
  } catch {
    return null;
  }
}

function freezeArray(items) {
  return Object.freeze(items.map((item) => Object.freeze(item)));
}

function createHelpers(documents, projectStatus, diagnostics) {
  return Object.freeze({
    findDocumentByFile(file) {
      const expected = path.resolve(file);
      return documents.find((document) => path.resolve(document.file) === expected);
    },
    findDocumentsBySprint(sprint) {
      return documents.filter((document) => document.sprint === sprint);
    },
    findDocumentsByBlock(block) {
      return documents.filter((document) => document.block === block);
    },
    findDocumentByModelCode(modelCode) {
      return documents.find((document) => document.document.metadata.modelCode === modelCode);
    },
    getAllModelDocuments() {
      return documents.filter((document) => Boolean(document.document.metadata.modelCode));
    },
    getAllReadmes() {
      return documents.filter((document) => path.basename(document.file).toLowerCase() === "readme.md");
    },
    getProjectStatusDocument() {
      return projectStatus;
    },
    addDiagnostic(diagnostic) {
      diagnostics.push({
        severity: diagnostic?.severity ?? SEVERITIES.INFO,
        message: diagnostic?.message ?? "Diagnostico sem mensagem",
        metadata: diagnostic?.metadata ?? {},
      });
    },
  });
}

function createContext(options, startedAt, scanResult, documents, projectStatus, diagnostics) {
  const frozenDocuments = freezeArray(documents);
  return Object.freeze({
    version: options.version ?? VERSION,
    options: Object.freeze({ ...options }),
    startedAt,
    rootDocs: options.rootDocs ?? ROOT_DOCS,
    rootReports: options.rootReports ?? ROOT_REPORTS,
    target: options.target ?? "all",
    scanResult: Object.freeze(scanResult),
    documents: frozenDocuments,
    projectStatus,
    logger,
    helpers: createHelpers(frozenDocuments, projectStatus, diagnostics),
  });
}

function statusFromFindings(findings, diagnostics, strict) {
  const hasFatal = findings.some((finding) => finding.severity === SEVERITIES.FATAL) ||
    diagnostics.some((diagnostic) => diagnostic.severity === SEVERITIES.FATAL);
  const hasError = findings.some((finding) => finding.severity === SEVERITIES.ERROR);
  const hasWarning = findings.some((finding) => finding.severity === SEVERITIES.WARNING);

  if (hasFatal) return { status: "FATAL", exitCode: 2 };
  if (hasError) return { status: "FAILED", exitCode: 1 };
  if (hasWarning) return { status: "PASSED_WITH_WARNINGS", exitCode: strict ? 1 : 0 };
  return { status: "PASSED", exitCode: 0 };
}

function countBy(items, keyFactory) {
  const counts = {};
  for (const item of items) {
    const key = keyFactory(item);
    if (!key) continue;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function buildStatistics(result, ruleRuns) {
  const slowest = ruleRuns.reduce((current, rule) => (!current || rule.durationMs > current.durationMs ? rule : current), null);
  return {
    rules: {
      loaded: result.rulesLoaded,
      executed: result.rulesExecuted,
      skipped: result.rulesSkipped,
      findingsByRule: countBy(result.findings, (finding) => finding.ruleId),
    },
    findings: {
      bySeverity: countBy(result.findings, (finding) => finding.severity),
      bySprint: countBy(result.findings, (finding) => finding.sprint),
      byBlock: countBy(result.findings, (finding) => finding.block),
      byFile: countBy(result.findings, (finding) => finding.file),
    },
    targets: {
      filesScanned: result.filesScanned,
      documentsParsed: result.documentsParsed,
    },
    performance: {
      durationMs: result.durationMs,
      byRule: Object.fromEntries(ruleRuns.map((rule) => [rule.id, rule.durationMs])),
      slowestRule: slowest ? { id: slowest.id, durationMs: slowest.durationMs } : null,
    },
  };
}

async function executeRules(rules, context, options, diagnostics) {
  const findings = [];
  const ruleRuns = [];

  for (const rule of rules) {
    const started = performance.now();
    try {
      logger.ruleStart(rule);
      const returnedFindings = await rule.run(context);
      if (!Array.isArray(returnedFindings)) {
        throw new AqaFatalError(`Regra ${rule.id} retornou valor que nao e Array`);
      }

      const normalized = returnedFindings.map((finding) =>
        normalizeFinding(finding, {
          ruleId: rule.id,
          severity: rule.severity,
          scope: rule.scope ?? RULE_SCOPES.DOCUMENT,
        }),
      );
      findings.push(...normalized);

      const durationMs = Math.round(performance.now() - started);
      ruleRuns.push({
        id: rule.id,
        name: rule.name,
        severity: rule.severity,
        scope: rule.scope,
        findings: normalized.length,
        durationMs,
      });
      normalized.length ? logger.ruleWarning(rule, normalized.length) : logger.ruleSuccess(rule, durationMs);
    } catch (err) {
      const durationMs = Math.round(performance.now() - started);
      const message = `Falha fatal na regra ${rule.id}: ${err.message}`;
      diagnostics.push({ severity: SEVERITIES.FATAL, ruleId: rule.id, message });
      findings.push(
        normalizeFinding({
          ruleId: rule.id,
          severity: SEVERITIES.FATAL,
          scope: rule.scope,
          message,
        }),
      );
      ruleRuns.push({ id: rule.id, name: rule.name, severity: rule.severity, scope: rule.scope, findings: 1, durationMs });
      logger.ruleError(rule, err);
      if (!(options.continueOnFatal ?? DEFAULT_CONTINUE_ON_FATAL)) break;
    }
  }

  return { findings, ruleRuns };
}

export function filterFindingsForDisplay(findings, minSeverity = DEFAULT_MIN_SEVERITY) {
  const minWeight = getSeverityWeight(minSeverity);
  return findings.filter((finding) => getSeverityWeight(finding.severity) >= minWeight);
}

export async function runAudit(options = {}) {
  const startedAt = new Date();
  const started = performance.now();
  const diagnostics = [];

  try {
    const scanResult = await createScanResult(options);
    const fileRefs = flattenFiles(scanResult);
    const documents = [];

    for (const fileRef of fileRefs) {
      const document = await parseMarkdown(fileRef.file);
      documents.push({
        ...fileRef,
        document: {
          ...document,
          metadata: {
            ...document.metadata,
            modelCode: deriveModelCode(fileRef.file),
          },
        },
      });
    }

    const projectStatus = await readProjectStatus(options.rootDocs ?? ROOT_DOCS);
    const context = createContext(options, startedAt, scanResult, documents, projectStatus, diagnostics);
    const loaded = await loadRules(options);
    diagnostics.push(...loaded.diagnostics);
    const { findings, ruleRuns } = await executeRules(loaded.rules, context, options, diagnostics);
    const finishedAt = new Date();

    const result = {
      version: options.version ?? VERSION,
      target: options.target ?? "all",
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: Math.round(performance.now() - started),
      filesScanned: fileRefs.length,
      documentsParsed: documents.length,
      rulesLoaded: loaded.rules.length,
      rulesAvailable: loaded.allRules.length,
      rulesExecuted: ruleRuns.length,
      rulesSkipped: loaded.allRules.length - loaded.rules.length,
      rules: loaded.allRules.map((rule) => ({
        id: rule.id,
        name: rule.name,
        description: rule.description,
        severity: rule.severity,
        scope: rule.scope,
        enabled: rule.enabled,
        tags: rule.tags,
      })),
      ruleRuns,
      findings: sortFindings(findings),
      diagnostics,
      statistics: {},
      status: "PASSED",
      exitCode: 0,
    };

    const status = statusFromFindings(result.findings, diagnostics, options.strict ?? DEFAULT_STRICT_MODE);
    result.status = status.status;
    result.exitCode = status.exitCode;
    result.statistics = buildStatistics(result, ruleRuns);
    return result;
  } catch (err) {
    const finishedAt = new Date();
    const message = err instanceof AqaFatalError ? err.message : `Erro fatal de infraestrutura: ${err.message}`;
    return {
      version: options.version ?? VERSION,
      target: options.target ?? "all",
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: Math.round(performance.now() - started),
      filesScanned: 0,
      documentsParsed: 0,
      rulesLoaded: 0,
      rulesAvailable: 0,
      rulesExecuted: 0,
      rulesSkipped: 0,
      rules: [],
      ruleRuns: [],
      findings: [],
      diagnostics: [{ severity: SEVERITIES.FATAL, message }],
      statistics: { rules: {}, findings: {}, targets: {}, performance: {} },
      status: "FATAL",
      exitCode: 2,
    };
  }
}
