# AQA Audit Report

## Executive Summary

- Version: AQA v1.1
- Result: FAILED
- BLOCKERS: 5
- ERRORS: 27
- WARNINGS: 1520
- SUGGESTIONS: 0
- INFO: 0
- Duplicates removidos: 16
- Findings suprimidos: 0
- Root Causes: 47
- Confidence media: 90%
- Modelo mais critico: APL-M-HIP-M-UL-ESP-COSTAS-01
- Regra mais violada: aqa-004
- Sprint mais critica: SPRINT_02

## Calibration Chart

```text
BLOCKERS     # 5
ERRORS       # 27
WARNINGS     ######################## 1520
SUGGESTIONS  # 0
INFO         # 0
```

## Summary

- Version: 1.0.0
- Target: all
- Status: FAILED
- Exit code: 1
- Started: 2026-07-14T19:48:37.715Z
- Finished: 2026-07-14T19:48:38.264Z
- Duration: 550ms
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
| warning | 1520 |
| error | 27 |
| fatal | 0 |

## Baseline

- Arquivo: C:\Projetos\ConsultoriaFitness\reports\apl\.baseline.json
- Findings anterior: 368
- Findings atual: 1552
- Delta findings: +1184
- Delta BLOCKERS: +5
- Delta ERRORS: +14
- Delta WARNINGS: +1165
- Delta SUGGESTIONS: +0

## Categories

| Category | Findings |
| --- | --- |
| Prescricao | 1035 |
| Documentacao | 486 |
| Metodos | 10 |
| Iniciante | 9 |
| Estrutura | 7 |
| Terminologia | 4 |
| Status | 1 |

## Confidence

| Confidence | Findings |
| --- | --- |
| 90 | 1512 |
| 70 | 25 |
| 80 | 15 |

## Root Causes

| Root Cause | Findings |
| --- | --- |
| Secao obrigatoria ausente: Assinatura Tecnica. | 15 |
| Secao Premium duplicada: Objetivo da sessao. | 9 |
| Secao Premium ausente: Coaching Notes. | 3 |
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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

## Top SUGGESTIONS

Nenhuma ocorrencia.

## Rules

