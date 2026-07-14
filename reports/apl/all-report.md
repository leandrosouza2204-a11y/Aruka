# AQA Audit Report

## Executive Summary

- Version: AQA v1.1
- Result: FAILED
- BLOCKERS: 5
- ERRORS: 21
- WARNINGS: 512
- SUGGESTIONS: 0
- INFO: 0
- Duplicates removidos: 16
- Findings suprimidos: 0
- Root Causes: 41
- Confidence media: 88%
- Modelo mais critico: APL-M-HIP-M-ABC-EFI-01
- Regra mais violada: aqa-003
- Sprint mais critica: SPRINT_02

## Calibration Chart

```text
BLOCKERS     # 5
ERRORS       # 21
WARNINGS     ######################## 512
SUGGESTIONS  # 0
INFO         # 0
```

## Summary

- Version: 1.2.0
- Target: all
- Status: FAILED
- Exit code: 1
- Started: 2026-07-14T20:06:12.717Z
- Finished: 2026-07-14T20:06:14.726Z
- Duration: 2010ms
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
| warning | 512 |
| error | 21 |
| fatal | 0 |

## Findings by Context

| Contexto | Findings |
| --- | --- |
| global | 526 |
| session | 12 |

## Baseline

- Arquivo: C:\Projetos\ConsultoriaFitness\reports\apl\.baseline.json
- Findings anterior: 538
- Findings atual: 538
- Delta findings: +0
- Delta BLOCKERS: +0
- Delta ERRORS: +0
- Delta WARNINGS: +0
- Delta SUGGESTIONS: +0

## Categories

| Category | Findings |
| --- | --- |
| Documentacao | 504 |
| Metodos | 10 |
| Iniciante | 9 |
| Estrutura | 7 |
| Terminologia | 4 |
| Prescricao | 3 |
| Status | 1 |

## Confidence

| Confidence | Findings |
| --- | --- |
| 90 | 489 |
| 70 | 34 |
| 80 | 15 |

## Root Causes

