# AQA Audit Report

## Executive Summary

- Version: AQA v1.1
- Result: FAILED
- BLOCKERS: 0
- ERRORS: 13
- WARNINGS: 567
- SUGGESTIONS: 0
- INFO: 0
- Duplicates removidos: 0
- Findings suprimidos: 0
- Root Causes: 12
- Confidence media: 89%
- Modelo mais critico: APL-M-HIP-I-FB-PERF-01
- Regra mais violada: aqa-004
- Sprint mais critica: SPRINT_01

## Calibration Chart

```text
BLOCKERS     # 0
ERRORS       # 13
WARNINGS     ######################## 567
SUGGESTIONS  # 0
INFO         # 0
```

## Summary

- Version: 1.0.0
- Target: sprint01
- Status: FAILED
- Exit code: 1
- Started: 2026-07-14T18:05:04.407Z
- Finished: 2026-07-14T18:05:04.621Z
- Duration: 214ms
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
| warning | 567 |
| error | 13 |
| fatal | 0 |

## Baseline

- Arquivo: C:\Projetos\ConsultoriaFitness\reports\apl\.baseline.json
- Findings anterior: 610
- Findings atual: 580
- Delta findings: -30
- Delta BLOCKERS: +0
- Delta ERRORS: -3
- Delta WARNINGS: -27
- Delta SUGGESTIONS: +0

## Categories

| Category | Findings |
| --- | --- |
| Prescricao | 393 |
| Documentacao | 149 |
| Iniciante | 26 |
| Metodos | 7 |
| Estrutura | 2 |
| Status | 2 |
| Terminologia | 1 |

## Confidence

| Confidence | Findings |
| --- | --- |
| 90 | 558 |
| 70 | 19 |
| 80 | 3 |

## Root Causes

| Root Cause | Findings |
| --- | --- |
| Secao obrigatoria ausente: Objetivo principal. | 9 |
| Secao obrigatoria ausente: Assinatura Tecnica. | 3 |

## Top BLOCKERS

Nenhuma ocorrencia.

## Top ERRORS

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

## Top WARNINGS

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

## Top SUGGESTIONS

Nenhuma ocorrencia.

## Rules

| Rule | Severity | Scope | Findings | Duration |
| --- | --- | --- | --- | --- |
| aqa-001 | error | global | 2 | 3ms |
| aqa-002 | error | model | 30 | 10ms |
| aqa-003 | error | model | 119 | 15ms |
| aqa-004 | error | prescription | 393 | 18ms |
| aqa-005 | warning | model | 7 | 8ms |
| aqa-006 | warning | document | 1 | 3ms |
| aqa-007 | error | global | 2 | 1ms |
| aqa-008 | error | model | 26 | 4ms |
| aqa-009 | warning | model | 0 | 1ms |

## Findings

### Fatal

Nenhuma ocorrencia.

### Errors

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-007
- Mensagem: Contador de modelos concluidos diverge dos modelos existentes.
- Sugestao: Revisar contador de modelos concluidos no PROJECT_STATUS.