| Rule | Severity | Scope | Findings | Duration |
| --- | --- | --- | --- | --- |
| aqa-001 | error | global | 22 | 7ms |
| aqa-002 | error | model | 93 | 33ms |
| aqa-003 | error | model | 393 | 65ms |
| aqa-004 | error | prescription | 1035 | 64ms |
| aqa-005 | warning | model | 10 | 53ms |
| aqa-006 | warning | document | 4 | 11ms |
| aqa-007 | error | global | 2 | 2ms |
| aqa-008 | error | model | 9 | 9ms |
| aqa-009 | warning | model | 0 | 2ms |

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
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Secao: Objetivo da sessao
- Linha: 139
- Mensagem: Secao Premium duplicada: Objetivo da sessao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Secao: Objetivo da sessao
- Linha: 140
- Mensagem: Secao Premium duplicada: Objetivo da sessao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Secao: Objetivo da sessao
- Linha: 140
- Mensagem: Secao Premium duplicada: Objetivo da sessao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Secao: Objetivo da sessao
- Linha: 136
- Mensagem: Secao Premium duplicada: Objetivo da sessao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Secao: Objetivo da sessao
- Linha: 137
- Mensagem: Secao Premium duplicada: Objetivo da sessao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Secao: Objetivo da sessao
- Linha: 136
- Mensagem: Secao Premium duplicada: Objetivo da sessao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Secao: Objetivo da sessao
- Linha: 140
- Mensagem: Secao Premium duplicada: Objetivo da sessao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Secao: Objetivo da sessao
- Linha: 140
- Mensagem: Secao Premium duplicada: Objetivo da sessao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Secao: Objetivo da sessao
- Linha: 140
- Mensagem: Secao Premium duplicada: Objetivo da sessao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 110
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 110
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 110
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 110
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 110
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 110
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 228
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 228
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 228
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 228
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 228
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 228
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 96
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 96
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 96
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 96
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 96
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-BASE-01
- Linha: 96
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 111
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 111
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 111
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 111
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 111
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 111
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 172
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 172
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 172
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 172
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 172
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 172
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 188
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 188
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 188
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 188
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 188
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 230
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 230
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 230
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 230
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 230
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 230
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 254
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 254
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 254
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 254
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 254
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 254
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 97
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 97
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 97
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 97
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 97
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-EFI-01
- Linha: 97
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 110
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 110
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 110
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 110
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 110
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 110
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 171
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 229
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 229
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 229
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 229
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 229
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 229
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 253
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 253
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 253
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 253
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 253
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 253
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 62
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 96
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 96
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 96
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 96
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 96
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABC
- Modelo: APL-M-HIP-M-ABC-PERF-01
- Linha: 96
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 100
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 100
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 100
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 100
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 100
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 100
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 114
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 114
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 114
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 114
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 114
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 114
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 187
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 274
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 274
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 274
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 274
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 274
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 274
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 102
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 102
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 102
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 102
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 102
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 102
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 116
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 116
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 116
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 116
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 116
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 116
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 281
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 281
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 281
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 281
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 281
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 281
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 65
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 65
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 65
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 65
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 65
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 65
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 79
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 79
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 79
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 79
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 79
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-ESP-PEITO-01
- Linha: 79
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 100
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 100
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 100
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 100
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 100
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 100
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 114
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 114
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 114
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 114
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 114
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 114
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 191
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 191
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 191
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 191
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 191
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 191
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 208
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 208
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 208
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 208
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 208
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 277
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 277
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 277
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 277
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 277
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 277
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCD
- Modelo: APL-M-HIP-M-ABCD-PERF-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 101
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 101
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 101
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 101
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 101
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 101
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 269
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 269
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 269
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 269
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 269
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 269
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 294
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 294
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 294
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 294
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 294
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 294
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 103
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 103
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 103
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 103
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 103
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 103
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 117
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 208
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 208
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 208
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 208
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 208
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 208
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 226
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 226
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 226
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 226
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 226
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 276
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 276
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 276
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 276
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 276
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 276
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 301
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 301
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 301
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 301
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 301
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 301
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 65
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 65
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 65
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 65
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 65
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 65
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 79
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 79
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 79
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 79
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 79
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-ESP-DELTS-01
- Linha: 79
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 101
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 101
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 101
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 101
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 101
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 101
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 115
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 270
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 270
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 270
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 270
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 270
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 270
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 295
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 295
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 295
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 295
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 295
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 295
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md
- Sprint: SPRINT_02
- Bloco: ABCDE
- Modelo: APL-M-HIP-M-ABCDE-PERF-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 113
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 113
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 113
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 113
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 113
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 113
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 174
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 174
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 174
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 174
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 174
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 174
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 278
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 278
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 278
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 278
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 278
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 278
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 78
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 99
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 99
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 99
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 99
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 99
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-BASE-01
- Linha: 99
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 278
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 278
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 278
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 278
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 278
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 278
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-EFI-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 173
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 279
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 279
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 279
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 279
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 279
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 279
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md
- Sprint: SPRINT_02
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-M-FB-PERF-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 113
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 113
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 113
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 113
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 113
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 113
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 224
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 224
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 224
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 224
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 224
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 224
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 283
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 283
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 283
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 283
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 283
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 283
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 99
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 99
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 99
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 99
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 99
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-BASE-01
- Linha: 99
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 190
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 207
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 222
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 256
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 283
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 283
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 283
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 283
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 283
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 283
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 64
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 77
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-ESP-COSTAS-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 112
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 189
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 206
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 206
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 206
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 206
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 206
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 220
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 220
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 220
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 220
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 220
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 220
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 255
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 255
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 255
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 255
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 255
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 255
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 282
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 282
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 282
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 282
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 282
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 282
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 63
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 76
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 76
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 76
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 76
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 76
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 76
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Linha: 98
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md
- Sprint: SPRINT_02
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-M-UL-PERF-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Secao: Prescricao
- Linha: 143
- Mensagem: Secao Premium duplicada: Prescricao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Secao: Justificativa
- Linha: 153
- Mensagem: Secao Premium duplicada: Justificativa.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 201
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 201
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 201
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 201
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 201
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 90
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 90
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 90
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 90
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 90
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-BASE-01
- Linha: 90
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Secao: Prescricao
- Linha: 144
- Mensagem: Secao Premium duplicada: Prescricao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Secao: Justificativa
- Linha: 154
- Mensagem: Secao Premium duplicada: Justificativa.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 202
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 202
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 202
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 202
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 202
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 91
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 91
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 91
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 91
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 91
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-EFI-01
- Linha: 91
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Secao: Prescricao
- Linha: 144
- Mensagem: Secao Premium duplicada: Prescricao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Secao: Justificativa
- Linha: 154
- Mensagem: Secao Premium duplicada: Justificativa.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 202
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 202
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 202
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 202
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 202
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 249
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 91
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 91
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 91
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 91
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 91
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCD
- Modelo: APL-M-HIP-I-ABCD-PERF-01
- Linha: 91
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Secao: Prescricao
- Linha: 140
- Mensagem: Secao Premium duplicada: Prescricao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Secao: Justificativa
- Linha: 149
- Mensagem: Secao Premium duplicada: Justificativa.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 214
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 214
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 214
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 214
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 214
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-BASE-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Secao: Prescricao
- Linha: 141
- Mensagem: Secao Premium duplicada: Prescricao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Secao: Justificativa
- Linha: 150
- Mensagem: Secao Premium duplicada: Justificativa.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 215
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 215
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 215
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 215
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 215
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 252
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 68
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-EFI-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Secao: Prescricao
- Linha: 140
- Mensagem: Secao Premium duplicada: Prescricao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Secao: Justificativa
- Linha: 149
- Mensagem: Secao Premium duplicada: Justificativa.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 214
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 214
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 214
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 214
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 214
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 251
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABCDE
- Modelo: APL-M-HIP-I-ABCDE-PERF-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Secao: Objetivo da sessao
- Linha: 136
- Mensagem: Secao Premium duplicada: Objetivo da sessao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Secao: Prescricao
- Linha: 140
- Mensagem: Secao Premium duplicada: Prescricao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Secao: Justificativa
- Linha: 151
- Mensagem: Secao Premium duplicada: Justificativa.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 216
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 216
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 216
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 216
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 216
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 216
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
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
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Secao: Assinatura Tecnica
- Linha: 232
- Mensagem: Secao fora da ordem Premium: Assinatura Tecnica.
- Sugestao: Reordenar as secoes conforme o catalogo Premium oficial.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-BASE-01
- Secao: Tags
- Linha: 240
- Mensagem: Secao fora da ordem Premium: Tags.
- Sugestao: Reordenar as secoes conforme o catalogo Premium oficial.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Secao: Objetivo da sessao
- Linha: 136
- Mensagem: Secao Premium duplicada: Objetivo da sessao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Secao: Prescricao
- Linha: 140
- Mensagem: Secao Premium duplicada: Prescricao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Secao: Justificativa
- Linha: 151
- Mensagem: Secao Premium duplicada: Justificativa.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Secao: Assinatura Tecnica
- Linha: 234
- Mensagem: Secao fora da ordem Premium: Assinatura Tecnica.
- Sugestao: Reordenar as secoes conforme o catalogo Premium oficial.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-EFI-01
- Secao: Tags
- Linha: 242
- Mensagem: Secao fora da ordem Premium: Tags.
- Sugestao: Reordenar as secoes conforme o catalogo Premium oficial.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Secao: Objetivo da sessao
- Linha: 136
- Mensagem: Secao Premium duplicada: Objetivo da sessao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Secao: Prescricao
- Linha: 140
- Mensagem: Secao Premium duplicada: Prescricao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Secao: Justificativa
- Linha: 151
- Mensagem: Secao Premium duplicada: Justificativa.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 178
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 216
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 216
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 216
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 216
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 216
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 216
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 67
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Linha: 88
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Secao: Assinatura Tecnica
- Linha: 232
- Mensagem: Secao fora da ordem Premium: Assinatura Tecnica.
- Sugestao: Reordenar as secoes conforme o catalogo Premium oficial.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md
- Sprint: SPRINT_01
- Bloco: FULL_BODY
- Modelo: APL-M-HIP-I-FB-PERF-01
- Secao: Tags
- Linha: 240
- Mensagem: Secao fora da ordem Premium: Tags.
- Sugestao: Reordenar as secoes conforme o catalogo Premium oficial.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Secao: Prescricao
- Linha: 144
- Mensagem: Secao Premium duplicada: Prescricao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Secao: Justificativa
- Linha: 154
- Mensagem: Secao Premium duplicada: Justificativa.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Secao: Aruka Score
- Linha: 246
- Mensagem: Secao Premium duplicada: Aruka Score.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

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

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-BASE-01
- Secao: Metadados
- Linha: 62
- Mensagem: Secao sem conteudo: Metadados.
- Sugestao: Preencher a secao com informacao objetiva.

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

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Secao: Prescricao
- Linha: 144
- Mensagem: Secao Premium duplicada: Prescricao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Secao: Justificativa
- Linha: 154
- Mensagem: Secao Premium duplicada: Justificativa.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Secao: Aruka Score
- Linha: 246
- Mensagem: Secao Premium duplicada: Aruka Score.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Linha: 89
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

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-ESP-PEITO-01
- Secao: Metadados
- Linha: 62
- Mensagem: Secao sem conteudo: Metadados.
- Sugestao: Preencher a secao com informacao objetiva.

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

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Secao: Prescricao
- Linha: 144
- Mensagem: Secao Premium duplicada: Prescricao.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Secao: Justificativa
- Linha: 154
- Mensagem: Secao Premium duplicada: Justificativa.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Secao: Aruka Score
- Linha: 246
- Mensagem: Secao Premium duplicada: Aruka Score.
- Sugestao: Consolidar secoes duplicadas em uma unica secao.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 204
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 218
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 248
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 66
- Mensagem: Coluna obrigatoria ausente na tabela: series.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: descanso.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: exercicio.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: metodo.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: repeticoes.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 89
- Mensagem: Coluna obrigatoria ausente na tabela: rir.
- Sugestao: Padronizar tabela de prescricao com todas as colunas obrigatorias.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Linha: 89
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

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md
- Sprint: SPRINT_01
- Bloco: UPPER_LOWER
- Modelo: APL-M-HIP-I-UL-PERF-01
- Secao: Metadados
- Linha: 62
- Mensagem: Secao sem conteudo: Metadados.
- Sugestao: Preencher a secao com informacao objetiva.

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
| aqa-004 | 1035 |
| aqa-003 | 393 |
| aqa-002 | 93 |
| aqa-005 | 10 |
| aqa-008 | 9 |
| aqa-001 | 7 |
| aqa-006 | 4 |
| aqa-007 | 1 |

