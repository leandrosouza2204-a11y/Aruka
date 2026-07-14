# AQA Audit Report

## Executive Summary

- Version: AQA v1.1
- Result: FAILED
- BLOCKERS: 9
- ERRORS: 27
- WARNINGS: 1834
- SUGGESTIONS: 0
- INFO: 0
- Duplicates removidos: 16
- Findings suprimidos: 0
- Root Causes: 51
- Confidence media: 90%
- Modelo mais critico: APL-M-HIP-M-UL-ESP-COSTAS-01
- Regra mais violada: aqa-004
- Sprint mais critica: SPRINT_02

## Calibration Chart

```text
BLOCKERS     # 9
ERRORS       # 27
WARNINGS     ######################## 1834
SUGGESTIONS  # 0
INFO         # 0
```

## Summary

- Version: 1.0.0
- Target: all
- Status: FAILED
- Exit code: 1
- Started: 2026-07-14T17:40:19.323Z
- Finished: 2026-07-14T17:40:19.697Z
- Duration: 370ms
- Files scanned: 50
- Documents parsed: 50
- Rules loaded: 9
- Rules executed: 9

## Findings Summary

| Severity | Count |
| --- | --- |
| blocker | 9 |
| info | 0 |
| suggestion | 0 |
| warning | 1834 |
| error | 27 |
| fatal | 0 |

## Baseline

- Arquivo: C:\Projetos\ConsultoriaFitness\reports\apl\.baseline.json
- Findings anterior: 1870
- Findings atual: 1870
- Delta findings: +0
- Delta BLOCKERS: +0
- Delta ERRORS: +0
- Delta WARNINGS: +0
- Delta SUGGESTIONS: +0

## Categories

| Category | Findings |
| --- | --- |
| Prescricao | 1137 |
| Documentacao | 680 |
| Iniciante | 26 |
| Metodos | 14 |
| Estrutura | 11 |
| Status | 1 |
| Terminologia | 1 |

## Confidence

| Confidence | Findings |
| --- | --- |
| 90 | 1810 |
| 70 | 29 |
| 80 | 21 |
| 100 | 10 |

## Root Causes

| Root Cause | Findings |
| --- | --- |
| Secao obrigatoria ausente: Assinatura Tecnica. | 18 |
| Secao obrigatoria ausente: Objetivo principal. | 9 |
| Arquivo vazio. | 3 |
| Diretorio esperado ausente: ABC | 1 |
| Diretorio esperado ausente: ABCD | 1 |
| Diretorio esperado ausente: ABCDE | 1 |
| Diretorio esperado ausente: FULL_BODY | 1 |
| Diretorio esperado ausente: UPPER_LOWER | 1 |
| README obrigatorio ausente no bloco. | 1 |

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

- Regra: aqa-001
- Sprint: SPRINT_01
- Bloco: ABC
- Mensagem: README obrigatorio ausente no bloco.
- Sugestao: Adicionar README.md com resumo do bloco.

- Regra: aqa-001
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Arquivo vazio.
- Sugestao: Preencher o documento ou remover o arquivo do escopo auditado.

- Regra: aqa-001
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Arquivo vazio.
- Sugestao: Preencher o documento ou remover o arquivo do escopo auditado.

- Regra: aqa-001
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Arquivo vazio.
- Sugestao: Preencher o documento ou remover o arquivo do escopo auditado.

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
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Codigo do modelo ausente ou incompatível no conteudo.
- Sugestao: Registrar o codigo oficial do modelo no documento.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Titulo principal ausente.
- Sugestao: Adicionar um heading H1 com o nome oficial do modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

## Top SUGGESTIONS

Nenhuma ocorrencia.

## Rules

| Rule | Severity | Scope | Findings | Duration |
| --- | --- | --- | --- | --- |
| aqa-001 | error | global | 26 | 4ms |
| aqa-002 | error | model | 147 | 23ms |
| aqa-003 | error | model | 533 | 38ms |
| aqa-004 | error | prescription | 1137 | 35ms |
| aqa-005 | warning | model | 14 | 14ms |
| aqa-006 | warning | document | 1 | 5ms |
| aqa-007 | error | global | 2 | 1ms |
| aqa-008 | error | model | 26 | 2ms |
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