### Warnings

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 124
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 124
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 124
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 124
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 124
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 149
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 149
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 149
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 149
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 149
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 149
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 159
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 159
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 159
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 159
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 159
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 159
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 44
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 44
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 44
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 44
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 44
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 44
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 55
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 55
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 55
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 55
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 55
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 55
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Drop Set encontrado em modelo iniciante.
- Sugestao: Remover tecnica intensiva ou mover para modelo de nivel adequado.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Mensagem: Referencia a falha em modelo iniciante.
- Sugestao: Usar linguagem de proximidade da falha com margem tecnica.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 153
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 153
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 153
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 153
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 153
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 153
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 39
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 39
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 39
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 39
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 39
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 39
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 50
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 50
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 50
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 50
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 50
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 50
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Drop Set encontrado em modelo iniciante.
- Sugestao: Remover tecnica intensiva ou mover para modelo de nivel adequado.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Mensagem: Referencia a falha em modelo iniciante.
- Sugestao: Usar linguagem de proximidade da falha com margem tecnica.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 140
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 140
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 140
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 140
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 140
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 140
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 150
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 150
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 150
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 150
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 150
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 150
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 43
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 43
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 43
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 43
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 43
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 43
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 54
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 54
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 54
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 54
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 54
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 54
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Mensagem: Referencia a falha em modelo iniciante.
- Sugestao: Usar linguagem de proximidade da falha com margem tecnica.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 136
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 136
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 136
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 136
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 136
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 163
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 163
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 163
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 163
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 163
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 163
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 42
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 42
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 42
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 42
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 42
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 42
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 53
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 53
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 53
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 53
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 53
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 53
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Top Set sem Back-off associado.
- Sugestao: Adicionar Back-off quando Top Set for usado ou justificar a excecao.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Drop Set encontrado em modelo iniciante.
- Sugestao: Remover tecnica intensiva ou mover para modelo de nivel adequado.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Rest Pause encontrado em modelo iniciante.
- Sugestao: Substituir por progressao simples e controle de RIR.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Mensagem: Referencia a falha em modelo iniciante.
- Sugestao: Usar linguagem de proximidade da falha com margem tecnica.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 169
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 169
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 169
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 169
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 169
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 169
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 179
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 179
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 179
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 179
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 179
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 179
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-006
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 29
- Mensagem: Termo inadequado encontrado: falha obrigatoria.
- Sugestao: Substituir por linguagem tecnica, precisa e verificavel.
- Trecho: falha obrigatoria

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Mensagem: Referencia a falha em modelo iniciante.
- Sugestao: Usar linguagem de proximidade da falha com margem tecnica.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 134
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 134
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 134
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 134
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 134
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 161
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 161
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 161
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 161
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 161
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 161
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Drop Set encontrado em modelo iniciante.
- Sugestao: Remover tecnica intensiva ou mover para modelo de nivel adequado.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Rest Pause encontrado em modelo iniciante.
- Sugestao: Substituir por progressao simples e controle de RIR.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Drop Set duplicado no modelo.
- Sugestao: Limitar Drop Set a usos pontuais e justificados.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Rest Pause excessivo no modelo.
- Sugestao: Reduzir Rest Pause ou justificar o volume de tecnicas intensivas.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Mensagem: Referencia a falha em modelo iniciante.
- Sugestao: Usar linguagem de proximidade da falha com margem tecnica.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 131
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 131
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 131
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 131
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 131
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 131
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 157
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 157
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 157
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 157
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 157
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 157
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 41
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 41
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 41
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 41
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 41
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 41
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 53
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 53
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 53
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 53
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 53
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 53
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 83
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 99
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Referencia a falha em modelo iniciante.
- Sugestao: Usar linguagem de proximidade da falha com margem tecnica.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 130
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 130
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 130
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 130
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 130
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 130
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 155
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 155
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 155
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 155
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 155
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 155
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 165
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 165
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 165
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 165
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 165
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 165
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 65
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 79
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 93
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Top Set sem Back-off associado.
- Sugestao: Adicionar Back-off quando Top Set for usado ou justificar a excecao.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Referencia a falha em modelo iniciante.
- Sugestao: Usar linguagem de proximidade da falha com margem tecnica.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 125
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 125
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 125
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 125
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 125
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 125
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 150
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 150
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 150
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 150
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 150
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 150
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 160
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 160
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 160
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 160
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 160
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 160
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 65
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 80
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 95
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Drop Set encontrado em modelo iniciante.
- Sugestao: Remover tecnica intensiva ou mover para modelo de nivel adequado.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Rest Pause encontrado em modelo iniciante.
- Sugestao: Substituir por progressao simples e controle de RIR.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Drop Set duplicado no modelo.
- Sugestao: Limitar Drop Set a usos pontuais e justificados.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Rest Pause excessivo no modelo.
- Sugestao: Reduzir Rest Pause ou justificar o volume de tecnicas intensivas.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Referencia a falha em modelo iniciante.
- Sugestao: Usar linguagem de proximidade da falha com margem tecnica.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 128
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 128
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 128
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 128
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 128
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 168
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 168
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 168
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 168
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 168
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 168
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Top Set sem Back-off associado.
- Sugestao: Adicionar Back-off quando Top Set for usado ou justificar a excecao.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Drop Set encontrado em modelo iniciante.
- Sugestao: Remover tecnica intensiva ou mover para modelo de nivel adequado.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Rest Pause encontrado em modelo iniciante.
- Sugestao: Substituir por progressao simples e controle de RIR.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Mensagem: Referencia a falha em modelo iniciante.
- Sugestao: Usar linguagem de proximidade da falha com margem tecnica.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 127
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 127
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 127
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 127
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 127
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 143
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 143
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 143
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 143
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 143
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 143
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 177
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 177
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 177
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 177
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 177
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 177
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Drop Set encontrado em modelo iniciante.
- Sugestao: Remover tecnica intensiva ou mover para modelo de nivel adequado.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Rest Pause encontrado em modelo iniciante.
- Sugestao: Substituir por progressao simples e controle de RIR.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Mensagem: Referencia a falha em modelo iniciante.
- Sugestao: Usar linguagem de proximidade da falha com margem tecnica.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 128
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 128
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 128
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 128
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 128
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 142
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 167
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 177
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 177
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 177
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 177
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 177
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 177
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 40
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 51
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Drop Set encontrado em modelo iniciante.
- Sugestao: Remover tecnica intensiva ou mover para modelo de nivel adequado.

