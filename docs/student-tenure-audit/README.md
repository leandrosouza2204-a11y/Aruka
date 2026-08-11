# Student Tenure And Contract Timeline Audit

Date: 2026-08-11

Decision: `BLOCKED_CANONICAL_TENURE_REQUIRES_DATA_MODEL_DECISION`

## Summary

The audit found a systemic domain ambiguity around `aluno.inicio`.

Today, renewal writes `formRenovacao.dataInicio` back into `aluno.inicio`, so the persisted field behaves as `CURRENT_CONTRACT_START_DATE`. At the same time, the student details summary uses that same field as the start of the whole student relationship, so it behaves as `CONSULTANCY_START_DATE`.

That makes `aluno.inicio` an overloaded domain field.

## Canonical Definitions

`CONSULTANCY_START_DATE`: first valid known date when the continuous consultancy relationship began.

`STUDENT_TENURE`: elapsed time between `CONSULTANCY_START_DATE` and the current date.

`CURRENT_CONTRACT_START_DATE`: start date of the currently active commercial contract or plan period.

`CURRENT_CONTRACT_END_DATE`: due/end date of the currently active commercial contract or plan period.

`RENEWAL_DATE`: event date that starts a new commercial period. It must not reset `CONSULTANCY_START_DATE`.

## Current Model

Schema evidence:

- `public.alunos.inicio`: single required date field.
- `public.alunos.vencimento`: current due date.
- `public.pagamentos.data_pagamento`: payment date.
- `public.pagamentos.vencimento_parcela`: installment due date.
- `public.pagamentos.vencimento_anterior` and `vencimento_novo`: renewal/payment evidence around due-date changes.
- `public.acompanhamento_eventos.ocorrido_em`, `plano_id`, `plano_nome`, `vencimento_anterior`, `vencimento_novo`, `metadata`: lifecycle event evidence.

Missing explicit fields:

- `consultancy_started_at`
- `current_contract_started_at`

`CANONICAL_TENURE_FIELD_MISSING=YES`

## Renewal Flow

Path:

UI renewal modal -> `useFinanceiroPage.confirmarRenovacaoPlano` -> `atualizarAlunoSupabase` -> optional `registrarPagamentoRenovacao` -> `registrarEventoAcompanhamento` -> reload.

Current mutations:

- `aluno.plano` changes to the new plan id.
- `aluno.valor` changes.
- `aluno.inicio` is overwritten with `formRenovacao.dataInicio`.
- `aluno.vencimento`, `aviso7`, `aviso1` change to the new contract timeline.
- `pagamento_recebido` and `data_pagamento` may change.
- accompaniment state is reactivated.
- payment history records `tipo_movimento=renovacao_plano`, `vencimento_anterior`, `vencimento_novo`, but does not store the new contract start.
- accompaniment history records `tipo=plano_renovado`, `plano_id`, `plano_nome`, `vencimento_anterior`, `vencimento_novo`, and metadata, but does not store previous plan/current start/new start explicitly.

Answer: renewal currently overwrites `aluno.inicio`.

Classification: `OVERLOADED_DOMAIN_FIELD`

## Implementations Found

| File | Function | Input | Source date | Output | Consumers | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `src/features/alunos/utils/alunosResumoOperacional.js` | `formatarTempoComoAluno` / `calcularMesesEntre` | `aluno.inicio` | current `alunos.inicio` | "Tempo como aluno" | Alunos details summary | Divergent |
| `src/services/pagamentosService.js` | `obterInicioConsultoria` | `aluno`, `pagamentos` | min of `aluno.inicio`, `vencimentoParcela`, `vencimentoAnterior`, `dataPagamento` where `<= hoje` | report `dataInicio` | Finance report/ranking, Alunos financial summary | Heuristic |
| `src/services/pagamentosService.js` | `calcularMesesEntre` | `dataInicioConsultoria` | derived by `obterInicioConsultoria` | `tempoConsultoriaMeses` | Finance report/ranking | Divergent but closer |
| `src/features/financeiro/hooks/useFinanceiroPage.js` | `calcularParcelaAtual` | `aluno.inicio` | current contract start | current installment number | Finance table/actions | Correct for current contract |
| `src/features/financeiro/utils/billingAttention.js` | `filtrarPagamentosContratoAtual` | `aluno.inicio`, `aluno.vencimento`, payments | current contract window | payment filtering for billing attention | Dashboard, Alunos, Financeiro | Correct for current contract |
| `src/data/alunosUtils.js` | `calcularDatas` | form plan start | selected contract start | contract due/alerts | Student create/edit | Correct for current contract |

## Consumers Matrix

