import path from "node:path";
import { normalizeText } from "./rules/rule-utils.mjs";

export const OFFICIAL_SECTION_ALIASES = Object.freeze({
  "Resumo Executivo": ["resumo executivo"],
  "Problema que resolve": ["problema que resolve"],
  "Quando utilizar": ["quando utilizar"],
  "Quando evitar": ["quando evitar"],
  "Público-alvo": ["publico-alvo", "publico alvo"],
  "Pré-requisitos": ["pre-requisitos", "pre requisitos"],
  "Filosofia": ["filosofia"],
  "Objetivo principal": ["objetivo principal"],
  "Objetivos secundários": ["objetivos secundarios"],
  "Metadados": ["metadados"],
  "Estrutura semanal": ["estrutura semanal"],
  "Diretrizes": ["diretrizes"],
  "Periodização": ["periodizacao"],
  "Progressão": ["progressao"],
  "Treinos": ["treinos", "treinos completos"],
  "Volume semanal": ["volume semanal"],
  "Distribuição dos padrões de movimento": ["distribuicao dos padroes de movimento", "distribuicao da frequencia"],
  "Referências futuras ao AOE": ["referencias futuras ao aoe"],
  "Aruka Coaching Notes": ["aruka coaching notes", "coaching notes"],
  "Critérios de evolução": ["criterios de evolucao"],
  "Aruka Score": ["aruka score"],
  "Engenharia do treino": ["engenharia do treino", "justificativa tecnica"],
  "Checklist": ["checklist"],
  "Assinatura Técnica": ["assinatura tecnica"],
  "Tags": ["tags"],
});

export const SESSION_SUBSECTIONS = Object.freeze(["Objetivo da sessão", "Prescrição", "Justificativa"]);

const SESSION_PATTERN = /^(treino\s+[a-e]|upper\s+[ab]|lower\s+[ab]|full\s+body\s+[abc])\s*(?:[-–—].*)?$/i;

function canonicalKey(title) {
  return normalizeText(title).replace(/\s+/g, " ").trim();
}

