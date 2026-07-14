import assert from "node:assert/strict";
import structure from "../rules/structure.mjs";
import metadata from "../rules/metadata.mjs";
import sections from "../rules/sections.mjs";
import prescriptions from "../rules/prescriptions.mjs";
import methods from "../rules/methods.mjs";
import terminology from "../rules/terminology.mjs";
import { validateRuleDefinition } from "../rules/rule-contract.mjs";

function documentRef(overrides = {}) {
  const normalized = overrides.normalized ?? [
    "# APL-M-HIP-I-ABC-BASE-01",
    "",
    "## Resumo Executivo",
    "Conteudo.",
    "",
    "## Metadados",
    "Versao: 1.0",
    "Status: Concluido",
    "",
    "| Exercicio | Series | Repeticoes | RIR | Descanso | Metodo |",
    "|---|---:|---:|---:|---|---|",
    "| Supino | 3 | 8-10 | 2 | 90s | Progressao Dupla |",
    "",
    "## Tags",
    "abc base iniciante",
  ].join("\n");
  return {
    sprint: overrides.sprint ?? "SPRINT_01",
    block: overrides.block ?? "ABC",
    file: overrides.file ?? "docs/apl/SPRINT_01/ABC/APL-M-HIP-I-ABC-BASE-01.md",
    document: {
      title: "APL-M-HIP-I-ABC-BASE-01",
      normalized,
      headings: [
        { level: 1, text: "APL-M-HIP-I-ABC-BASE-01", line: 1 },
        { level: 2, text: "Resumo Executivo", line: 3 },
        { level: 2, text: "Metadados", line: 6 },
        { level: 2, text: "Tags", line: 14 },
      ],
      sections: [
        { title: "Resumo Executivo", level: 2, line: 3, content: "Conteudo." },
        { title: "Metadados", level: 2, line: 6, content: "Versao: 1.0\nStatus: Concluido" },
        { title: "Tags", level: 2, line: 14, content: "abc base iniciante" },
      ],
      metadata: { modelCode: "APL-M-HIP-I-ABC-BASE-01", extension: ".md" },
    },
  };
}

function context(documents = [documentRef()]) {
  return {
    scanResult: {
      sprints: [
        {
          sprint: "SPRINT_01",
          blocks: [{ name: "ABC", files: documents.map((document) => document.file) }],
        },
      ],
    },
    documents,
    helpers: {
      getAllModelDocuments() {
        return documents;
      },
      findDocumentByFile(file) {
        return documents.find((document) => document.file === file);
      },
      getProjectStatusDocument() {
        return null;
      },
    },
  };
}

for (const rule of [structure, metadata, sections, prescriptions, methods, terminology]) {
  assert.equal(validateRuleDefinition(rule, rule.id), true);
  const findings = await rule.run(context());
  assert.equal(Array.isArray(findings), true);
}

const badTerminology = await terminology.run(context([documentRef({ normalized: "Treino insano sem linguagem tecnica." })]));
assert.equal(badTerminology.length, 1);
assert.equal(badTerminology[0].ruleId, "aqa-006");

const badPrescription = await prescriptions.run(context([documentRef({ normalized: "# APL-M-HIP-I-ABC-BASE-01\n\nSem tabela." })]));
assert.equal(badPrescription.some((finding) => finding.ruleId === "aqa-004"), true);

console.log("AQA official rules tests passed.");