| Screen | Displayed concept | Current source | Expected canonical source | Status |
| --- | --- | --- | --- | --- |
| Alunos details summary | Tempo como aluno | `aluno.inicio` | `deriveStudentTenure().consultancyStartDate` | FAIL |
| Alunos details plan section | Inicio | `aluno.inicio` | `CURRENT_CONTRACT_START_DATE`, label should say "Inicio do contrato" | AMBIGUOUS |
| Alunos create/edit | Inicio do plano | form `inicio` | `CURRENT_CONTRACT_START_DATE` | PASS |
| Finance report | Data de inicio / Tempo na consultoria | `obterInicioConsultoria` heuristic | canonical consultancy start helper | PARTIAL |
| Finance report | Contrato atual | `aluno.inicio` | `CURRENT_CONTRACT_START_DATE` | PASS |
| Finance table / billing attention | current contract window | `aluno.inicio` to `aluno.vencimento` | `CURRENT_CONTRACT_START_DATE`/`END_DATE` | PASS |
| Dashboard billing cards | contract/payment due alerts | canonical billing helper using current contract payments | current contract timeline | PASS |
| Renewal modal | Data de inicio da renovacao | `formRenovacao.dataInicio` | new current contract start | PASS |
| Renewal mutation | Updates current period | overwrites `aluno.inicio` | should update current contract start only | PASS if field is contract start |
| Accompaniment history | plan renewed event | `planoNome`, old/new due | explicit previous/new contract timeline | PARTIAL |
| Treinos | workout `dataInicio` | independent workout start | not student tenure | N/A |
| Avaliacoes | assessment dates | assessment date/anamnese | not student tenure | N/A |
| Student Experience | identity/workout access | student link/workout lifecycle | not student tenure | N/A |
| Admin users/logs | subscription/admin date filters | `assinaturas.data_inicio`, log filters | not student tenure | N/A |

## Payment History Audit

Payments can provide useful evidence, but they are not a complete contract history:

- `dataPagamento` is payment date, not consultancy start.
- `vencimentoParcela` is installment due date, not contract start.
- `vencimentoAnterior` and `vencimentoNovo` represent due-date transitions, not explicit period starts.
- `registrarPagamentoRenovacao` stores renewal due-date transition but omits `current_contract_start_date`.

`vencimentoParcela` semantic audit: no current consumer was found using it as contract start or consultancy start directly, except the finance report heuristic includes it as a possible historical minimum. That use should be replaced by a canonical timeline derivation because future/old installment dates are not the same concept as relationship start.

Future-date contamination: the finance heuristic filters dates with `data <= hoje`; that protects against future installments being selected as the start. The details summary has no future-date check beyond using `aluno.inicio`.

## Historical Reconstruction

Current data can sometimes infer consultancy start, but not robustly:

- Existing `acompanhamento_eventos` can record `acompanhamento_iniciado` and `plano_renovado`.
- Renewal events preserve new plan and old/new due dates.
- They do not preserve previous plan, previous contract start, new contract start, or complete period ranges.
- Payment history may include old installment due dates, but those are financial schedule dates, not a canonical contract ledger.

`Historical contract reconstruction`: PARTIAL/HEURISTIC

`Previous plan preservation`: PARTIAL, current renewal event keeps new plan only.

`DOMAIN_DECISION_REQUIRED`: reactivation/return after a gap is not defined as continuation or new consultancy cycle.

## Real Case

Amabile Lopes expected semantics on 2026-08-11:

- consultancy start: 2026-05-10
- current contract start: 2026-07-12
- current contract: Semestral Parcelado
- current contract end: 2027-01-12
- student tenure: approximately 3 months

The current details summary can show less than 1 month because it reads overwritten `aluno.inicio=2026-07-12`.

## Synthetic QA Contract

Future test `qa:student-tenure-contract` should cover:

- `QA Student Tenure Renewal`: first contract ~3 months ago, renewal ~1 month ago, expected tenure ~3 months/current contract age ~1 month.
- no-renewal student: consultancy start equals current contract start.
- early renewal: tenure does not restart.
- plan change: plan/current contract changes, consultancy start remains.
- multiple renewals: first continuous cycle remains start.
- payment history: later payments do not move start forward.
- future installments: future due dates do not influence tenure.
- legacy fallback: explicit classification when no canonical history exists.

## Recommended Implementation Plan

1. Add canonical domain helper, likely under `src/features/alunos/utils/studentContractTimeline.js` or `src/features/financeiro/utils/studentContractTimeline.js`.
2. Implement:
   - `deriveConsultancyStart`
   - `deriveCurrentContractTimeline`
   - `deriveStudentTenure`
3. Make Alunos details summary and Finance report consume the same helper.
4. Rename Alunos plan section label from "Inicio" to "Inicio do contrato".
5. Add `qa:student-tenure-contract` with synthetic scenarios.
6. Decide data model before migration:
   - Recommended minimum: explicit persisted `consultancy_started_at` and `current_contract_started_at`, or a proper `student_contracts` ledger.
   - Add renewal event metadata for previous/new plan and previous/new period only after model decision.

## Database Decision

`DATABASE_CHANGE_REQUIRED=RECOMMENDED`

Reason: a frontend/domain helper can reduce inconsistency now by using historical events/payments heuristically, but the schema does not contain unambiguous separated fields for consultancy start and current contract start. A robust long-term solution needs an explicit data model decision.

`MIGRATION_REQUIRED=NOT_NOW`

No migration was created in this audit.