| Root Cause | Findings |
| --- | --- |
| Secao obrigatoria ausente: Assinatura Tecnica. | 15 |
| Drop Set encontrado em modelo iniciante. | 3 |
| Secao Premium ausente: Distribuicao dos padroes de movimento. | 3 |
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
| aqa-002 | error | model | 93 | 33ms |
| aqa-003 | error | model | 411 | 1321ms |
| aqa-004 | error | prescription | 3 | 9ms |
| aqa-005 | warning | model | 10 | 65ms |
| aqa-006 | warning | document | 4 | 10ms |
| aqa-007 | error | global | 2 | 4ms |
| aqa-008 | error | model | 9 | 10ms |
| aqa-009 | warning | model | 0 | 10ms |

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

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Secao: Distribuicao dos padroes de movimento
- Mensagem: Secao Premium ausente: Distribuicao dos padroes de movimento.
- Sugestao: Adicionar a secao "Distribuicao dos padroes de movimento" no modelo.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Drop Set encontrado em modelo iniciante.
- Sugestao: Remover tecnica intensiva ou mover para modelo de nivel adequado.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Drop Set encontrado em modelo iniciante.
- Sugestao: Remover tecnica intensiva ou mover para modelo de nivel adequado.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Drop Set encontrado em modelo iniciante.
- Sugestao: Remover tecnica intensiva ou mover para modelo de nivel adequado.

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

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Sessao: Treino A - Peitoral, deltoides e triceps
- Secao: Justificativa
- Linha: 105
- Mensagem: Sessao "Treino A - Peitoral, deltoides e triceps" sem subsecao "Justificativa".
- Sugestao: Adicionar "#### Justificativa" dentro da sessao "Treino A - Peitoral, deltoides e triceps".

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Sessao: Treino A - Peitoral, deltoides e triceps
- Secao: Objetivo da sessão
- Linha: 105
- Mensagem: Sessao "Treino A - Peitoral, deltoides e triceps" sem subsecao "Objetivo da sessão".
- Sugestao: Adicionar "#### Objetivo da sessão" dentro da sessao "Treino A - Peitoral, deltoides e triceps".

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Sessao: Treino A - Peitoral, deltoides e triceps
- Secao: Prescrição
- Linha: 105
- Mensagem: Sessao "Treino A - Peitoral, deltoides e triceps" sem subsecao "Prescrição".
- Sugestao: Adicionar "#### Prescrição" dentro da sessao "Treino A - Peitoral, deltoides e triceps".

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Sessao: Treino A - Peitoral, deltoides e triceps
- Secao: Prescrição
- Linha: 105
- Mensagem: Sessao "Treino A - Peitoral, deltoides e triceps" sem subsecao Prescricao.
- Sugestao: Adicionar subsecao de prescricao com tabela oficial.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Secao: Aruka Coaching Notes
- Linha: 183
- Mensagem: Alias legado utilizado: Coaching Notes.
- Sugestao: Preferir o titulo oficial "Aruka Coaching Notes" quando o modelo for revisado.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Sessao: Treino A - Peitoral, deltoides e triceps
- Secao: Justificativa
- Linha: 106
- Mensagem: Sessao "Treino A - Peitoral, deltoides e triceps" sem subsecao "Justificativa".
- Sugestao: Adicionar "#### Justificativa" dentro da sessao "Treino A - Peitoral, deltoides e triceps".

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Sessao: Treino A - Peitoral, deltoides e triceps
- Secao: Objetivo da sessão
- Linha: 106
- Mensagem: Sessao "Treino A - Peitoral, deltoides e triceps" sem subsecao "Objetivo da sessão".
- Sugestao: Adicionar "#### Objetivo da sessão" dentro da sessao "Treino A - Peitoral, deltoides e triceps".

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Sessao: Treino A - Peitoral, deltoides e triceps
- Secao: Prescrição
- Linha: 106
- Mensagem: Sessao "Treino A - Peitoral, deltoides e triceps" sem subsecao "Prescrição".
- Sugestao: Adicionar "#### Prescrição" dentro da sessao "Treino A - Peitoral, deltoides e triceps".

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Sessao: Treino A - Peitoral, deltoides e triceps
- Secao: Prescrição
- Linha: 106
- Mensagem: Sessao "Treino A - Peitoral, deltoides e triceps" sem subsecao Prescricao.
- Sugestao: Adicionar subsecao de prescricao com tabela oficial.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Secao: Aruka Coaching Notes
- Linha: 201
- Mensagem: Alias legado utilizado: Coaching Notes.
- Sugestao: Preferir o titulo oficial "Aruka Coaching Notes" quando o modelo for revisado.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Secao: Engenharia do treino
- Mensagem: Secao Premium ausente: Engenharia do treino.
- Sugestao: Adicionar a secao "Engenharia do treino" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Secao: Filosofia
- Mensagem: Secao Premium ausente: Filosofia.
- Sugestao: Adicionar a secao "Filosofia" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Secao: Referencias futuras ao AOE
- Mensagem: Secao Premium ausente: Referencias futuras ao AOE.
- Sugestao: Adicionar a secao "Referencias futuras ao AOE" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Sessao: Treino A - Peitoral, deltoides e triceps
- Secao: Justificativa
- Linha: 106
- Mensagem: Sessao "Treino A - Peitoral, deltoides e triceps" sem subsecao "Justificativa".
- Sugestao: Adicionar "#### Justificativa" dentro da sessao "Treino A - Peitoral, deltoides e triceps".

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Sessao: Treino A - Peitoral, deltoides e triceps
- Secao: Objetivo da sessão
- Linha: 106
- Mensagem: Sessao "Treino A - Peitoral, deltoides e triceps" sem subsecao "Objetivo da sessão".
- Sugestao: Adicionar "#### Objetivo da sessão" dentro da sessao "Treino A - Peitoral, deltoides e triceps".

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Sessao: Treino A - Peitoral, deltoides e triceps
- Secao: Prescrição
- Linha: 106
- Mensagem: Sessao "Treino A - Peitoral, deltoides e triceps" sem subsecao "Prescrição".
- Sugestao: Adicionar "#### Prescrição" dentro da sessao "Treino A - Peitoral, deltoides e triceps".

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Sessao: Treino A - Peitoral, deltoides e triceps
- Secao: Prescrição
- Linha: 106
- Mensagem: Sessao "Treino A - Peitoral, deltoides e triceps" sem subsecao Prescricao.
- Sugestao: Adicionar subsecao de prescricao com tabela oficial.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Secao: Aruka Coaching Notes
- Linha: 185
- Mensagem: Alias legado utilizado: Coaching Notes.
- Sugestao: Preferir o titulo oficial "Aruka Coaching Notes" quando o modelo for revisado.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Rest Pause encontrado em modelo iniciante.
- Sugestao: Substituir por progressao simples e controle de RIR.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Secao: Metadados
- Linha: 62
- Mensagem: Secao sem conteudo: Metadados.
- Sugestao: Preencher a secao com informacao objetiva.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Secao: Aruka Coaching Notes
- Linha: 233
- Mensagem: Alias legado utilizado: Coaching Notes.
- Sugestao: Preferir o titulo oficial "Aruka Coaching Notes" quando o modelo for revisado.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Drop Set duplicado no modelo.
- Sugestao: Limitar Drop Set a usos pontuais e justificados.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Rest Pause excessivo no modelo.
- Sugestao: Reduzir Rest Pause ou justificar o volume de tecnicas intensivas.

