import assert from "node:assert/strict";
import {
  getNonPrescriptionTables,
  getPrescriptionTables,
  getSessionSubsection,
  getTrainingSessions,
  resolveOfficialSectionName,
} from "../document-context.mjs";
import prescriptions from "../rules/prescriptions.mjs";
import { contextFor, documentRef, parsedDocument, VALID_MODEL } from "./context-fixtures.mjs";

const doc = parsedDocument(VALID_MODEL);
const sessions = getTrainingSessions(doc.context);

assert.equal(sessions.length, 3);
for (const session of sessions) {
  assert.ok(getSessionSubsection(session, "Objetivo da sessão"));
  assert.ok(getSessionSubsection(session, "Prescrição"));
  assert.ok(getSessionSubsection(session, "Justificativa"));
  assert.equal(getPrescriptionTables(session).length, 1);
}

assert.equal(getNonPrescriptionTables(doc.context).some((table) => table.contextType === "metadata"), true);
assert.equal(getNonPrescriptionTables(doc.context).some((table) => table.contextType === "volume"), true);
assert.equal(getNonPrescriptionTables(doc.context).some((table) => table.contextType === "score"), true);
assert.equal(doc.context.tables.filter((table) => table.contextType === "prescription").length, 3);

const readme = parsedDocument("# README\n\n| A | B |\n|---|---|\n| 1 | 2 |", "docs/apl/SPRINT_01/ABC/README.md");
assert.equal(readme.context.documentType, "readme");
const standard = parsedDocument("# Standard", "docs/apl/STANDARDS/APL_PREMIUM_TEMPLATE.md");
assert.equal(standard.context.documentType, "standard");
assert.equal(resolveOfficialSectionName("Coaching Notes"), "Aruka Coaching Notes");
assert.equal(resolveOfficialSectionName("Aruka Coaching Notes"), "Aruka Coaching Notes");

const missingTable = VALID_MODEL.replace(/\| 1 \| Puxada \| 3 \| 8–10 \| 2 \| 90 s \| Tradicional \| Controle \|/, "");
const findings = await prescriptions.run(contextFor([documentRef(missingTable)]));
assert.equal(findings.some((finding) => finding.message.includes("sem tabela de prescricao") || finding.message.includes("vazia")), true);

const cleanFindings = await prescriptions.run(contextFor([documentRef(VALID_MODEL)]));
assert.equal(cleanFindings.length, 0);

console.log("AQA parser context tests passed.");