## Findings By Sprint

| Sprint | Findings |
| --- | --- |
| SPRINT_02 | 1180 |
| SPRINT_01 | 367 |
| SPRINT_03 | 5 |

## Findings By Block

| Block | Findings |
| --- | --- |
| UPPER_LOWER | 370 |
| FULL_BODY | 334 |
| ABCD | 308 |
| ABCDE | 308 |
| ABC | 230 |
| _ROOT | 2 |

## Findings By File

| File | Findings |
| --- | --- |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md | 83 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md | 82 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md | 82 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md | 82 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md | 82 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md | 82 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md | 77 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md | 77 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md | 77 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md | 76 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-PERF-01.md | 76 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-BASE-01.md | 76 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-PERF-01.md | 76 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-BASE-01.md | 76 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-PERF-01.md | 76 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-BASE-01.md | 40 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-ESP-PEITO-01.md | 40 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\APL-M-HIP-I-UL-PERF-01.md | 40 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-BASE-01.md | 29 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-EFI-01.md | 29 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY\APL-M-HIP-I-FB-PERF-01.md | 29 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-BASE-01.md | 26 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-EFI-01.md | 26 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCD\APL-M-HIP-I-ABCD-PERF-01.md | 26 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-BASE-01.md | 26 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-EFI-01.md | 26 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABCDE\APL-M-HIP-I-ABCDE-PERF-01.md | 26 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER\README.md | 1 |

