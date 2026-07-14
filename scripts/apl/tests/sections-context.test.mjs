import assert from "node:assert/strict";
import { parseMarkdown } from "../parser.mjs";
import sections from "../rules/sections.mjs";
import { contextFor, documentRef, VALID_MODEL } from "./context-fixtures.mjs";

async function messages(markdown) {
  return (await sections.run(contextFor([documentRef(markdown)]))).map((finding) => finding.message);
}

assert.equal((await messages(VALID_MODEL)).filter((message) => message.includes("duplicada")).length, 0);

const duplicatedH2 = VALID_MODEL.replace("## Tags\n- hipertrofia", "## Tags\n- hipertrofia\n## Tags\n- duplicada");
assert.equal((await messages(duplicatedH2)).some((message) => message.includes("Secao Premium duplicada: Tags")), true);

const duplicatedH4 = VALID_MODEL.replace("#### Prescrição\n| Ordem", "#### Prescrição\nTexto.\n#### Prescrição\n| Ordem");
assert.equal((await messages(duplicatedH4)).some((message) => message.includes("Subsecao duplicada")), true);

const withoutObjective = VALID_MODEL.replace("#### Objetivo da sessão\nTexto.\n#### Prescrição", "#### Prescrição");
assert.equal((await messages(withoutObjective)).some((message) => message.includes("sem subsecao \"Objetivo da sessão\"")), true);

const withoutPrescription = VALID_MODEL.replace("#### Prescrição\n| Ordem | Exercício | Séries | Repetições | RIR | Descanso | Método | Observações |\n|---:|---|:---:|:---:|:---:|:---:|---|---|\n| 1 | Supino | 3 | 8–10 | 2 | 90 s | Tradicional | Controle |\n#### Justificativa", "#### Justificativa");
assert.equal((await messages(withoutPrescription)).some((message) => message.includes("sem subsecao \"Prescrição\"")), true);

const withoutJustification = VALID_MODEL.replace("#### Justificativa\nTexto.\n### Treino B", "### Treino B");
assert.equal((await messages(withoutJustification)).some((message) => message.includes("sem subsecao \"Justificativa\"")), true);

const wrongOrder = VALID_MODEL.replace("#### Objetivo da sessão\nTexto.\n#### Prescrição", "#### Prescrição\nTexto.\n#### Objetivo da sessão");
const wrongOrderFindings = await sections.run(contextFor([documentRef(wrongOrder)]));
assert.equal(wrongOrderFindings.some((finding) => finding.severity === "warning" && finding.message.includes("fora da ordem")), true);

const officialCoaching = await messages(VALID_MODEL);
assert.equal(officialCoaching.some((message) => message.includes("Coaching Notes ausente")), false);

const checklistBeforeTags = VALID_MODEL.replace("## Tags\n- hipertrofia\n## Checklist", "## Checklist\n- [x] OK\n## Tags");
assert.equal((await messages(checklistBeforeTags)).some((message) => message.includes("fora da ordem")), true);

const checklistBeforeEngineering = VALID_MODEL.replace(
  "## Engenharia do treino\nTexto.\n## Assinatura Técnica\nTexto.\n## Tags\n- hipertrofia\n## Checklist\n- [x] OK",
  "## Checklist\n- [x] OK\n## Engenharia do treino\nTexto.\n## Assinatura Técnica\nTexto.\n## Tags\n- hipertrofia",
);
assert.equal((await messages(checklistBeforeEngineering)).some((message) => message.includes("fora da ordem")), true);

const checklistCorrect = await messages(VALID_MODEL);
assert.equal(checklistCorrect.some((message) => message.includes("Checklist") && message.includes("fora da ordem")), false);

const duplicatedChecklist = VALID_MODEL.replace("## Checklist\n- [x] OK", "## Checklist\n- [x] OK\n## Checklist\n- [x] duplicado");
const duplicatedChecklistFindings = await sections.run(contextFor([documentRef(duplicatedChecklist)]));
assert.equal(duplicatedChecklistFindings.some((finding) => finding.severity === "warning" && finding.message.includes("Checklist")), true);

const h3BetweenH2 = VALID_MODEL.replace("## Tags\n- hipertrofia", "## Tags\n### Observação interna\nTexto.\n- hipertrofia");
assert.equal((await messages(h3BetweenH2)).some((message) => message.includes("fora da ordem")), false);

const tableBetweenH2 = VALID_MODEL.replace("## Tags\n- hipertrofia", "## Tags\n| Campo | Valor |\n|---|---|\n| A | B |\n- hipertrofia");
assert.equal((await messages(tableBetweenH2)).some((message) => message.includes("fora da ordem")), false);

for (const file of [
  "docs/apl/SPRINT_01/FULL_BODY/APL-M-HIP-I-FB-BASE-01.md",
  "docs/apl/SPRINT_01/FULL_BODY/APL-M-HIP-I-FB-PERF-01.md",
  "docs/apl/SPRINT_01/FULL_BODY/APL-M-HIP-I-FB-EFI-01.md",
]) {
  const parsed = await parseMarkdown(file);
  const document = {
    sprint: "SPRINT_01",
    block: "FULL_BODY",
    file,
    document: parsed,
  };
  const findings = await sections.run(contextFor([document]));
  assert.equal(findings.some((finding) => finding.message.includes("Checklist fora da ordem")), false);
}

console.log("AQA sections context tests passed.");
