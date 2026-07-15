# AQA Audit Report

## Executive Summary

- Version: AQA v1.1
- Result: FAILED
- BLOCKERS: 5
- ERRORS: 1
- WARNINGS: 0
- SUGGESTIONS: 0
- INFO: 0
- Duplicates removidos: 15
- Findings suprimidos: 0
- Root Causes: 20
- Confidence media: 90%
- Modelo mais critico: N/A
- Regra mais violada: aqa-001
- Sprint mais critica: SPRINT_03

## Calibration Chart

```text
BLOCKERS     ######################## 5
ERRORS       ##### 1
WARNINGS     # 0
SUGGESTIONS  # 0
INFO         # 0
```

## Summary

- Version: 1.2.1
- Target: all
- Status: FAILED
- Exit code: 1
- Started: 2026-07-15T02:08:46.057Z
- Finished: 2026-07-15T02:08:47.610Z
- Duration: 1553ms
- Files scanned: 47
- Documents parsed: 47
- Rules loaded: 9
- Rules executed: 9

## Findings Summary

| Severity | Count |
| --- | --- |
| blocker | 5 |
| info | 0 |
| suggestion | 0 |
| warning | 0 |
| error | 1 |
| fatal | 0 |

## Findings by Context

| Contexto | Findings |
| --- | --- |
| global | 6 |

## Baseline

- Arquivo: C:\Projetos\ConsultoriaFitness\reports\apl\.baseline.json
- Findings anterior: 0
- Findings atual: 6
- Delta findings: +6
- Delta BLOCKERS: +5
- Delta ERRORS: +1
- Delta WARNINGS: +0
- Delta SUGGESTIONS: +0

## Categories

| Category | Findings |
| --- | --- |
| Estrutura | 5 |
| Status | 1 |

## Confidence

| Confidence | Findings |
| --- | --- |
| 90 | 6 |

## Root Causes

| Root Cause | Findings |
| --- | --- |
| Diretorio esperado ausente: ABC | 1 |
| Diretorio esperado ausente: ABCD | 1 |
| Diretorio esperado ausente: ABCDE | 1 |
| Diretorio esperado ausente: FULL_BODY | 1 |
| Diretorio esperado ausente: UPPER_LOWER | 1 |

## Top BLOCKERS

- Regra: aqa-001
- Sprint: SPRINT_03
- Bloco: ABC
- Mensagem: Diretorio esperado ausente: ABC
- Sugestao: Criar o bloco esperado ou ajustar a configuracao oficial da Sprint.

- Regra: aqa-001
- Sprint: SPRINT_03
- Bloco: ABCD
- Mensagem: Diretorio esperado ausente: ABCD
- Sugestao: Criar o bloco esperado ou ajustar a configuracao oficial da Sprint.

- Regra: aqa-001
- Sprint: SPRINT_03
- Bloco: ABCDE
- Mensagem: Diretorio esperado ausente: ABCDE
- Sugestao: Criar o bloco esperado ou ajustar a configuracao oficial da Sprint.

- Regra: aqa-001
- Sprint: SPRINT_03
- Bloco: FULL_BODY
- Mensagem: Diretorio esperado ausente: FULL_BODY
- Sugestao: Criar o bloco esperado ou ajustar a configuracao oficial da Sprint.

- Regra: aqa-001
- Sprint: SPRINT_03
- Bloco: UPPER_LOWER
- Mensagem: Diretorio esperado ausente: UPPER_LOWER
- Sugestao: Criar o bloco esperado ou ajustar a configuracao oficial da Sprint.

## Top ERRORS

- Regra: aqa-007
- Mensagem: Contador de modelos concluidos diverge dos modelos existentes.
- Sugestao: Revisar contador de modelos concluidos no PROJECT_STATUS.

## Top WARNINGS

Nenhuma ocorrencia.

## Top SUGGESTIONS

Nenhuma ocorrencia.

## Rules

| Rule | Severity | Scope | Findings | Duration |
| --- | --- | --- | --- | --- |
| aqa-001 | error | global | 20 | 7ms |
| aqa-002 | error | model | 0 | 10ms |
| aqa-003 | error | model | 0 | 1015ms |
| aqa-004 | error | prescription | 0 | 18ms |
| aqa-005 | warning | model | 0 | 87ms |
| aqa-006 | warning | document | 0 | 12ms |
| aqa-007 | error | global | 1 | 4ms |
| aqa-008 | error | model | 0 | 11ms |
| aqa-009 | warning | model | 0 | 11ms |

## Findings

### Fatal

Nenhuma ocorrencia.

### Errors

- Regra: aqa-007
- Mensagem: Contador de modelos concluidos diverge dos modelos existentes.
- Sugestao: Revisar contador de modelos concluidos no PROJECT_STATUS.

### Warnings

Nenhuma ocorrencia.

### Information

Nenhuma ocorrencia.

## Findings By Rule

| Rule | Findings |
| --- | --- |
| aqa-001 | 5 |
| aqa-007 | 1 |

## Findings By Sprint

| Sprint | Findings |
| --- | --- |
| SPRINT_03 | 5 |

## Findings By Block

| Block | Findings |
| --- | --- |
| ABC | 1 |
| ABCD | 1 |
| ABCDE | 1 |
| FULL_BODY | 1 |
| UPPER_LOWER | 1 |

## Findings By File

Nenhuma ocorrencia.

## Findings By Model

Nenhuma ocorrencia.

## Most Violated Rules

| Rule | Findings |
| --- | --- |
| aqa-001 | 5 |
| aqa-007 | 1 |

## Top 10 Files

Nenhuma ocorrencia.

## Diagnostics

- info: Regra desabilitada: apl-example-error
- info: Regra desabilitada: apl-example-info
- info: Regra desabilitada: apl-example-warning

## Performance

- aqa-001: 7ms
- aqa-002: 10ms
- aqa-003: 1015ms
- aqa-004: 18ms
- aqa-005: 87ms
- aqa-006: 12ms
- aqa-007: 4ms
- aqa-008: 11ms
- aqa-009: 11ms
