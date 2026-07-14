# AQA Audit Report

## Executive Summary

- Version: AQA v1.1
- Result: FAILED
- BLOCKERS: 0
- ERRORS: 7
- WARNINGS: 58
- SUGGESTIONS: 0
- INFO: 0
- Duplicates removidos: 0
- Findings suprimidos: 0
- Root Causes: 6
- Confidence media: 81%
- Modelo mais critico: APL-M-HIP-I-ABC-BASE-01
- Regra mais violada: aqa-003
- Sprint mais critica: SPRINT_01

## Calibration Chart

```text
BLOCKERS     # 0
ERRORS       ### 7
WARNINGS     ######################## 58
SUGGESTIONS  # 0
INFO         # 0
```

## Summary

- Version: 1.0.0
- Target: sprint01
- Status: FAILED
- Exit code: 1
- Started: 2026-07-14T20:05:22.578Z
- Finished: 2026-07-14T20:05:23.390Z
- Duration: 808ms
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
| warning | 58 |
| error | 7 |
| fatal | 0 |

## Findings by Context

| Contexto | Findings |
| --- | --- |
| global | 53 |
| session | 12 |

## Baseline

- Arquivo: C:\Projetos\ConsultoriaFitness\reports\apl\.baseline.json
- Findings anterior: 368
- Findings atual: 65
- Delta findings: -303
- Delta BLOCKERS: +0
- Delta ERRORS: -6
- Delta WARNINGS: -297
- Delta SUGGESTIONS: +0

## Categories

| Category | Findings |
| --- | --- |
| Documentacao | 39 |
| Iniciante | 9 |
| Metodos | 6 |
| Terminologia | 4 |
| Prescricao | 3 |
| Estrutura | 2 |
| Status | 2 |

## Confidence

| Confidence | Findings |
| --- | --- |
| 90 | 35 |
| 70 | 30 |

## Root Causes

| Root Cause | Findings |
| --- | --- |
| Drop Set encontrado em modelo iniciante. | 3 |
| Secao Premium ausente: Distribuicao dos padroes de movimento. | 3 |

## Top BLOCKERS

Nenhuma ocorrencia.

## Top ERRORS

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

- Regra: aqa-007
- Mensagem: Contador de modelos concluidos diverge dos modelos existentes.
- Sugestao: Revisar contador de modelos concluidos no PROJECT_STATUS.

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

## Top WARNINGS

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

## Top SUGGESTIONS

Nenhuma ocorrencia.

## Rules

| Rule | Severity | Scope | Findings | Duration |
| --- | --- | --- | --- | --- |
| aqa-001 | error | global | 2 | 7ms |
| aqa-002 | error | model | 3 | 16ms |
| aqa-003 | error | model | 36 | 384ms |
| aqa-004 | error | prescription | 3 | 6ms |
| aqa-005 | warning | model | 6 | 30ms |
| aqa-006 | warning | document | 4 | 5ms |
| aqa-007 | error | global | 2 | 1ms |
| aqa-008 | error | model | 9 | 9ms |
| aqa-009 | warning | model | 0 | 0ms |

## Findings

### Fatal

Nenhuma ocorrencia.

### Errors

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

- Regra: aqa-007
- Mensagem: Contador de modelos concluidos diverge dos modelos existentes.
- Sugestao: Revisar contador de modelos concluidos no PROJECT_STATUS.

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
| aqa-003 | 36 |
| aqa-008 | 9 |
| aqa-005 | 6 |
| aqa-006 | 4 |
| aqa-002 | 3 |
| aqa-004 | 3 |
| aqa-001 | 2 |
| aqa-007 | 2 |

## Findings By Sprint

| Sprint | Findings |
| --- | --- |
| SPRINT_01 | 64 |

## Findings By Block

| Block | Findings |
| --- | --- |
| ABC | 27 |
| UPPER_LOWER | 26 |
| ABCD | 3 |
| ABCDE | 3 |
| FULL_BODY | 3 |
| _ROOT | 2 |

## Findings By File

| File | Findings |
| --- | --- |
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
| aqa-003 | 36 |
| aqa-008 | 9 |
| aqa-005 | 6 |
| aqa-006 | 4 |
| aqa-002 | 3 |
| aqa-004 | 3 |
| aqa-001 | 2 |
| aqa-007 | 2 |

## Top 10 Files

| File | Findings |
| --- | --- |
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

## Diagnostics

- info: Regra desabilitada: apl-example-error
- info: Regra desabilitada: apl-example-info
- info: Regra desabilitada: apl-example-warning

## Performance

- aqa-001: 7ms
- aqa-002: 16ms
- aqa-003: 384ms
- aqa-004: 6ms
- aqa-005: 30ms
- aqa-006: 5ms
- aqa-007: 1ms
- aqa-008: 9ms
- aqa-009: 0ms