export function normalizeHeadingTitle(title) {
  return canonicalKey(String(title ?? "").replace(/^#+\s*/, ""));
}

export function resolveOfficialSectionName(title) {
  const normalized = normalizeHeadingTitle(title);
  for (const [official, aliases] of Object.entries(OFFICIAL_SECTION_ALIASES)) {
    if (aliases.some((alias) => normalizeHeadingTitle(alias) === normalized)) return official;
  }
  return null;
}

export function matchesOfficialSection(title, officialName) {
  return resolveOfficialSectionName(title) === officialName;
}

export function isTrainingSessionHeading(heading) {
  return heading?.level === 3 && SESSION_PATTERN.test(normalizeHeadingTitle(heading.text ?? heading.title));
}

export function classifyDocument(file, metadata = {}) {
  const basename = path.basename(file).toLowerCase();
  const normalized = file.replace(/\\/g, "/").toLowerCase();
  if (metadata.modelCode || path.basename(file, ".md").startsWith("APL-")) return "model";
  if (basename === "readme.md") return "readme";
  if (basename === "project_status.md") return "project-status";
  if (normalized.includes("/standards/")) return "standard";
  if (normalized.includes("/reports/")) return "report";
  return "unknown";
}

function parseTable(lines, startIndex) {
  const tableLines = [];
  let index = startIndex;
  while (index < lines.length && /^\s*\|.+\|\s*$/.test(lines[index])) {
    tableLines.push(lines[index]);
    index += 1;
  }
  const rows = tableLines.map((line) =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => cell.trim()),
  );
  return {
    startLine: startIndex + 1,
    endLine: index,
    headers: rows[0] ?? [],
    rows: rows.slice(2).filter((row) => row.some(Boolean)),
    rawLines: tableLines,
  };
}

function nearestHeading(root, line) {
  const nodes = [];
  function visit(node) {
    if (node.line <= line && line <= node.endLine) nodes.push(node);
    for (const child of node.children) visit(child);
  }
  visit(root);
  return nodes.sort((a, b) => b.level - a.level)[0] ?? root;
}

function nearestAncestor(node, predicate) {
  let current = node;
  while (current) {
    if (predicate(current)) return current;
    current = current.parent;
  }
  return null;
}

function contextTypeForTable(heading) {
  const official = resolveOfficialSectionName(heading.title);
  if (heading.level === 4 && normalizeHeadingTitle(heading.title) === normalizeHeadingTitle("Prescrição")) return "prescription";
  if (official === "Metadados") return "metadata";
  if (official === "Estrutura semanal") return "weekly-structure";
  if (official === "Volume semanal") return "volume";
  if (official === "Aruka Score") return "score";
  if (official === "Progressão" || official === "Periodização") return "progression";
  if (official === "Distribuição dos padrões de movimento") return "movement-patterns";
  if (heading.title && /compar/i.test(heading.title)) return "comparison";
  return "generic";
}

export function buildDocumentContext(parsedDocument) {
  const lines = parsedDocument.normalized.split("\n");
  const root = {
    level: 0,
    title: "Document",
    normalizedTitle: "document",
    line: 1,
    endLine: lines.length,
    parent: null,
    children: [],
    content: parsedDocument.normalized,
    tables: [],
  };
  const stack = [root];
  const nodes = [];

  for (const heading of parsedDocument.headings) {
    while (stack.at(-1).level >= heading.level) stack.pop();
    const parent = stack.at(-1);
    const node = {
      level: heading.level,
      title: heading.text,
      normalizedTitle: normalizeHeadingTitle(heading.text),
      officialTitle: resolveOfficialSectionName(heading.text),
      line: heading.line,
      endLine: lines.length,
      parent,
      children: [],
      content: "",
      tables: [],
    };
    parent.children.push(node);
    nodes.push(node);
    stack.push(node);
  }

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    const next = nodes.find((candidate) => candidate.line > node.line && candidate.level <= node.level);
    node.endLine = next ? next.line - 1 : lines.length;
    node.content = lines.slice(node.line, node.endLine).join("\n").trim();
  }

  const tables = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (!/^\s*\|.+\|\s*$/.test(lines[index])) continue;
    const table = parseTable(lines, index);
    index = table.endLine - 1;
    const parentHeading = nearestHeading(root, table.startLine);
    const parentSection = nearestAncestor(parentHeading, (node) => node.level === 2);
    const parentSession = nearestAncestor(parentHeading, isTrainingSessionHeading);
    const contextType = parentSession && contextTypeForTable(parentHeading) === "prescription" ? "prescription" : contextTypeForTable(parentSection ?? parentHeading);
    const enriched = { ...table, parentHeading, parentSection, parentSession, contextType };
    tables.push(enriched);
    parentHeading.tables.push(enriched);
  }

  return {
    document: parsedDocument,
    root,
    headings: nodes,
    tables,
    documentType: classifyDocument(parsedDocument.file, parsedDocument.metadata),
  };
}

export function getTopLevelSections(context) {
  return context.headings.filter((node) => node.level === 2);
}

export function getTrainingSection(context) {
  return getTopLevelSections(context).find((section) => section.officialTitle === "Treinos") ?? null;
}

export function getTrainingSessions(context) {
  const training = getTrainingSection(context);
  if (!training) return [];
  return training.children.filter(isTrainingSessionHeading);
}

export function getSessionByTitle(context, title) {
  const expected = normalizeHeadingTitle(title);
  return getTrainingSessions(context).find((session) => session.normalizedTitle === expected) ?? null;
}

export function getSessionSubsection(session, subsectionTitle) {
  const expected = normalizeHeadingTitle(subsectionTitle);
  return session?.children.find((child) => child.level === 4 && child.normalizedTitle === expected) ?? null;
}

export function getTablesInsideSection(section) {
  return section?.tables ?? [];
}

export function getPrescriptionTables(session) {
  const subsection = getSessionSubsection(session, "Prescrição");
  return subsection?.tables.filter((table) => table.contextType === "prescription") ?? [];
}

export function getNonPrescriptionTables(context) {
  return context.tables.filter((table) => table.contextType !== "prescription");
}

export function findSectionOccurrences(context, title, options = {}) {
  const expected = resolveOfficialSectionName(title) ?? title;
  return context.headings.filter((heading) => {
    if (options.level && heading.level !== options.level) return false;
    return (resolveOfficialSectionName(heading.title) ?? heading.title) === expected;
  });
}
