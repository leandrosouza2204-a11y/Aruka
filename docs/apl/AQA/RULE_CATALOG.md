# Catalogo De Regras AQA v1

| ID | Nome | Descricao | Escopo | Severidade | Tags |
|---|---|---|---|---|---|
| AQA-001 | Estrutura | Valida estrutura dos blocos, README, modelos, nomes, extensoes, duplicidades e arquivos vazios. | GLOBAL | ERROR | structure, filesystem |
| AQA-002 | Metadados | Valida titulo, codigo, versao, status, resumo, objetivos, metadados, assinatura tecnica e tags. | MODEL | ERROR | metadata, model |
| AQA-003 | Secoes Premium | Valida presenca, duplicidade e ordem das secoes Premium obrigatorias. | MODEL | ERROR | sections, premium |
| AQA-004 | Prescricao | Audita tabelas de exercicios, series, repeticoes, RIR, descanso e metodo. | PRESCRIPTION | ERROR | prescription, tables |
| AQA-005 | Metodos | Valida coerencia entre metodos como Progressao Dupla, Top Set, Back-off, Drop Set e Rest Pause. | MODEL | WARNING | methods, prescription |
| AQA-006 | Terminologia | Detecta termos inadequados e linguagem promocional fora do padrao tecnico. | DOCUMENT | WARNING | terminology, language |
| AQA-007 | PROJECT_STATUS | Compara PROJECT_STATUS com Sprints, blocos, modelos existentes e contadores. | GLOBAL | ERROR | project-status, metadata |
| AQA-008 | Regras para Iniciantes | Aplica restricoes de intensidade e complexidade para Sprint 01. | MODEL | ERROR | beginner, sprint01 |
| AQA-009 | Regras para Intermediarios | Audita progressao, metodos e especializacoes para Sprint 02. | MODEL | WARNING | intermediate, sprint02 |

Os IDs de execucao no CLI usam kebab-case em minusculas: `aqa-001`, `aqa-002`, `aqa-003`, `aqa-004`, `aqa-005`, `aqa-006`, `aqa-007`, `aqa-008` e `aqa-009`.
