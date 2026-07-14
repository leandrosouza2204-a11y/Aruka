# AQA Audit Report

## Executive Summary

- Version: AQA v1.1
- Result: PASSED_WITH_WARNINGS
- BLOCKERS: 0
- ERRORS: 0
- WARNINGS: 5
- SUGGESTIONS: 0
- INFO: 0
- Duplicates removidos: 0
- Findings suprimidos: 0
- Root Causes: 0
- Confidence media: 70%
- Modelo mais critico: APL-M-HIP-I-FB-BASE-01
- Regra mais violada: aqa-003
- Sprint mais critica: SPRINT_01

## Calibration Chart

```text
BLOCKERS     # 0
ERRORS       # 0
WARNINGS     ######################## 5
SUGGESTIONS  # 0
INFO         # 0
```

## Summary

- Version: 1.2.0
- Target: sprint01
- Status: PASSED_WITH_WARNINGS
- Exit code: 0
- Started: 2026-07-14T20:37:23.940Z
- Finished: 2026-07-14T20:37:24.794Z
- Duration: 856ms
- Files scanned: 31
- Documents parsed: 31
- Rules loaded: 9
- Rules executed: 9

## Findings Summary

| Severity | Count |
| --- | --- |
| blocker | 0 |
| info | 0 |
| suggestion | 0 |
| warning | 5 |
| error | 0 |
| fatal | 0 |

## Findings by Context

| Contexto | Findings |
| --- | --- |
| global | 5 |

## Baseline

- Arquivo: C:\Projetos\ConsultoriaFitness\reports\apl\.baseline.json
- Findings anterior: 5
- Findings atual: 5
- Delta findings: +0
- Delta BLOCKERS: +0
- Delta ERRORS: +0
- Delta WARNINGS: +0
- Delta SUGGESTIONS: +0

## Categories

| Category | Findings |
| --- | --- |
| Documentacao | 3 |
| Estrutura | 2 |

## Confidence

| Confidence | Findings |
| --- | --- |
| 70 | 5 |

## Root Causes

Nenhuma ocorrencia.

## Top BLOCKERS

Nenhuma ocorrencia.

## Top ERRORS

Nenhuma ocorrencia.

## Top WARNINGS

- Regra: aqa-001
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY.md
- Sprint: SPRINT_01
- Bloco: _ROOT
- Mensagem: Arquivo adicional desconhecido ou nome fora do padrao.
- Sugestao: Revisar se o arquivo faz parte da estrutura oficial da APL.

- Regra: aqa-001
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER.md
- Sprint: SPRINT_01
- Bloco: _ROOT
- Mensagem: Arquivo adicional desconhecido ou nome fora do padrao.
- Sugestao: Revisar se o arquivo faz parte da estrutura oficial da APL.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Secao: Checklist
- Linha: 250
- Mensagem: Secao fora da ordem Premium: Checklist.
- Sugestao: Reordenar as secoes H2 conforme o catalogo Premium oficial.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Secao: Checklist
- Linha: 252
- Mensagem: Secao fora da ordem Premium: Checklist.
- Sugestao: Reordenar as secoes H2 conforme o catalogo Premium oficial.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Secao: Checklist
- Linha: 250
- Mensagem: Secao fora da ordem Premium: Checklist.
- Sugestao: Reordenar as secoes H2 conforme o catalogo Premium oficial.

## Top SUGGESTIONS

Nenhuma ocorrencia.

## Rules

| Rule | Severity | Scope | Findings | Duration |
| --- | --- | --- | --- | --- |
| aqa-001 | error | global | 2 | 5ms |
| aqa-002 | error | model | 0 | 10ms |
| aqa-003 | error | model | 3 | 500ms |
| aqa-004 | error | prescription | 0 | 11ms |
| aqa-005 | warning | model | 0 | 39ms |
| aqa-006 | warning | document | 0 | 6ms |
| aqa-007 | error | global | 0 | 2ms |
| aqa-008 | error | model | 0 | 5ms |
| aqa-009 | warning | model | 0 | 1ms |

## Findings

### Fatal

Nenhuma ocorrencia.

### Errors

Nenhuma ocorrencia.

### Warnings

- Regra: aqa-001
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY.md
- Sprint: SPRINT_01
- Bloco: _ROOT
- Mensagem: Arquivo adicional desconhecido ou nome fora do padrao.
- Sugestao: Revisar se o arquivo faz parte da estrutura oficial da APL.

- Regra: aqa-001
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER.md
- Sprint: SPRINT_01
- Bloco: _ROOT
- Mensagem: Arquivo adicional desconhecido ou nome fora do padrao.
- Sugestao: Revisar se o arquivo faz parte da estrutura oficial da APL.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Secao: Checklist
- Linha: 250
- Mensagem: Secao fora da ordem Premium: Checklist.
- Sugestao: Reordenar as secoes H2 conforme o catalogo Premium oficial.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Secao: Checklist
- Linha: 252
- Mensagem: Secao fora da ordem Premium: Checklist.
- Sugestao: Reordenar as secoes H2 conforme o catalogo Premium oficial.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Secao: Checklist
- Linha: 250
- Mensagem: Secao fora da ordem Premium: Checklist.
- Sugestao: Reordenar as secoes H2 conforme o catalogo Premium oficial.

### Information

Nenhuma ocorrencia.

## Findings By Rule

| Rule | Findings |
| --- | --- |
| aqa-003 | 3 |
| aqa-001 | 2 |

## Findings By Sprint

| Sprint | Findings |
| --- | --- |
| SPRINT_01 | 5 |

## Findings By Block

| Block | Findings |
| --- | --- |
| FULL_BODY | 3 |
| _ROOT | 2 |

## Findings By File

| File | Findings |
| --- | --- |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER.md | 1 |

## Findings By Model

| Model | Findings |
| --- | --- |
| APL-M-HIP-I-FB-BASE-01 | 1 |
| APL-M-HIP-I-FB-EFI-01 | 1 |
| APL-M-HIP-I-FB-PERF-01 | 1 |

## Most Violated Rules

| Rule | Findings |
| --- | --- |
| aqa-003 | 3 |
| aqa-001 | 2 |

## Top 10 Files

| File | Findings |
| --- | --- |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER.md | 1 |

## Diagnostics

- info: Regra desabilitada: apl-example-error
- info: Regra desabilitada: apl-example-info
- info: Regra desabilitada: apl-example-warning

## Performance

- aqa-001: 5ms
- aqa-002: 10ms
- aqa-003: 500ms
- aqa-004: 11ms
- aqa-005: 39ms
- aqa-006: 6ms
- aqa-007: 2ms
- aqa-008: 5ms
- aqa-009: 1ms