- Regra: aqa-006
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 16
- Mensagem: Termo inadequado encontrado: falha obrigatoria.
- Sugestao: Substituir por linguagem tecnica, precisa e verificavel.
- Trecho: falha obrigatoria

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Referencia a falha em modelo iniciante.
- Sugestao: Usar linguagem de proximidade da falha com margem tecnica.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Rest Pause encontrado em modelo iniciante.
- Sugestao: Substituir por progressao simples e controle de RIR.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Secao: Metadados
- Linha: 62
- Mensagem: Secao sem conteudo: Metadados.
- Sugestao: Preencher a secao com informacao objetiva.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Secao: Aruka Coaching Notes
- Linha: 233
- Mensagem: Alias legado utilizado: Coaching Notes.
- Sugestao: Preferir o titulo oficial "Aruka Coaching Notes" quando o modelo for revisado.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Drop Set duplicado no modelo.
- Sugestao: Limitar Drop Set a usos pontuais e justificados.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Rest Pause excessivo no modelo.
- Sugestao: Reduzir Rest Pause ou justificar o volume de tecnicas intensivas.

- Regra: aqa-006
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 16
- Mensagem: Termo inadequado encontrado: falha obrigatoria.
- Sugestao: Substituir por linguagem tecnica, precisa e verificavel.
- Trecho: falha obrigatoria

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Referencia a falha em modelo iniciante.
- Sugestao: Usar linguagem de proximidade da falha com margem tecnica.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Rest Pause encontrado em modelo iniciante.
- Sugestao: Substituir por progressao simples e controle de RIR.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Secao: Metadados
- Linha: 62
- Mensagem: Secao sem conteudo: Metadados.
- Sugestao: Preencher a secao com informacao objetiva.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Secao: Aruka Coaching Notes
- Linha: 233
- Mensagem: Alias legado utilizado: Coaching Notes.
- Sugestao: Preferir o titulo oficial "Aruka Coaching Notes" quando o modelo for revisado.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Drop Set duplicado no modelo.
- Sugestao: Limitar Drop Set a usos pontuais e justificados.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Rest Pause excessivo no modelo.
- Sugestao: Reduzir Rest Pause ou justificar o volume de tecnicas intensivas.

