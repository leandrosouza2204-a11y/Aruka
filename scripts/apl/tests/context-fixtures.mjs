import { buildDocumentContext } from "../document-context.mjs";
import { extractHeadings, normalize } from "../utils/markdown.mjs";

export function parsedDocument(markdown, file = "docs/apl/SPRINT_01/ABC/APL-M-HIP-I-ABC-BASE-01.md") {
  const normalized = normalize(markdown);
  const parsed = {
    file,
    title: "APL-M-HIP-I-ABC-BASE-01",
    normalized,
    headings: extractHeadings(normalized),
    sections: [],
    metadata: {
      extension: ".md",
      modelCode: file.includes("APL-") ? file.split(/[\\/]/).pop().replace(/\.md$/, "") : undefined,
    },
  };
  return { ...parsed, context: buildDocumentContext(parsed) };
}

export function documentRef(markdown, overrides = {}) {
  const file = overrides.file ?? "docs/apl/SPRINT_01/ABC/APL-M-HIP-I-ABC-BASE-01.md";
  return {
    sprint: overrides.sprint ?? "SPRINT_01",
    block: overrides.block ?? "ABC",
    file,
    document: parsedDocument(markdown, file),
  };
}

export function contextFor(documents) {
  return {
    documents,
    helpers: {
      getAllModelDocuments() {
        return documents.filter((document) => Boolean(document.document.metadata.modelCode));
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

export const VALID_MODEL = `# Hipertrofia Base — ABC Iniciante

**Código:** \`APL-M-HIP-I-ABC-BASE-01\`

## Resumo Executivo
Texto.
## Problema que resolve
Texto.
## Quando utilizar
Texto.
## Quando evitar
Texto.
## Público-alvo
Texto.
## Pré-requisitos
Texto.
## Filosofia
Texto.
## Objetivo principal
Texto.
## Objetivos secundários
Texto.
## Metadados
| Campo | Valor |
|---|---|
| Código | APL-M-HIP-I-ABC-BASE-01 |
## Estrutura semanal
| Dia | Sessão |
|---|---|
| Segunda | Treino A |
## Diretrizes
Texto.
## Periodização
Texto.
## Progressão
Texto.
## Treinos
### Treino A — Peitoral
#### Objetivo da sessão
Texto.
#### Prescrição
| Ordem | Exercício | Séries | Repetições | RIR | Descanso | Método | Observações |
|---:|---|:---:|:---:|:---:|:---:|---|---|
| 1 | Supino | 3 | 8–10 | 2 | 90 s | Tradicional | Controle |
#### Justificativa
Texto.
### Treino B — Costas
#### Objetivo da sessão
Texto.
#### Prescrição
| Ordem | Exercício | Séries | Repetições | RIR | Descanso | Método | Observações |
|---:|---|:---:|:---:|:---:|:---:|---|---|
| 1 | Puxada | 3 | 8–10 | 2 | 90 s | Tradicional | Controle |
#### Justificativa
Texto.
### Treino C — Pernas
#### Objetivo da sessão
Texto.
#### Prescrição
| Ordem | Exercício | Séries | Repetições | RIR | Descanso | Método | Observações |
|---:|---|:---:|:---:|:---:|:---:|---|---|
| 1 | Leg Press | 3 | 10–12 | 2 | 120 s | Tradicional | Controle |
#### Justificativa
Texto.
## Volume semanal
| Grupo | Séries |
|---|---:|
| Peitoral | 3 |
## Distribuição dos padrões de movimento
Texto.
## Referências futuras ao AOE
Texto.
## Aruka Coaching Notes
Texto.
## Critérios de evolução
Texto.
## Aruka Score
| Critério | Nota |
|---|---:|
| Aprendizagem | 5 |
## Engenharia do treino
Texto.
## Assinatura Técnica
Texto.
## Tags
- hipertrofia
## Checklist
- [x] OK`;