- Regra: aqa-008
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Mensagem: Rest Pause encontrado em modelo iniciante.
- Sugestao: Substituir por progressao simples e controle de RIR.

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
| aqa-004 | 393 |
| aqa-003 | 119 |
| aqa-002 | 30 |
| aqa-008 | 26 |
| aqa-005 | 7 |
| aqa-001 | 2 |
| aqa-007 | 2 |
| aqa-006 | 1 |

## Findings By Sprint

| Sprint | Findings |
| --- | --- |
| SPRINT_01 | 579 |

## Findings By Block

| Block | Findings |
| --- | --- |
| FULL_BODY | 158 |
| UPPER_LOWER | 149 |
| ABCD | 139 |
| ABCDE | 131 |
| _ROOT | 2 |

## Findings By File

| File | Findings |
| --- | --- |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md | 55 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md | 52 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md | 51 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md | 50 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md | 49 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md | 49 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md | 47 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md | 47 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md | 45 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md | 45 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md | 44 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md | 42 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER.md | 1 |

## Findings By Model

| Model | Findings |
| --- | --- |
| APL-M-HIP-I-FB-PERF-01 | 55 |
| APL-M-HIP-I-FB-EFI-01 | 52 |
| APL-M-HIP-I-FB-BASE-01 | 51 |
| APL-M-HIP-I-UL-BASE-01 | 50 |
| APL-M-HIP-I-UL-ESP-PEITO-01 | 49 |
| APL-M-HIP-I-UL-PERF-01 | 49 |
| APL-M-HIP-I-ABCD-BASE-01 | 47 |
| APL-M-HIP-I-ABCD-EFI-01 | 47 |
| APL-M-HIP-I-ABCD-PERF-01 | 45 |
| APL-M-HIP-I-ABCDE-PERF-01 | 45 |
| APL-M-HIP-I-ABCDE-BASE-01 | 44 |
| APL-M-HIP-I-ABCDE-EFI-01 | 42 |

## Most Violated Rules

| Rule | Findings |
| --- | --- |
| aqa-004 | 393 |
| aqa-003 | 119 |
| aqa-002 | 30 |
| aqa-008 | 26 |
| aqa-005 | 7 |
| aqa-001 | 2 |
| aqa-007 | 2 |
| aqa-006 | 1 |

## Top 10 Files

| File | Findings |
| --- | --- |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md | 55 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md | 52 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md | 51 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md | 50 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md | 49 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md | 49 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md | 47 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md | 47 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md | 45 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md | 45 |

## Diagnostics

- info: Regra desabilitada: apl-example-error
- info: Regra desabilitada: apl-example-info
- info: Regra desabilitada: apl-example-warning

## Performance

- aqa-001: 3ms
- aqa-002: 10ms
- aqa-003: 15ms
- aqa-004: 18ms
- aqa-005: 8ms
- aqa-006: 3ms
- aqa-007: 1ms
- aqa-008: 4ms
- aqa-009: 1ms