### Warnings

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Codigo do modelo ausente ou incompatível no conteudo.
- Sugestao: Registrar o codigo oficial do modelo no documento.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Titulo principal ausente.
- Sugestao: Adicionar um heading H1 com o nome oficial do modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Nenhuma tabela de prescricao encontrada.
- Sugestao: Adicionar tabelas com exercicio, series, repeticoes, RIR, descanso e metodo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Status ausente.
- Sugestao: Informar o status do modelo nos metadados.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-BASE-01
- Mensagem: Nenhum metodo reconhecido encontrado.
- Sugestao: Declarar o metodo principal ou informar metodo convencional.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Codigo do modelo ausente ou incompatível no conteudo.
- Sugestao: Registrar o codigo oficial do modelo no documento.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Titulo principal ausente.
- Sugestao: Adicionar um heading H1 com o nome oficial do modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Nenhuma tabela de prescricao encontrada.
- Sugestao: Adicionar tabelas com exercicio, series, repeticoes, RIR, descanso e metodo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Status ausente.
- Sugestao: Informar o status do modelo nos metadados.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-EFI-01
- Mensagem: Nenhum metodo reconhecido encontrado.
- Sugestao: Declarar o metodo principal ou informar metodo convencional.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Codigo do modelo ausente ou incompatível no conteudo.
- Sugestao: Registrar o codigo oficial do modelo no documento.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao obrigatoria ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao obrigatoria ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao obrigatoria ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao obrigatoria ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Titulo principal ausente.
- Sugestao: Adicionar um heading H1 com o nome oficial do modelo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Versao ausente.
- Sugestao: Adicionar campo de versao nos metadados.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Aruka Score.
- Sugestao: Adicionar a secao "Aruka Score" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Assinatura Tecnica.
- Sugestao: Adicionar a secao "Assinatura Tecnica" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Checklist.
- Sugestao: Adicionar a secao "Checklist" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Coaching Notes.
- Sugestao: Adicionar a secao "Coaching Notes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Criterios de evolucao.
- Sugestao: Adicionar a secao "Criterios de evolucao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Diretrizes.
- Sugestao: Adicionar a secao "Diretrizes" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Estrutura semanal.
- Sugestao: Adicionar a secao "Estrutura semanal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Justificativa.
- Sugestao: Adicionar a secao "Justificativa" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Metadados.
- Sugestao: Adicionar a secao "Metadados" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Objetivo da sessao.
- Sugestao: Adicionar a secao "Objetivo da sessao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Objetivo principal.
- Sugestao: Adicionar a secao "Objetivo principal" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Objetivos secundarios.
- Sugestao: Adicionar a secao "Objetivos secundarios" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Periodizacao.
- Sugestao: Adicionar a secao "Periodizacao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Pre-requisitos.
- Sugestao: Adicionar a secao "Pre-requisitos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Prescricao.
- Sugestao: Adicionar a secao "Prescricao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Problema que resolve.
- Sugestao: Adicionar a secao "Problema que resolve" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Progressao.
- Sugestao: Adicionar a secao "Progressao" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Quando evitar.
- Sugestao: Adicionar a secao "Quando evitar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Quando utilizar.
- Sugestao: Adicionar a secao "Quando utilizar" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Resumo Executivo.
- Sugestao: Adicionar a secao "Resumo Executivo" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Tags.
- Sugestao: Adicionar a secao "Tags" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Treinos.
- Sugestao: Adicionar a secao "Treinos" no modelo.

- Regra: aqa-003
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao Premium ausente: Volume semanal.
- Sugestao: Adicionar a secao "Volume semanal" no modelo.

- Regra: aqa-004
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Nenhuma tabela de prescricao encontrada.
- Sugestao: Adicionar tabelas com exercicio, series, repeticoes, RIR, descanso e metodo.

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Secao obrigatoria ausente: Tags.
- Sugestao: Adicionar a secao "Tags".

- Regra: aqa-002
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Status ausente.
- Sugestao: Informar o status do modelo nos metadados.

- Regra: aqa-005
- Arquivo: C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md
- Sprint: SPRINT_01
- Bloco: ABC
- Modelo: APL-M-HIP-I-ABC-PERF-01
- Mensagem: Nenhum metodo reconhecido encontrado.
- Sugestao: Declarar o metodo principal ou informar metodo convencional.

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
| aqa-004 | 1137 |
| aqa-003 | 533 |
| aqa-002 | 147 |
| aqa-008 | 26 |
| aqa-005 | 14 |
| aqa-001 | 11 |
| aqa-006 | 1 |
| aqa-007 | 1 |

## Findings By Sprint

| Sprint | Findings |
| --- | --- |
| SPRINT_02 | 1180 |
| SPRINT_01 | 685 |
| SPRINT_03 | 5 |

## Findings By Block

| Block | Findings |
| --- | --- |
| FULL_BODY | 405 |
| UPPER_LOWER | 397 |
| ABCD | 369 |
| ABCDE | 361 |
| ABC | 336 |
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
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-BASE-01.md | 35 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-EFI-01.md | 35 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\ABC\APL-M-HIP-I-ABC-PERF-01.md | 35 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\FULL_BODY.md | 1 |
| C:\Projetos\ConsultoriaFitness\docs\apl\SPRINT_01\UPPER_LOWER.md | 1 |

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
| APL-M-HIP-I-ABC-BASE-01 | 35 |
| APL-M-HIP-I-ABC-EFI-01 | 35 |
| APL-M-HIP-I-ABC-PERF-01 | 35 |

## Most Violated Rules

| Rule | Findings |
| --- | --- |
| aqa-004 | 1137 |
| aqa-003 | 533 |
| aqa-002 | 147 |
| aqa-008 | 26 |
| aqa-005 | 14 |
| aqa-001 | 11 |
| aqa-006 | 1 |
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

- aqa-001: 4ms
- aqa-002: 23ms
- aqa-003: 38ms
- aqa-004: 35ms
- aqa-005: 14ms
- aqa-006: 5ms
- aqa-007: 1ms
- aqa-008: 2ms
- aqa-009: 1ms
