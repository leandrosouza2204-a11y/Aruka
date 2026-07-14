import assert from "node:assert/strict";
import prescriptions from "../rules/prescriptions.mjs";
import { contextFor, documentRef, VALID_MODEL } from "./context-fixtures.mjs";

async function findings(markdown) {
  return prescriptions.run(contextFor([documentRef(markdown)]));
}

assert.equal((await findings(VALID_MODEL)).length, 0);

const withAuxiliaryTables = VALID_MODEL.replace("## Metadados", "## Metadados\n| Campo | Valor |\n|---|---|\n| Tempo | 60 |\n");
assert.equal((await findings(withAuxiliaryTables)).length, 0);

const missingColumn = VALID_MODEL.replace("Ordem | Exercício | Séries | Repetições | RIR | Descanso | Método | Observações", "Ordem | Exercício | Séries | Repetições | RIR | Descanso | Observações");
const missingFindings = await findings(missingColumn);
assert.equal(missingFindings.filter((finding) => finding.message.includes("metodo")).length, 1);

const tableOutsidePrescription = VALID_MODEL.replace("## Volume semanal", "## Volume semanal\n| Reps | Sets |\n|---|---|\n| 10 | 3 |\n");
assert.equal((await findings(tableOutsidePrescription)).length, 0);

const noTable = VALID_MODEL.replace(/\| Ordem \| Exercício \| Séries \| Repetições \| RIR \| Descanso \| Método \| Observações \|\n\|---:\|---\|:---:\|:---:\|:---:\|:---:\|---\|---\|\n\| 1 \| Supino \| 3 \| 8–10 \| 2 \| 90 s \| Tradicional \| Controle \|/, "");
assert.equal((await findings(noTable)).some((finding) => finding.message.includes("sem tabela") || finding.message.includes("vazia")), true);

const multipleSessions = await findings(VALID_MODEL);
assert.equal(multipleSessions.length, 0);

console.log("AQA prescriptions context tests passed.");
