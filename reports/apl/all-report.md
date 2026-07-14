# AQA Audit Report

## Executive Summary

- Version: AQA v1.1
- Result: FAILED
- BLOCKERS: 5
- ERRORS: 16
- WARNINGS: 459
- SUGGESTIONS: 0
- INFO: 0
- Duplicates removidos: 15
- Findings suprimidos: 0
- Root Causes: 35
- Confidence media: 89%
- Modelo mais critico: APL-M-HIP-M-ABC-EFI-01
- Regra mais violada: aqa-003
- Sprint mais critica: SPRINT_02

## Calibration Chart

```text
BLOCKERS     # 5
ERRORS       # 16
WARNINGS     ######################## 459
SUGGESTIONS  # 0
INFO         # 0
```

## Summary

- Version: 1.2.0
- Target: all
- Status: FAILED
- Exit code: 1
- Started: 2026-07-14T20:37:33.390Z
- Finished: 2026-07-14T20:37:34.725Z
- Duration: 1336ms
- Files scanned: 51
- Documents parsed: 51
- Rules loaded: 9
- Rules executed: 9

## Findings Summary

| Severity | Count |
| --- | --- |
| blocker | 5 |
| info | 0 |
| suggestion | 0 |
| warning | 459 |
| error | 16 |
| fatal | 0 |

## Findings by Context

| Contexto | Findings |
| --- | --- |
| global | 480 |

## Baseline

- Arquivo: C:\Projetos\ConsultoriaFitness\reports\apl\.baseline.json
- Findings anterior: 480
- Findings atual: 480
- Delta findings: +0
- Delta BLOCKERS: +0
- Delta ERRORS: +0
- Delta WARNINGS: +0
- Delta SUGGESTIONS: +0

## Categories

| Category | Findings |
| --- | --- |
| Documentacao | 468 |
| Estrutura | 7 |
| Metodos | 4 |
| Status | 1 |

## Confidence

| Confidence | Findings |
| --- | --- |
| 90 | 456 |
| 80 | 15 |
| 70 | 9 |

## Root Causes

| Root Cause | Findings |
| --- | --- |
| Secao obrigatoria ausente: Assinatura Tecnica. | 15 |
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

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

## Top WARNINGS

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

## Top SUGGESTIONS

Nenhuma ocorrencia.

## Rules

| Rule | Severity | Scope | Findings | Duration |
| --- | --- | --- | --- | --- |
| aqa-001 | error | global | 22 | 6ms |
| aqa-002 | error | model | 90 | 27ms |
| aqa-003 | error | model | 378 | 922ms |
| aqa-004 | error | prescription | 0 | 7ms |
| aqa-005 | warning | model | 4 | 46ms |
| aqa-006 | warning | document | 0 | 7ms |
| aqa-007 | error | global | 1 | 2ms |
| aqa-008 | error | model | 0 | 9ms |
| aqa-009 | warning | model | 0 | 3ms |

## Findings

### Fatal

Nenhuma ocorrencia.

### Errors

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-007
- Mensagem: Contador de modelos concluidos diverge dos modelos existentes.
- Sugestao: Revisar contador de modelos concluidos no PROJECT_STATUS.

### Warnings

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Drop Set duplicado no modelo.
- Sugestao: Limitar Drop Set a usos pontuais e justificados.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Drop Set duplicado no modelo.
- Sugestao: Limitar Drop Set a usos pontuais e justificados.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Drop Set duplicado no modelo.
- Sugestao: Limitar Drop Set a usos pontuais e justificados.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Drop Set duplicado no modelo.
- Sugestao: Limitar Drop Set a usos pontuais e justificados.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Aruka Coaching Notes
- Mensagem: Secao Premium ausente: Aruka Coaching Notes.
- Sugestao: Adicionar a secao "Aruka Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Aruka Score
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Assinatura Tecnica
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Checklist
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Criterios de evolucao
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Diretrizes
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Estrutura semanal
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Metadados
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Objetivo principal
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Objetivos secundarios
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Periodizacao
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Pre-requisitos
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Problema que resolve
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Progressao
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Publico-alvo
- Mensagem: Secao Premium ausente: Publico-alvo.
- Sugestao: Adicionar a secao "Publico-alvo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Quando evitar
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Quando utilizar
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Resumo Executivo
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Tags
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Treinos
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Secao: Volume semanal
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

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
| aqa-003 | 378 |
| aqa-002 | 90 |
| aqa-001 | 7 |
| aqa-005 | 4 |
| aqa-007 | 1 |

## Findings By Sprint

| Sprint | Findings |
| --- | --- |
| SPRINT_02 | 469 |
| SPRINT_01 | 5 |
| SPRINT_03 | 5 |

## Findings By Block

| Block | Findings |
| --- | --- |
| FULL_BODY | 97 |
| ABC | 95 |
| ABCD | 95 |
| ABCDE | 95 |
| UPPER_LOWER | 95 |
| _ROOT | 2 |

## Findings By File

| File | Findings |
| --- | --- |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md | 32 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md | 32 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md | 32 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md | 32 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER.md | 1 |

## Findings By Model

| Model | Findings |
| --- | --- |
| APL-M-HIP-M-ABC-EFI-01 | 32 |
| APL-M-HIP-M-ABCD-ESP-PEITO-01 | 32 |
| APL-M-HIP-M-ABCDE-ESP-DELTS-01 | 32 |
| APL-M-HIP-M-UL-ESP-COSTAS-01 | 32 |
| APL-M-HIP-M-ABC-BASE-01 | 31 |
| APL-M-HIP-M-ABC-PERF-01 | 31 |
| APL-M-HIP-M-ABCD-BASE-01 | 31 |
| APL-M-HIP-M-ABCD-PERF-01 | 31 |
| APL-M-HIP-M-ABCDE-BASE-01 | 31 |
| APL-M-HIP-M-ABCDE-PERF-01 | 31 |
| APL-M-HIP-M-FB-BASE-01 | 31 |
| APL-M-HIP-M-FB-EFI-01 | 31 |
| APL-M-HIP-M-FB-PERF-01 | 31 |
| APL-M-HIP-M-UL-BASE-01 | 31 |
| APL-M-HIP-M-UL-PERF-01 | 31 |
| APL-M-HIP-I-FB-BASE-01 | 1 |
| APL-M-HIP-I-FB-EFI-01 | 1 |
| APL-M-HIP-I-FB-PERF-01 | 1 |

## Most Violated Rules

| Rule | Findings |
| --- | --- |
| aqa-003 | 378 |
| aqa-002 | 90 |
| aqa-001 | 7 |
| aqa-005 | 4 |
| aqa-007 | 1 |

## Top 10 Files

| File | Findings |
| --- | --- |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md | 32 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md | 32 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md | 32 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md | 32 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md | 31 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md | 31 |

## Diagnostics

- info: Regra desabilitada: apl-example-error
- info: Regra desabilitada: apl-example-info
- info: Regra desabilitada: apl-example-warning

## Performance

- aqa-001: 6ms
- aqa-002: 27ms
- aqa-003: 922ms
- aqa-004: 7ms
- aqa-005: 46ms
- aqa-006: 7ms
- aqa-007: 2ms
- aqa-008: 9ms
- aqa-009: 3ms