## Findings By Model

| Model | Findings |
| --- | --- |
| APL-M-HIP-M-UL-ESP-COSTAS-01 | 83 |
| APL-M-HIP-M-FB-BASE-01 | 82 |
| APL-M-HIP-M-FB-EFI-01 | 82 |
| APL-M-HIP-M-FB-PERF-01 | 82 |
| APL-M-HIP-M-UL-BASE-01 | 82 |
| APL-M-HIP-M-UL-PERF-01 | 82 |
| APL-M-HIP-M-ABC-EFI-01 | 77 |
| APL-M-HIP-M-ABCD-ESP-PEITO-01 | 77 |
| APL-M-HIP-M-ABCDE-ESP-DELTS-01 | 77 |
| APL-M-HIP-M-ABC-BASE-01 | 76 |
| APL-M-HIP-M-ABC-PERF-01 | 76 |
| APL-M-HIP-M-ABCD-BASE-01 | 76 |
| APL-M-HIP-M-ABCD-PERF-01 | 76 |
| APL-M-HIP-M-ABCDE-BASE-01 | 76 |
| APL-M-HIP-M-ABCDE-PERF-01 | 76 |
| APL-M-HIP-I-UL-BASE-01 | 40 |
| APL-M-HIP-I-UL-ESP-PEITO-01 | 40 |
| APL-M-HIP-I-UL-PERF-01 | 40 |
| APL-M-HIP-I-FB-BASE-01 | 29 |
| APL-M-HIP-I-FB-EFI-01 | 29 |
| APL-M-HIP-I-FB-PERF-01 | 29 |
| APL-M-HIP-I-ABCD-BASE-01 | 26 |
| APL-M-HIP-I-ABCD-EFI-01 | 26 |
| APL-M-HIP-I-ABCD-PERF-01 | 26 |
| APL-M-HIP-I-ABCDE-BASE-01 | 26 |
| APL-M-HIP-I-ABCDE-EFI-01 | 26 |
| APL-M-HIP-I-ABCDE-PERF-01 | 26 |