- Regra: aqa-006
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 16
- Mensagem: Termo inadequado encontrado: falha obrigatoria.
- Sugestao: Substituir por linguagem tecnica, precisa e verificavel.
- Trecho: falha obrigatoria

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Referencia a falha em modelo iniciante.
- Sugestao: Usar linguagem de proximidade da falha com margem tecnica.

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
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Secao: Aruka Coaching Notes
- Linha: 234
- Mensagem: Alias legado utilizado: Coaching Notes.
- Sugestao: Preferir o titulo oficial "Aruka Coaching Notes" quando o modelo for revisado.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Secao: Aruka Coaching Notes
- Linha: 235
- Mensagem: Alias legado utilizado: Coaching Notes.
- Sugestao: Preferir o titulo oficial "Aruka Coaching Notes" quando o modelo for revisado.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Secao: Aruka Coaching Notes
- Linha: 235
- Mensagem: Alias legado utilizado: Coaching Notes.
- Sugestao: Preferir o titulo oficial "Aruka Coaching Notes" quando o modelo for revisado.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Secao: Aruka Coaching Notes
- Linha: 238
- Mensagem: Alias legado utilizado: Coaching Notes.
- Sugestao: Preferir o titulo oficial "Aruka Coaching Notes" quando o modelo for revisado.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Secao: Aruka Coaching Notes
- Linha: 239
- Mensagem: Alias legado utilizado: Coaching Notes.
- Sugestao: Preferir o titulo oficial "Aruka Coaching Notes" quando o modelo for revisado.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Secao: Aruka Coaching Notes
- Linha: 238
- Mensagem: Alias legado utilizado: Coaching Notes.
- Sugestao: Preferir o titulo oficial "Aruka Coaching Notes" quando o modelo for revisado.

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

- Regra: aqa-006
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\README.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Linha: 35
- Mensagem: Termo inadequado encontrado: falha obrigatoria.
- Sugestao: Substituir por linguagem tecnica, precisa e verificavel.
- Trecho: falha obrigatoria

- Regra: aqa-007
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Mensagem: Bloco existente possivelmente ausente do PROJECT_STATUS: UPPER_LOWER.
- Sugestao: Conferir se o bloco esta declarado no status oficial.

### Information

Nenhuma ocorrencia.

## Findings By Rule

| Rule | Findings |
| --- | --- |
| aqa-003 | 411 |
| aqa-002 | 93 |
| aqa-005 | 10 |
| aqa-008 | 9 |
| aqa-001 | 7 |
| aqa-006 | 4 |
| aqa-004 | 3 |
| aqa-007 | 1 |

## Findings By Sprint

| Sprint | Findings |
| --- | --- |
| SPRINT_02 | 469 |
| SPRINT_01 | 64 |
| SPRINT_03 | 5 |

## Findings By Block

| Block | Findings |
| --- | --- |
| ABC | 122 |
| UPPER_LOWER | 121 |
| ABCD | 98 |
| ABCDE | 98 |
| FULL_BODY | 97 |
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
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md | 9 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md | 9 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md | 9 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md | 8 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md | 8 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md | 8 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\README.md | 1 |

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
| APL-M-HIP-I-ABC-BASE-01 | 9 |
| APL-M-HIP-I-ABC-EFI-01 | 9 |
| APL-M-HIP-I-ABC-PERF-01 | 9 |
| APL-M-HIP-I-UL-BASE-01 | 8 |
| APL-M-HIP-I-UL-ESP-PEITO-01 | 8 |
| APL-M-HIP-I-UL-PERF-01 | 8 |
| APL-M-HIP-I-ABCD-BASE-01 | 1 |
| APL-M-HIP-I-ABCD-EFI-01 | 1 |
| APL-M-HIP-I-ABCD-PERF-01 | 1 |
| APL-M-HIP-I-ABCDE-BASE-01 | 1 |
| APL-M-HIP-I-ABCDE-EFI-01 | 1 |
| APL-M-HIP-I-ABCDE-PERF-01 | 1 |
| APL-M-HIP-I-FB-BASE-01 | 1 |
| APL-M-HIP-I-FB-EFI-01 | 1 |
| APL-M-HIP-I-FB-PERF-01 | 1 |

## Most Violated Rules

| Rule | Findings |
| --- | --- |
| aqa-003 | 411 |
| aqa-002 | 93 |
| aqa-005 | 10 |
| aqa-008 | 9 |
| aqa-001 | 7 |
| aqa-006 | 4 |
| aqa-004 | 3 |
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
- aqa-002: 33ms
- aqa-003: 1321ms
- aqa-004: 9ms
- aqa-005: 65ms
- aqa-006: 10ms
- aqa-007: 4ms
- aqa-008: 10ms
- aqa-009: 10ms
