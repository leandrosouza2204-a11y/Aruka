# AQA Audit Report

## Executive Summary

- Version: AQA v1.1
- Result: FAILED
- BLOCKERS: 0
- ERRORS: 13
- WARNINGS: 355
- SUGGESTIONS: 0
- INFO: 0
- Duplicates removidos: 0
- Findings suprimidos: 0
- Root Causes: 12
- Confidence media: 89%
- Modelo mais critico: APL-M-HIP-I-UL-BASE-01
- Regra mais violada: aqa-004
- Sprint mais critica: SPRINT_01

## Calibration Chart

```text
BLOCKERS     # 0
ERRORS       # 13
WARNINGS     ######################## 355
SUGGESTIONS  # 0
INFO         # 0
```

## Summary

- Version: 1.0.0
- Target: sprint01
- Status: FAILED
- Exit code: 1
- Started: 2026-07-14T19:48:37.699Z
- Finished: 2026-07-14T19:48:38.052Z
- Duration: 354ms
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
| warning | 355 |
| error | 13 |
| fatal | 0 |

## Baseline

- Arquivo: C:\Projetos\ConsultoriaFitness\reports\apl\.baseline.json
- Findings anterior: 1561
- Findings atual: 368
- Delta findings: -1193
- Delta BLOCKERS: -5
- Delta ERRORS: -14
- Delta WARNINGS: -1174
- Delta SUGGESTIONS: +0

## Categories

| Category | Findings |
| --- | --- |
| Prescricao | 294 |
| Documentacao | 51 |
| Iniciante | 9 |
| Metodos | 6 |
| Terminologia | 4 |
| Estrutura | 2 |
| Status | 2 |

## Confidence

| Confidence | Findings |
| --- | --- |
| 90 | 347 |
| 70 | 21 |

## Root Causes

| Root Cause | Findings |
| --- | --- |
| Secao Premium duplicada: Objetivo da sessao. | 9 |
| Secao Premium ausente: Coaching Notes. | 3 |

## Top BLOCKERS

Nenhuma ocorrencia.

## Top ERRORS

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

## Top WARNINGS

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

## Top SUGGESTIONS

Nenhuma ocorrencia.

## Rules

| Rule | Severity | Scope | Findings | Duration |
| --- | --- | --- | --- | --- |
| aqa-001 | error | global | 2 | 6ms |
| aqa-002 | error | model | 3 | 14ms |
| aqa-003 | error | model | 48 | 28ms |
| aqa-004 | error | prescription | 294 | 22ms |
| aqa-005 | warning | model | 6 | 52ms |
| aqa-006 | warning | document | 4 | 9ms |
| aqa-007 | error | global | 2 | 2ms |
| aqa-008 | error | model | 9 | 6ms |
| aqa-009 | warning | model | 0 | 0ms |

## Findings

### Fatal

Nenhuma ocorrencia.

### Errors

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

- Regra: aqa-007
- Mensagem: Contador de modelos concluidos diverge dos modelos existentes.
- Sugestao: Revisar contador de modelos concluidos no PROJECT_STATUS.

### Warnings

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
| aqa-004 | 294 |
| aqa-003 | 48 |
| aqa-008 | 9 |
| aqa-005 | 6 |
| aqa-006 | 4 |
| aqa-002 | 3 |
| aqa-001 | 2 |
| aqa-007 | 2 |

## Findings By Sprint

| Sprint | Findings |
| --- | --- |
| SPRINT_01 | 367 |

## Findings By Block

| Block | Findings |
| --- | --- |
| UPPER_LOWER | 122 |
| FULL_BODY | 87 |
| ABCD | 78 |
| ABCDE | 78 |
| _ROOT | 2 |

## Findings By File

| File | Findings |
| --- | --- |
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
| aqa-004 | 294 |
| aqa-003 | 48 |
| aqa-008 | 9 |
| aqa-005 | 6 |
| aqa-006 | 4 |
| aqa-002 | 3 |
| aqa-001 | 2 |
| aqa-007 | 2 |

## Top 10 Files

| File | Findings |
| --- | --- |
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

## Diagnostics

- info: Regra desabilitada: apl-example-error
- info: Regra desabilitada: apl-example-info
- info: Regra desabilitada: apl-example-warning

## Performance

- aqa-001: 6ms
- aqa-002: 14ms
- aqa-003: 28ms
- aqa-004: 22ms
- aqa-005: 52ms
- aqa-006: 9ms
- aqa-007: 2ms
- aqa-008: 6ms
- aqa-009: 0ms