## Most Violated Rules

| Rule | Findings |
| --- | --- |
| aqa-004 | 1035 |
| aqa-003 | 393 |
| aqa-002 | 93 |
| aqa-005 | 10 |
| aqa-008 | 9 |
| aqa-001 | 7 |
| aqa-006 | 4 |
| aqa-007 | 1 |

## Top 10 Files

| File | Findings |
| --- | --- |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-ESP-COSTAS-01.md | 83 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-BASE-01.md | 82 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-EFI-01.md | 82 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\FULL_BODY\APL-M-HIP-M-FB-PERF-01.md | 82 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-BASE-01.md | 82 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\UPPER_LOWER\APL-M-HIP-M-UL-PERF-01.md | 82 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-EFI-01.md | 77 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCD\APL-M-HIP-M-ABCD-ESP-PEITO-01.md | 77 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABCDE\APL-M-HIP-M-ABCDE-ESP-DELTS-01.md | 77 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_02\ABC\APL-M-HIP-M-ABC-BASE-01.md | 76 |

## Diagnostics

- info: Regra desabilitada: apl-example-error
- info: Regra desabilitada: apl-example-info
- info: Regra desabilitada: apl-example-warning

## Performance

- aqa-001: 7ms
- aqa-002: 33ms
- aqa-003: 65ms
- aqa-004: 64ms
- aqa-005: 53ms
- aqa-006: 11ms
- aqa-007: 2ms
- aqa-008: 9ms
- aqa-009: 2ms
