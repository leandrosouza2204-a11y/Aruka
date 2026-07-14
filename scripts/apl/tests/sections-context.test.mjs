import assert from "node:assert/strict";
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

console.log("AQA sections context tests passed.");
