import path from "node:path";
import { removeCodeBlocks } from "../utils/markdown.mjs";
import { createFinding, SEVERITIES } from "./rule-contract.mjs";

export const EXPECTED_BLOCKS = Object.freeze(["ABC", "ABCD", "ABCDE", "FULL_BODY", "UPPER_LOWER"]);

export const PREMIUM_SECTIONS = Object.freeze([
  "Resumo Executivo",
  "Problema que resolve",
  "Quando utilizar",
  "Quando evitar",
  "Pre-requisitos",
  "Objetivo principal",
  "Objetivos secundarios",
  "Metadados",
  "Estrutura semanal",
  "Diretrizes",
  "Periodizacao",
  "Progressao",
  "Treinos",
  "Objetivo da sessao",
  "Prescricao",
  "Justificativa",
  "Volume semanal",
  "Coaching Notes",
  "Criterios de evolucao",
  "Aruka Score",
  "Checklist",
  "Assinatura Tecnica",
  "Tags",
]);

export function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function isModelDocument(documentRef) {
  return Boolean(documentRef.document.metadata.modelCode);
}

export function sectionByName(documentRef, name) {
  const expected = normalizeText(name);
  return documentRef.document.sections.find((section) => normalizeText(section.title) === expected);
}

export function hasSection(documentRef, name) {
  return Boolean(sectionByName(documentRef, name));
}

export function lineOfText(documentRef, text) {
  const expected = normalizeText(text);
  const lines = documentRef.document.normalized.split("\n");
  const index = lines.findIndex((line) => normalizeText(line).includes(expected));
  return index >= 0 ? index + 1 : undefined;
}

export function modelFinding(documentRef, ruleId, severity, message, details = {}) {
  return createFinding({
    ruleId,
    severity,
    scope: details.scope ?? "model",
    message,
    file: documentRef.file,
    sprint: documentRef.sprint,
    block: documentRef.block,
    modelCode: documentRef.document.metadata.modelCode,
    line: details.line,
    section: details.section,
    excerpt: details.excerpt,
    suggestion: details.suggestion,
    metadata: details.metadata ?? {},
  });
}

export function sprintNumber(sprintName) {
  return Number(/SPRINT_(\d+)/.exec(sprintName)?.[1] ?? 0);
}

export function tableBlocks(markdown) {
  const lines = markdown.split("\n");
  const blocks = [];
  let current = [];
  let startLine = 0;

  lines.forEach((line, index) => {
    if (/^\s*\|.+\|\s*$/.test(line)) {
      if (!current.length) startLine = index + 1;
      current.push(line);
      return;
    }
    if (current.length) {
      blocks.push({ lines: current, startLine });
      current = [];
    }
  });

  if (current.length) blocks.push({ lines: current, startLine });
  return blocks;
}

export function parseTable(block) {
  const rows = block.lines.map((line) =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => cell.trim()),
  );
  const headers = rows[0] ?? [];
  const body = rows.slice(2).filter((row) => row.some(Boolean));
  return { headers, body, startLine: block.startLine };
}

export function containsMethod(text, method) {
  return normalizeText(text).includes(normalizeText(method));
}

export function contentWithoutCode(documentRef) {
  return removeCodeBlocks(documentRef.document.normalized);
}

export function basename(file) {
  return path.basename(file);
}

export function countOccurrences(text, pattern) {
  return (normalizeText(text).match(new RegExp(normalizeText(pattern), "g")) ?? []).length;
}

export function warningFinding(documentRef, ruleId, message, details = {}) {
  return modelFinding(documentRef, ruleId, SEVERITIES.WARNING, message, details);
}

export function errorFinding(documentRef, ruleId, message, details = {}) {
  return modelFinding(documentRef, ruleId, SEVERITIES.ERROR, message, details);
}
